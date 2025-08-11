'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DeleteConfirmation from '@/components/ui/delete-confirmation';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { useTasks } from '@/hooks/useTasks';
import { CreateTaskData, List, Task, UpdateTaskData } from '@/types';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Edit, MoreHorizontal, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import DraggableTask from './DraggableTask';
import TaskDialog from './TaskDialog';

interface DroppableListProps {
  list: List;
  tasks: Task[];
  lists: List[]; 
  onEditList: (id: string, data: Partial<List>) => void;
  onDeleteList: (id: string) => void;
  onTaskMove: (taskId: string, newListId: string, newPosition?: number) => void;
  isDragging?: boolean;
  isUpdatingPositions?: boolean;
}

export default function DroppableList({
  list,
  tasks,
  lists,
  onEditList,
  onDeleteList,
  onTaskMove,
  isDragging = false,
  isUpdatingPositions = false
}: DroppableListProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editData, setEditData] = useState({
    title: list.title
  });

  const { createTask, updateTask, deleteTask, isCreating, isUpdating, isDeleting, isMoving, isUpdatingPosition } = useTasks(list.id);

  const { setNodeRef, isOver } = useDroppable({
    id: list.id,
    data: {
      type: 'list',
      list,
    },
  });

  const handleEdit = () => {
    setEditData({
      title: list.title
    });
    setIsEditOpen(true);
  };

  const handleUpdate = () => {
    onEditList(list.id, editData);
    setIsEditOpen(false);
  };

  const handleDelete = () => {
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    onDeleteList(list.id);
  };

  const handleAddTask = () => {
    setEditingTask(null);
    setIsTaskDialogOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsTaskDialogOpen(true);
  };

  const handleDeleteTask = (id: string) => {
    setDeleteTaskId(id);
  };

  const handleConfirmDeleteTask = async () => {
    if (deleteTaskId) {
      try {
        await deleteTask(deleteTaskId);
        setDeleteTaskId(null);
      } catch (error) {
        console.error('Failed to delete task:', error);
      }
    }
  };

  const handleTaskSubmit = (data: CreateTaskData | UpdateTaskData) => {
    if (editingTask) {
      updateTask({ id: editingTask.id, data: data as UpdateTaskData });
      setIsTaskDialogOpen(false);
      setEditingTask(null);
    } else {
      const taskData = {
        ...data as CreateTaskData,
        status: getListStatus(list.title)
      };
      createTask(taskData);
    }
  };

  const getListStatus = (listTitle: string): 'todo' | 'in_progress' | 'done' => {
    const title = listTitle.toLowerCase().trim();

    // Check for "done" status first (most specific)
    if (title.includes('done') || title.includes('complete') || title.includes('finished') ||
      title.includes('completed') || title.includes('delivered') || title.includes('shipped')) {
      return 'done';
    }
    // Check for "in progress" status
    else if (title.includes('progress') || title.includes('doing') || title.includes('working') ||
      title.includes('development') || title.includes('execution') || title.includes('active') ||
      title.includes('ongoing') || title.includes('current')) {
      return 'in_progress';
    }
    // Check for "todo" status
    else if (title.includes('todo') || title.includes('to do') || title.includes('backlog') ||
      title.includes('ideas') || title.includes('planning') || title.includes('pending') ||
      title.includes('upcoming') || title.includes('scheduled')) {
      return 'todo';
    }

    // Default to todo if no match
    return 'todo';
  };

  const listStatus = getListStatus(list.title);
  const statusColors = {
    todo: 'border-gray-200 bg-gray-50',
    in_progress: 'border-blue-200 bg-blue-50',
    done: 'border-green-200 bg-green-50'
  };

  return (
    <>
      <Card
        ref={setNodeRef}
        className={`
          group h-full min-h-[340px] max-h-[340px] overflow-y-auto transition-all duration-200
          ${statusColors[listStatus]}
          ${isOver ? 'ring-2 ring-blue-400 ring-opacity-50 shadow-lg' : 'shadow-sm hover:shadow-md'}
        `}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-base capitalize font-semibold text-gray-900 truncate flex items-center gap-2">
                {list.title}
                {isUpdatingPositions && (
                  <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                )}
                {isUpdating && (
                  <div className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin" />
                )}
              </CardTitle>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  {tasks.length} tasks
                  {(isMoving || isUpdatingPosition) && (
                    <div className="w-2 h-2 border border-blue-500 border-t-transparent rounded-full animate-spin" />
                  )}
                </span>
                <div className={`w-2 h-2 rounded-full ${listStatus === 'todo' ? 'bg-gray-400' :
                  listStatus === 'in_progress' ? 'bg-blue-400' :
                    'bg-green-400'
                  }`} />
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleEdit}
                className="h-6 w-6 p-0 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                title="Edit List"
                disabled={isUpdating || isUpdatingPositions}
              >
                {(isUpdating || isUpdatingPositions) ? (
                  <div className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Edit className="h-3 w-3" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                title="Delete List"
                disabled={isDeleting || isUpdatingPositions}
              >
                {(isDeleting || isUpdatingPositions) ? (
                  <div className="w-3 h-3 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Trash2 className="h-3 w-3" />
                )}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                    title="More Options"
                  >
                    <MoreHorizontal className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleEdit} disabled={isUpdating || isUpdatingPositions}>
                    {(isUpdating || isUpdatingPositions) ? (
                      <div className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2" />
                    ) : (
                      <Edit className="h-3 w-3 mr-2" />
                    )}
                    Edit List
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleDelete}
                    className="text-red-600"
                    disabled={isDeleting || isUpdatingPositions}
                  >
                    {(isDeleting || isUpdatingPositions) ? (
                      <div className="w-3 h-3 border-2 border-red-400 border-t-transparent rounded-full animate-spin mr-2" />
                    ) : (
                      <Trash2 className="h-3 w-3 mr-2" />
                    )}
                    Delete List
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">

          {!isDragging ? (
            <SortableContext items={tasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-2 mb-4">
                {tasks.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <div className="w-12 h-12 mx-auto mb-2 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                      {(isMoving || isUpdatingPosition) ? (
                        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Plus className="h-5 w-5" />
                      )}
                    </div>
                    <p className="text-sm">
                      {(isMoving || isUpdatingPosition) ? 'Updating...' : 'Drop tasks here'}
                    </p>
                  </div>
                ) : (
                  <>
                    {tasks.map((task, index) => (
                      <div key={task.id}>
                        <DraggableTask
                          task={task}
                          onEdit={handleEditTask}
                          onDelete={handleConfirmDeleteTask}
                          lists={lists}
                          isMoving={isMoving}
                          isUpdatingPosition={isUpdatingPosition}
                        />
                        {/* Drop zone between tasks */}
                        {index < tasks.length - 1 && (
                          <div className={`h-2 rounded transition-colors duration-200 ${
                            (isMoving || isUpdatingPosition) ? 'bg-blue-200 animate-pulse' : 'bg-transparent hover:bg-blue-100'
                          }`} />
                        )}
                      </div>
                    ))}

                    {/* Bottom drop zone */}
                    <div className={`h-2 rounded transition-colors duration-200 ${
                      (isMoving || isUpdatingPosition) ? 'bg-blue-200 animate-pulse' : 'bg-transparent hover:bg-blue-100'
                    }`} />
                  </>
                )}
              </div>
            </SortableContext>
          ) : (
            <div className="space-y-2 mb-4">
              {tasks.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <div className="w-12 h-12 mx-auto mb-2 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                    {(isMoving || isUpdatingPosition) ? (
                      <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Plus className="h-5 w-5" />
                    )}
                  </div>
                  <p className="text-sm">
                    {(isMoving || isUpdatingPosition) ? 'Updating...' : 'Drop tasks here'}
                  </p>
                </div>
              ) : (
                tasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-3 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {task.title}
                        </h4>
                        {task.description && (
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                            {task.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          <Button
            variant="outline"
            size="sm"
            className="w-full text-gray-600 hover:text-gray-900"
            onClick={handleAddTask}
            disabled={isCreating || isMoving || isUpdatingPosition}
          >
            {(isCreating || isMoving || isUpdatingPosition) ? (
              <>
                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2" />
                {(isCreating ? 'Adding...' : isMoving ? 'Moving...' : 'Updating...')}
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit List</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="title" className="text-sm font-medium">
                Title
              </label>
              <Input
                id="title"
                value={editData.title}
                onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                placeholder="Enter list title"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsEditOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={!editData.title.trim()}
            >
              Update List
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <TaskDialog
        isOpen={isTaskDialogOpen}
        onClose={() => {
          setIsTaskDialogOpen(false);
          setEditingTask(null);
        }}
        task={editingTask}
        listId={list.id}
        listTitle={list.title}
        onSubmit={handleTaskSubmit}
        isLoading={isCreating || isUpdating}
        lists={lists}
      />

      <DeleteConfirmation
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete List"
        message="Are you sure you want to delete this list?"
        itemName={list.title}
        itemType="list"
        isLoading={isDeleting}
        variant="danger"
      />

      <DeleteConfirmation
        isOpen={!!deleteTaskId}
        onClose={() => setDeleteTaskId(null)}
        onConfirm={handleConfirmDeleteTask}
        title="Delete Task"
        message="Are you sure you want to delete this task?"
        itemName={tasks.find((t: Task) => t.id === deleteTaskId)?.title}
        itemType="task"
        variant="danger"
      />
    </>
  );
}
