'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DeleteConfirmation from '@/components/ui/delete-confirmation';
import { List } from '@/types';
import { Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface ListTestProps {
  list: List;
  onEdit: (id: string, data: Partial<List>) => void;
  onDelete: (id: string) => void;
}

export default function ListTest({ list, onEdit, onDelete }: ListTestProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(list.title);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    onEdit(list.id, { title: editTitle });
    setIsEditing(false);
  };

  const handleDelete = () => {
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    onDelete(list.id);
  };

  return (
    <Card className="w-80">
      <CardHeader>
        <div className="flex items-center justify-between">
          {isEditing ? (
            <input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="flex-1 text-lg font-semibold border rounded px-2 py-1"
              autoFocus
            />
          ) : (
            <CardTitle className="text-lg">{list.title}</CardTitle>
          )}
          <div className="flex items-center space-x-2">
            {isEditing ? (
              <>
                <Button size="sm" onClick={handleSave}>
                  Save
                </Button>
                <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleEdit}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleDelete}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">List ID: {list.id}</p>
        <p className="text-gray-600">Created: {new Date(list.created_at).toLocaleDateString()}</p>
      </CardContent>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmation
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete List"
        message="Are you sure you want to delete this list?"
        itemName={list.title}
        itemType="list"
        variant="danger"
      />
    </Card>
  );
}
