'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useBoards } from '@/hooks/useBoards';
import { useAppStore } from '@/stores/useAppStore';
import { Board } from '@/types';
import { Edit, MoreHorizontal, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import DeleteConfirmation from '@/components/ui/delete-confirmation';

interface BoardCardProps {
  board: Board;
}

export default function BoardCard({ board }: BoardCardProps) {
  const { setCurrentBoard } = useAppStore();
  const { deleteBoard, updateBoard, isDeleting, isUpdating } = useBoards();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editData, setEditData] = useState({
    title: board.title,
    description: board.description || '',
    color: board.color || '#0079bf'
  });

  const handleDelete = () => {
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteBoard(board.id);
    } catch (error) {
      console.error('Failed to delete board:', error);
      // Error handling is done by the hooks with toast notifications
    }
  };

  const handleEdit = () => {
    setEditData({
      title: board.title,
      description: board.description || '',
      color: board.color || '#0079bf'
    });
    setIsEditOpen(true);
  };

  const handleUpdate = async () => {
    try {
      await updateBoard({ id: board.id, data: editData });
      setIsEditOpen(false);
    } catch (error) {
      console.error('Failed to update board:', error);
      // Error handling is done by the hooks with toast notifications
    }
  };

  const handleView = () => {
    setCurrentBoard(board);
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

  return (
    <>
      <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer group">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg font-semibold text-gray-900 truncate">
                {board.title}
              </CardTitle>
              {board.description && (
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {board.description}
                </p>
              )}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleView}>
                  View Board
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleEdit}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Board
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleDelete}
                  className="text-red-600"
                  disabled={isDeleting}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {isDeleting ? 'Deleting...' : 'Delete Board'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: board.color }}
              />
              <span className="text-sm text-gray-500">
                {new Date(board.created_at).toLocaleDateString()}
              </span>
            </div>
            
            <Link href={`/boards/${board.id}`}>
              <Button
                size="sm"
                variant="outline"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Plus className="h-4 w-4 mr-1" />
                Open
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

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
              disabled={isUpdating || !editData.title.trim()}
            >
              {isUpdating ? 'Updating...' : 'Update Board'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmation
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Board"
        message="Are you sure you want to delete this board?"
        itemName={board.title}
        itemType="board"
        isLoading={isDeleting}
        variant="danger"
      />
    </>
  );
}
