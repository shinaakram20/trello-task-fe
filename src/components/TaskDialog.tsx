'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { CreateTaskData, List, Task, UpdateTaskData } from '@/types';
import { Calendar, Clock } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

interface TaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task | null;
  listId: string;
  listTitle?: string;
  lists?: List[];
  onSubmit: (data: CreateTaskData | UpdateTaskData) => void;
  isLoading?: boolean;
}

export default function TaskDialog({
  isOpen,
  onClose,
  task,
  listId,
  listTitle,
  lists = [],
  onSubmit,
  isLoading = false
}: TaskDialogProps) {
  const getInitialStatus = useCallback((): string => {
    if (listTitle) {
      return listTitle;
    }
    // Default to first available list title or empty string
    return lists.length > 0 ? lists[0].title : '';
  }, [listTitle, lists]);

  const [formData, setFormData] = useState<CreateTaskData>({
    title: '',
    description: '',
    listId: listId,
    priority: 'medium',
    dueDate: new Date().toISOString().split('T')[0] // Default to today
  });

  const [status, setStatus] = useState<string>(getInitialStatus());

  const isEditing = !!task;

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || '',
        listId: task.list_id,
        priority: task.priority,
        dueDate: task.due_date ? task.due_date.split('T')[0] : undefined
      });
      setStatus(task.status);
    } else {
      setFormData({
        title: '',
        description: '',
        listId: listId,
        priority: 'medium',
        dueDate: new Date().toISOString().split('T')[0] // Default to today
      });
      setStatus(getInitialStatus());
    }
  }, [task, listId, listTitle, getInitialStatus]);

  useEffect(() => {
    if (!task && listTitle) {
      const newStatus = getInitialStatus();
      setStatus(newStatus);
    }
  }, [listTitle, task, getInitialStatus]);

  useEffect(() => {
  }, [listTitle, status]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title.trim()) {
      const submitData = {
        ...formData,
        status: status
      };
      onSubmit(submitData);
      if (!isEditing) {
        onClose();
      }
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open && !isLoading) {
      onClose();
    }
  };

  const priorityColors = {
    low: 'text-green-600 bg-green-100',
    medium: 'text-yellow-600 bg-yellow-100',
    high: 'text-red-600 bg-red-100'
  };

  const statusColors = {
    todo: 'text-gray-600 bg-gray-100',
    in_progress: 'text-blue-600 bg-blue-100',
    done: 'text-green-600 bg-green-100'
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange} key={`task-dialog-${task?.id || 'new'}`}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Task' : 'Create New Task'}
          </DialogTitle>
          {!isEditing && listTitle && (
            <p className="text-sm text-gray-600 mt-1">
              Adding task to: <span className="font-medium text-gray-800">{listTitle}</span>
            </p>
          )}
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Title *
            </label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter task title"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter task description (optional)"
              rows={3}
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="priority" className="text-sm font-medium">
                Priority
              </label>
              <Select
                value={formData.priority}
                onValueChange={(value: 'low' | 'medium' | 'high') =>
                  setFormData({ ...formData, priority: value })
                }
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                      <span>Low</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="medium">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <span>Medium</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="high">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <span>High</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="status" className="text-sm font-medium">
                Status
              </label>
              <Select
                value={status}
                onValueChange={(value: string) =>
                  setStatus(value)
                }
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {lists.map((list) => (
                    <SelectItem key={list.id} value={list.title}>
                      <div className="flex items-center space-x-2 capitalize">
                        <div className={`w-3 h-3 rounded-full ${list.title.toLowerCase().includes('done') || list.title.toLowerCase().includes('complete') || list.title.toLowerCase().includes('finished')
                          ? 'bg-green-500'
                          : list.title.toLowerCase().includes('progress') || list.title.toLowerCase().includes('doing') || list.title.toLowerCase().includes('working')
                            ? 'bg-blue-500'
                            : 'bg-gray-500'
                          }`} />
                        <span>{list.title}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="dueDate" className="text-sm font-medium">
              Due Date
            </label>
            <Input
              id="dueDate"
              type="date"
              value={formData.dueDate || ''}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value || undefined })}
              disabled={isLoading}
            />
          </div>

          {formData.dueDate && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span>Due: {new Date(formData.dueDate).toLocaleDateString()}</span>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${formData.priority ? priorityColors[formData.priority as 'low' | 'medium' | 'high'] : ''}`}>
              {formData.priority ? formData.priority.charAt(0).toUpperCase() + formData.priority.slice(1) : ''} Priority
            </div>
            <div className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              {status || 'No Status'}
            </div>
            {formData.dueDate && (
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <Calendar className="h-3 w-3" />
                <span>Has due date</span>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !formData.title.trim()}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{isEditing ? 'Updating...' : 'Creating...'}</span>
                </div>
              ) : (
                <span>{isEditing ? 'Update Task' : 'Create Task'}</span>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
