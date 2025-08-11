'use client';

import ActivityLog from '@/components/ActivityLog';
import DemoBoardSetup from '@/components/DemoBoardSetup';
import DndBoard from '@/components/DndBoard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DeleteConfirmation from '@/components/ui/delete-confirmation';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { LoadingPage } from '@/components/ui/loading';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useBoard } from '@/hooks/useBoards';
import { useLists } from '@/hooks/useLists';
import { useTasks } from '@/hooks/useTasks';
import { DndProvider } from '@/providers/DndProvider';
import { useAppStore } from '@/stores/useAppStore';
import { List, Task } from '@/types';
import { ArrowLeft, Edit, Plus } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function BoardDetailPage() {
  const params = useParams();
  const boardId = params.id as string;
  const { data: board, isLoading, error } = useBoard(boardId);
  const { lists, createList, updateList, deleteList, isCreating, isUpdating, isDeleting, isUpdatingPositions } = useLists(boardId);
  const { setCurrentBoard } = useAppStore();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isCreateListOpen, setIsCreateListOpen] = useState(false);
  const [showDemoSetup, setShowDemoSetup] = useState(false);
  const [deleteListId, setDeleteListId] = useState<string | null>(null);
  const [editData, setEditData] = useState({
    title: '',
    description: '',
    color: '#0079bf'
  });
  const [newListData, setNewListData] = useState({
    title: ''
  });

  const { tasks, isMoving, isUpdatingPosition } = useTasks(undefined, boardId);

  useEffect(() => {
    if (board) {
      setCurrentBoard(board);
      setEditData({
        title: board.title,
        description: board.description || '',
        color: board.color || '#0079bf'
      });
    }
  }, [board, setCurrentBoard]);

  useEffect(() => {
    // Show demo setup if no lists exist
    if (lists.length === 0 && !isLoading) {
      setShowDemoSetup(true);
    } else {
      setShowDemoSetup(false);
    }
  }, [lists.length, isLoading]);

  const handleEdit = () => {
    setIsEditOpen(true);
  };

  const handleUpdate = async () => {
    setIsEditOpen(false);
  };

  const handleCreateList = () => {
    if (newListData.title.trim()) {
      createList({
        title: newListData.title,
        boardId: boardId
      });
      setNewListData({ title: '' });
      setIsCreateListOpen(false);
    }
  };

  const handleEditList = (id: string, data: Partial<List>) => {
    updateList({ id, data });
  };

  const handleDeleteList = (id: string) => {
    setDeleteListId(id);
  };

  const handleConfirmDeleteList = () => {
    if (deleteListId) {
      deleteList(deleteListId);
      setDeleteListId(null);
    }
  };

  const handleDemoSetupComplete = () => {
    setShowDemoSetup(false);
  };

  const colorOptions = [
    { value: '#0079bf', label: 'Blue' },
    { value: '#70b500', label: 'Green' },
    { value: '#ff9f1a', label: 'Orange' },
    { value: '#eb5a46', label: 'Red' },
    { value: '#f2d600', label: 'Yellow' },
    { value: '#c377e0', label: 'Purple' },
    { value: '#ff78cb', label: 'Pink' },
    { value: '#6c547b', label: 'Dark Purple' },
    { value: '#4d4d4d', label: 'Gray' },
  ];

  if (isLoading) {
    return <LoadingPage text="Loading board..." />;
  }

  if (error || !board) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Board Not Found</h1>
            <p className="text-gray-600 mb-6">The board you're looking for doesn't exist or has been deleted.</p>
            <Link href="/">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Calculate statistics from real data
  const completedTasks = tasks.filter((task: Task) => task.status === 'done').length;
  const totalTasks = tasks.length;

  return (
    <DndProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-6">
              <div className="flex items-center space-x-4">
                <Link href="/">
                  <Button variant="ghost" size="sm">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                </Link>
                <div className="flex items-center space-x-3">
                  <div
                    className="w-8 h-8 rounded-lg"
                    style={{ backgroundColor: board.color }}
                  />
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 capitalize flex items-center gap-2">
                      {board.title}
                      {(isUpdating || isDeleting || isUpdatingPositions || isMoving || isUpdatingPosition) && (
                        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      )}
                    </h1>
                    {board.description && (
                      <p className="text-sm text-gray-600">{board.description}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Board Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Board Info */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Board Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Created</label>
                  <p className="text-sm text-gray-900">
                    {new Date(board.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Last Updated</label>
                  <p className="text-sm text-gray-900 flex items-center gap-2">
                    {new Date(board.updated_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                    {(isUpdating || isDeleting || isUpdatingPositions || isMoving || isUpdatingPosition) && (
                      <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    )}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Owner</label>
                  <p className="text-sm text-gray-900">{board.owner_email || 'Unknown'}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Total Tasks</label>
                  <p className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    {tasks.length}
                    {(isMoving || isUpdatingPosition) && (
                      <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    )}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Total Lists</label>
                  <p className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    {lists.length}
                    {(isUpdating || isDeleting || isUpdatingPositions) && (
                      <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    )}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Completed Tasks</label>
                  <p className="text-2xl font-bold text-green-600 flex items-center gap-2">
                    {completedTasks}
                    {(isMoving || isUpdatingPosition) && (
                      <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
                    )}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => setIsCreateListOpen(true)}
                  disabled={isCreating || isUpdating || isDeleting || isUpdatingPositions || isMoving || isUpdatingPosition}
                >
                  {(isCreating || isUpdating || isDeleting || isUpdatingPositions || isMoving || isUpdatingPosition) ? (
                    <>
                      <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Add New List
                    </>
                  )}
                </Button>
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={handleEdit}
                  disabled={isUpdating || isDeleting || isUpdatingPositions || isMoving || isUpdatingPosition}
                >
                  {(isUpdating || isDeleting || isUpdatingPositions || isMoving || isUpdatingPosition) ? (
                    <>
                      <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Board
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Demo Setup or Drag and Drop Board */}
          {showDemoSetup ? (
            <div className="mb-8">
              <DemoBoardSetup
                boardId={boardId}
                onComplete={handleDemoSetupComplete}
              />
            </div>
          ) : (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  Lists ({lists.length})
                  {(isUpdating || isDeleting || isUpdatingPositions || isMoving || isUpdatingPosition) && (
                    <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  )}
                </h2>
                <Button
                  onClick={() => setIsCreateListOpen(true)}
                  disabled={isCreating || isUpdating || isDeleting || isUpdatingPositions || isMoving || isUpdatingPosition}
                >
                  {(isCreating || isUpdating || isDeleting || isUpdatingPositions || isMoving || isUpdatingPosition) ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Add List
                    </>
                  )}
                </Button>
              </div>

              <DndBoard boardId={boardId} />
            </div>
          )}

          {/* Recent Activity */}
          <div className="mb-8">
            <ActivityLog boardId={boardId} limit={20} />
          </div>
        </div>
      </div>

      {/* Edit Board Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Board</DialogTitle>
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
                placeholder="Enter board title"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id="description"
                value={editData.description}
                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                placeholder="Enter board description (optional)"
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="color" className="text-sm font-medium">
                Color
              </label>
              <Select
                value={editData.color}
                onValueChange={(value) => setEditData({ ...editData, color: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {colorOptions.map((color) => (
                    <SelectItem key={color.value} value={color.value}>
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: color.value }}
                        />
                        <span>{color.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              Update Board
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create List Dialog */}
      <Dialog open={isCreateListOpen} onOpenChange={setIsCreateListOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New List</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="list-title" className="text-sm font-medium">
                Title
              </label>
              <Input
                id="list-title"
                value={newListData.title}
                onChange={(e) => setNewListData({ ...newListData, title: e.target.value })}
                placeholder="Enter list title"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsCreateListOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateList}
              disabled={!newListData.title.trim() || isCreating}
            >
              {isCreating ? 'Creating...' : 'Create List'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete List Confirmation Dialog */}
      <DeleteConfirmation
        isOpen={!!deleteListId}
        onClose={() => setDeleteListId(null)}
        onConfirm={handleConfirmDeleteList}
        title="Delete List"
        message="Are you sure you want to delete this list?"
        itemName={lists.find((l: List) => l.id === deleteListId)?.title}
        itemType="list"
        variant="danger"
      />
    </DndProvider>
  );
}
