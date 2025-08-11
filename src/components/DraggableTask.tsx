'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import DeleteConfirmation from '@/components/ui/delete-confirmation';
import { useCommentCount, useComments } from '@/hooks/useComments';
import { useDnd } from '@/providers/DndProvider';
import { List, Task } from '@/types';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { AlertTriangle, Calendar, Eye, MessageSquare, Trash2 } from 'lucide-react';
import { useState } from 'react';
import CommentDialog from './CommentDialog';
import TaskDetailsModal from './TaskDetailsModal';

interface DraggableTaskProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  lists: List[];
  isMoving?: boolean;
  isUpdatingPosition?: boolean;
}

export default function DraggableTask({ task, onEdit, onDelete, lists, isMoving = false, isUpdatingPosition = false }: DraggableTaskProps) {
  const { isDragging } = useDnd();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Get comments and comment count for this task
  const {
    comments,
    createComment,
    updateComment,
    deleteComment,
    isCreating,
    isUpdating,
    isDeleting
  } = useComments(task.id);

  const { data: commentCount = 0 } = useCommentCount(task.id);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isTaskDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: 'task',
      task,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isTaskDragging ? 0.5 : 1,
    zIndex: isTaskDragging ? 1000 : 1,
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'todo': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date() && new Date(dueDate).toDateString() !== new Date().toDateString();
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        group p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 
        transition-all duration-200 cursor-grab active:cursor-grabbing
        shadow-sm hover:shadow-md relative
        ${isTaskDragging ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}
        ${isDragging && !isTaskDragging ? 'opacity-50' : ''}
      `}
    >
      {(isMoving || isUpdatingPosition) && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-lg z-10 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs text-blue-600 font-medium">
              {isMoving ? 'Moving...' : 'Updating...'}
            </span>
          </div>
        </div>
      )}
      {isTaskDragging && (
        <div className="absolute inset-0 bg-blue-50/80 backdrop-blur-sm rounded-lg z-5 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs text-blue-600 font-medium">Dragging...</span>
          </div>
        </div>
      )}
      <div
        className="flex items-start justify-between cursor-pointer"
        onClick={(e) => {
          const target = e.target as HTMLElement;
          const isInteractive = target.closest('button, input, textarea, select, a, [role="button"]');

          if (!isInteractive) {
            onEdit(task);
          }
        }}
      >
        <div className="flex-1 min-w-0">
          {/* Position indicator */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full flex items-center gap-1">
              #{task.position || '?'}
              {isUpdatingPosition && (
                <div className="w-2 h-2 border border-blue-500 border-t-transparent rounded-full animate-spin" />
              )}
            </span>
            <h4 className="text-sm font-medium text-gray-900 truncate flex items-center gap-2">
              {task.title}
              {(isMoving || isUpdatingPosition) && (
                <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              )}
            </h4>
          </div>

          {task.description && (
            <p className="text-xs text-gray-600 mb-3 line-clamp-2">
              {task.description}
            </p>
          )}

          <div className="flex items-center space-x-2 mb-2">
            <Badge variant="outline" className={`text-xs ${getPriorityColor(task.priority)} flex items-center gap-1`}>
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              {isMoving && (
                <div className="w-2 h-2 border border-current border-t-transparent rounded-full animate-spin" />
              )}
            </Badge>
            <Badge variant="outline" className={`text-xs ${getStatusColor(task.status)} flex items-center gap-1`}>
              {task.status.replace('_', ' ').charAt(0).toUpperCase() + task.status.replace('_', ' ').slice(1)}
              {isUpdatingPosition && (
                <div className="w-2 h-2 border border-current border-t-transparent rounded-full animate-spin" />
              )}
            </Badge>
          </div>

          {task.due_date && (
            <div className={`flex items-center space-x-1 text-xs ${isOverdue(task.due_date) ? 'text-red-600' : 'text-gray-500'}`}>
              <Calendar className="h-3 w-3" />
              <span className="flex items-center gap-1">
                {isOverdue(task.due_date) && <AlertTriangle className="h-3 w-3 inline mr-1" />}
                Due: {new Date(task.due_date).toLocaleDateString()}
                {(isMoving || isUpdatingPosition) && (
                  <div className="w-2 h-2 border border-current border-t-transparent rounded-full animate-spin" />
                )}
              </span>
            </div>
          )}
        </div>

        <div className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-gray-400 hover:text-blue-600"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsDetailsOpen(true);
            }}
            title="View Details"
            disabled={isMoving || isUpdatingPosition}
          >
            <Eye className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-gray-400 hover:text-blue-600"
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsCommentOpen(true);
            }}
            title="Comments"
            disabled={isMoving || isUpdatingPosition}
          >
            <MessageSquare className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-gray-400 hover:text-red-600"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsDeleteOpen(true);
            }}
            title="Delete Task"
            disabled={isMoving || isUpdatingPosition}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Drag handle indicator */}
      <div className="mt-2 pt-2 border-t border-gray-100">
        <div className="flex justify-center">
          <div
            className={`w-8 h-1 rounded-full transition-opacity cursor-grab active:cursor-grabbing ${
              (isMoving || isUpdatingPosition) ? 'bg-blue-400 animate-pulse' : 'bg-gray-300 opacity-0 group-hover:opacity-100'
            }`}
            title="Drag to reorder this task"
          />
        </div>
        <div className="text-center mt-1">
          <span className={`text-xs text-gray-400 transition-opacity ${
            (isMoving || isUpdatingPosition) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}>
            {(isMoving || isUpdatingPosition) ? 'Updating...' : 'Drag to reorder'}
          </span>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmation
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={async () => {
          try {
            await onDelete(task.id);
            setIsDeleteOpen(false);
          } catch (error) {
            console.error('Failed to delete task:', error);
            // Keep dialog open if deletion fails
          }
        }}
        title="Delete Task"
        message="Are you sure you want to delete this task?"
        itemName={task.title}
        itemType="task"
        variant="danger"
      />

      {/* Comment Dialog */}
      <CommentDialog
        isOpen={isCommentOpen}
        onClose={() => setIsCommentOpen(false)}
        taskId={task.id}
        comments={comments}
        onCreateComment={(content) => createComment({ content })}
        onUpdateComment={(id, content) => updateComment({ id, content })}
        onDeleteComment={deleteComment}
        isLoading={isCreating || isUpdating || isDeleting}
      />

      {/* Task Details Modal */}
      <TaskDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        task={task}
        lists={lists}
        onTaskUpdate={(updatedTask) => {
        }}
        onTaskDelete={onDelete}
      />
    </div>
  );
}
