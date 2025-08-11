'use client';

import { Badge } from '@/components/ui/badge';
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
import { AlertTriangle, Calendar, Edit, MoreHorizontal, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import TaskDialog from './TaskDialog';

interface ListProps {
  list: List;
  lists: List[]; // Add lists prop to get all available lists
  onEditList: (id: string, data: Partial<List>) => void;
  onDeleteList: (id: string) => void;
}

export default function ListComponent({
  list,
  lists,
  onEditList,
  onDeleteList
}: ListProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [isDeleteListOpen, setIsDeleteListOpen] = useState(false);
  const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editData, setEditData] = useState({
    title: list.title
  });

  const { tasks, createTask, updateTask, deleteTask, isCreating, isUpdating, isDeleting } = useTasks(list.id);

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
    setIsDeleteListOpen(true);
  };

  const handleConfirmDeleteList = () => {
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

  const handleConfirmDeleteTask = () => {
    if (deleteTaskId) {
      deleteTask(deleteTaskId);
      setDeleteTaskId(null);
    }
  };

  const handleTaskSubmit = (data: CreateTaskData | UpdateTaskData) => {
    if (editingTask) {
      // Update existing task
      updateTask({ id: editingTask.id, data: data as UpdateTaskData });
      setIsTaskDialogOpen(false);
      setEditingTask(null);
    } else {
      // Create new task with status based on list title
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
    <>
      <Card className="h-fit min-h-[240px] bg-white shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-base capitalize font-semibold text-gray-900 truncate">
                {list.title}
              </CardTitle>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                >
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleEdit}>
                  <Edit className="h-3 w-3 mr-2" />
                  Edit List
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleDelete}
                  className="text-red-600"
                >
                  <Trash2 className="h-3 w-3 mr-2" />
                  Delete List
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {/* Tasks */}
          <div className="space-y-2 mb-4">
            {tasks.length === 0 ? (
              <div className="text-center py-4 text-gray-400">
                <p className="text-sm">No tasks yet</p>
              </div>
            ) : (
              tasks.map((task: Task) => (
                <div
                  key={task.id}
                  className="group p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer"
                  onClick={() => handleEditTask(task)}
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
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge variant="outline" className={`text-xs ${getPriorityColor(task.priority)}`}>
                          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                        </Badge>
                        <Badge variant="outline" className={`text-xs ${getStatusColor(task.status)}`}>
                          {task.status.replace('_', ' ').charAt(0).toUpperCase() + task.status.replace('_', ' ').slice(1)}
                        </Badge>
                        {task.due_date && (
                          <div className={`flex items-center space-x-1 text-xs ${isOverdue(task.due_date) ? 'text-red-600' : 'text-gray-500'}`}>
                            <Calendar className="h-3 w-3" />
                            <span>
                              {isOverdue(task.due_date) && <AlertTriangle className="h-3 w-3 inline mr-1" />}
                              {new Date(task.due_date).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteTask(task.id);
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Add Task Button */}
          <Button
            variant="outline"
            size="sm"
            className="w-full text-gray-600 hover:text-gray-900"
            onClick={handleAddTask}
            disabled={isCreating}
          >
            <Plus className="h-4 w-4 mr-2" />
            {isCreating ? 'Adding...' : 'Add Task'}
          </Button>
        </CardContent>
      </Card>

      {/* Edit List Dialog */}
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

      {/* Task Dialog */}
      {isTaskDialogOpen && (
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
      )}

      {/* Delete List Confirmation Dialog */}
      <DeleteConfirmation
        isOpen={isDeleteListOpen}
        onClose={() => setIsDeleteListOpen(false)}
        onConfirm={handleConfirmDeleteList}
        title="Delete List"
        message="Are you sure you want to delete this list?"
        itemName={list.title}
        itemType="list"
        variant="danger"
      />

      {/* Delete Task Confirmation Dialog */}
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
