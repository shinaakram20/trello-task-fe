'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DeleteConfirmation from '@/components/ui/delete-confirmation';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useCommentCount, useComments } from '@/hooks/useComments';
import { useTasks, useTaskOperations } from '@/hooks/useTasks';
import { Comment, List, Task } from '@/types';
import {
  AlertTriangle,
  Calendar,
  Clock,
  Folder,
  GripVertical,
  List as ListIcon,
  MessageSquare,
  Tag,
  Trash2,
  User,
  X
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface TaskDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task;
  lists: List[];
  onTaskUpdate?: (task: Task) => void;
  onTaskDelete?: (taskId: string) => void;
}

export default function TaskDetailsModal({
  isOpen,
  onClose,
  task,
  lists,
  onTaskUpdate,
  onTaskDelete
}: TaskDetailsModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editData, setEditData] = useState({
    title: task.title,
    description: task.description || '',
    priority: task.priority,
    dueDate: task.due_date ? task.due_date.split('T')[0] : '',
    status: task.status
  });

  const { updateTask, isUpdating } = useTasks();
  const { deleteTask, isDeleting } = useTaskOperations();
  const { comments, createComment, updateComment, deleteComment, isCreating, isUpdating: isUpdatingComment, isDeleting: isDeletingComment } = useComments(task.id);
  const { data: commentCount = 0 } = useCommentCount(task.id);

  // Reset edit data when task changes
  useEffect(() => {
    setEditData({
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      dueDate: task.due_date ? task.due_date.split('T')[0] : '',
      status: task.status
    });
  }, [task]);

  const handleSave = async () => {
    try {
      await updateTask({
        id: task.id,
        data: {
          title: editData.title,
          description: editData.description,
          priority: editData.priority,
          dueDate: editData.dueDate || undefined,
          status: editData.status
        }
      });
      setIsEditing(false);
      if (onTaskUpdate) {
        onTaskUpdate({ ...task, ...editData });
      }
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditData({
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      dueDate: task.due_date ? task.due_date.split('T')[0] : '',
      status: task.status
    });
    setIsEditing(false);
  };

  const handleDelete = async () => {
    try {
      // Use the deleteTask function from the hook
      await deleteTask(task.id);
      
      // Also call the parent callback if provided
      if (onTaskDelete) {
        await onTaskDelete(task.id);
      }
      
      setIsDeleteOpen(false);
      onClose();
    } catch (error) {
      console.error('Failed to delete task:', error);
      // Keep the delete confirmation dialog open if deletion fails
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes('done') || statusLower.includes('complete') || statusLower.includes('finished')) {
      return 'bg-green-100 text-green-800 border-green-200';
    } else if (statusLower.includes('progress') || statusLower.includes('doing') || statusLower.includes('working')) {
      return 'bg-blue-100 text-blue-800 border-blue-200';
    } else {
      return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date() && new Date(dueDate).toDateString() !== new Date().toDateString();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatRelativeDate = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return formatDate(dateString);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <DialogTitle className="text-xl font-semibold text-gray-900">
                  {isEditing ? (
                    <Input
                      value={editData.title}
                      onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                      className="text-xl font-semibold border-0 p-0 focus:ring-2 focus:ring-blue-500"
                      placeholder="Task title"
                    />
                  ) : (
                    task.title
                  )}
                </DialogTitle>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className={getPriorityColor(task.priority)}>
                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                  </Badge>
                  <Badge variant="outline" className={getStatusColor(task.status)}>
                    {task.status}
                  </Badge>
                  {task.position && (
                    <Badge variant="outline" className="bg-gray-100 text-gray-600 border-gray-200">
                      Position #{task.position}
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!isEditing && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="h-8 px-3 text-blue-600 border-blue-300 hover:bg-blue-50"
                  >
                    Edit
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsDeleteOpen(true)}
                  disabled={isDeleting}
                  className="h-8 px-3 text-red-600 border-red-300 hover:bg-red-50"
                >
                  {isDeleting ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-6 py-4">
            {/* Task Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  Task Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Description */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Description</label>
                  {isEditing ? (
                    <Textarea
                      value={editData.description}
                      onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                      placeholder="Add a description..."
                      rows={3}
                      className="resize-none"
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-lg border">
                      {task.description ? (
                        <p className="text-gray-700 whitespace-pre-wrap">{task.description}</p>
                      ) : (
                        <p className="text-gray-500 italic">No description provided</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Priority */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Priority</label>
                    {isEditing ? (
                      <Select
                        value={editData.priority}
                        onValueChange={(value: 'low' | 'medium' | 'high') =>
                          setEditData({ ...editData, priority: value })
                        }
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
                    ) : (
                      <Badge className={getPriorityColor(task.priority)}>
                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                      </Badge>
                    )}
                  </div>

                  {/* Status */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Status</label>
                    {isEditing ? (
                      <Select
                        value={editData.status}
                        onValueChange={(value: string) => setEditData({ ...editData, status: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {lists.map((list) => (
                            <SelectItem key={list.id} value={list.title}>
                              {list.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge className={getStatusColor(task.status)}>
                        {task.status}
                      </Badge>
                    )}
                  </div>

                  {/* Due Date */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Due Date</label>
                    {isEditing ? (
                      <Input
                        type="date"
                        value={editData.dueDate}
                        onChange={(e) => setEditData({ ...editData, dueDate: e.target.value })}
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        {task.due_date ? (
                          <>
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <span className={isOverdue(task.due_date) ? 'text-red-600 font-medium' : 'text-gray-700'}>
                              {formatDate(task.due_date)}
                              {isOverdue(task.due_date) && (
                                <AlertTriangle className="h-4 w-4 inline ml-2 text-red-500" />
                              )}
                            </span>
                          </>
                        ) : (
                          <span className="text-gray-500 italic">No due date set</span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Position */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Position</label>
                    <div className="flex items-center gap-2">
                      <GripVertical className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-700">#{task.position}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Location Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Folder className="h-5 w-5" />
                  Location
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <ListIcon className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-700">
                    <span className="font-medium">List:</span> {task.list_title || 'Unknown List'}
                  </span>
                </div>
                {task.board_title && (
                  <div className="flex items-center gap-2">
                    <Folder className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-700">
                      <span className="font-medium">Board:</span> {task.board_title}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Timestamps */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Created</span>
                  <span className="text-gray-700 font-medium">{formatRelativeDate(task.created_at)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Last Updated</span>
                  <span className="text-gray-700 font-medium">{formatRelativeDate(task.updated_at)}</span>
                </div>
                {task.due_date && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Due Date</span>
                    <span className={`font-medium ${isOverdue(task.due_date) ? 'text-red-600' : 'text-gray-700'}`}>
                      {formatRelativeDate(task.due_date)}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Comments Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Comments ({commentCount})
                  </CardTitle>
                  <Button
                    onClick={() => {
                      const textarea = document.querySelector('textarea[placeholder="Add a comment..."]') as HTMLTextAreaElement;
                      if (textarea?.value.trim()) {
                        createComment({ content: textarea.value.trim() });
                        textarea.value = '';
                      }
                    }}
                    disabled={isCreating}
                    className="self-end"
                  >
                    {isCreating ? 'Adding...' : 'Add'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Add Comment */}
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Add a comment..."
                    className="flex-1 resize-none"
                    rows={2}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                        e.preventDefault();
                        const target = e.target as HTMLTextAreaElement;
                        if (target.value.trim()) {
                          createComment({ content: target.value.trim() });
                          target.value = '';
                        }
                      }
                    }}
                  />

                </div>

                {/* Comments List */}
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {comments.length === 0 ? (
                    <p className="text-gray-500 text-center py-4 italic">No comments yet</p>
                  ) : (
                    comments.map((comment: Comment) => (
                      <div key={comment.id} className="p-3 bg-gray-50 rounded-lg border">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-gray-500" />
                            <span className="text-sm font-medium text-gray-700">
                              {comment.owner_email || 'Anonymous'}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">
                            {formatRelativeDate(comment.created_at)}
                          </span>
                        </div>
                        <p className="text-gray-700 text-sm">{comment.content}</p>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Footer Actions */}
          {isEditing && (
            <div className="flex-shrink-0 flex justify-end space-x-2 pt-4 border-t">
              <Button variant="outline" onClick={handleCancelEdit}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isUpdating || !editData.title.trim()}>
                {isUpdating ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <DeleteConfirmation
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        itemName={task.title}
        itemType="task"
        variant="danger"
        isLoading={isDeleting}
      />
    </>
  );
}
