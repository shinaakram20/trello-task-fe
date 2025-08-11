'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import DeleteConfirmation from './delete-confirmation';

export default function DeleteConfirmationDemo() {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showWarningDialog, setShowWarningDialog] = useState(false);
  const [showInfoDialog, setShowInfoDialog] = useState(false);

  const handleDelete = async () => {
    await new Promise(resolve => setTimeout(resolve, 2000));
  };

  const handleWarning = async () => {
    await new Promise(resolve => setTimeout(resolve, 1500));
  };

  const handleInfo = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 capitalize">Delete Confirmation Demo</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Danger Variant */}
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Danger Variant</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Use this for destructive actions like deleting items.
            </p>
            <Button
              variant="destructive"
              onClick={() => setShowDeleteDialog(true)}
              className="w-full"
            >
              Delete Item
            </Button>
          </CardContent>
        </Card>

        {/* Warning Variant */}
        <Card>
          <CardHeader>
            <CardTitle className="text-yellow-600">Warning Variant</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Use this for actions that need attention but aren't destructive.
            </p>
            <Button
              variant="outline"
              onClick={() => setShowWarningDialog(true)}
              className="w-full border-yellow-300 text-yellow-700 hover:bg-yellow-50"
            >
              Archive Item
            </Button>
          </CardContent>
        </Card>

        {/* Info Variant */}
        <Card>
          <CardHeader>
            <CardTitle className="text-blue-600">Info Variant</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Use this for informational confirmations.
            </p>
            <Button
              variant="outline"
              onClick={() => setShowInfoDialog(true)}
              className="w-full border-blue-300 text-blue-700 hover:bg-blue-50"
            >
              Confirm Action
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Danger Delete Dialog */}
      <DeleteConfirmation
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Delete Item"
        message="Are you sure you want to delete this important item?"
        itemName="Important Document.pdf"
        itemType="document"
        variant="danger"
      />

      {/* Warning Dialog */}
      <DeleteConfirmation
        isOpen={showWarningDialog}
        onClose={() => setShowWarningDialog(false)}
        onConfirm={handleWarning}
        title="Archive Item"
        message="Are you sure you want to archive this item?"
        itemName="Project Notes"
        itemType="note"
        variant="warning"
      />

      {/* Info Dialog */}
      <DeleteConfirmation
        isOpen={showInfoDialog}
        onClose={() => setShowInfoDialog(false)}
        onConfirm={handleInfo}
        title="Confirm Action"
        message="Are you ready to proceed with this action?"
        itemName="Data Export"
        itemType="export"
        variant="info"
      />
    </div>
  );
}
