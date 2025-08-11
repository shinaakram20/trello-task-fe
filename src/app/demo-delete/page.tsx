'use client';

import ApiHealthCheck from '@/components/ApiHealthCheck';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DeleteConfirmation from '@/components/ui/delete-confirmation';
import { useState } from 'react';

export default function DeleteDemoPage() {
  const [deleteBoardOpen, setDeleteBoardOpen] = useState(false);
  const [deleteListOpen, setDeleteListOpen] = useState(false);
  const [deleteTaskOpen, setDeleteTaskOpen] = useState(false);
  const [deleteWarningOpen, setDeleteWarningOpen] = useState(false);
  const [deleteInfoOpen, setDeleteInfoOpen] = useState(false);

  const handleDeleteBoard = async () => {
    await new Promise(resolve => setTimeout(resolve, 2000));
  };

  const handleDeleteList = async () => {
    await new Promise(resolve => setTimeout(resolve, 1500));
  };

  const handleDeleteTask = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const handleWarning = async () => {
    await new Promise(resolve => setTimeout(resolve, 1200));
  };

  const handleInfo = async () => {
    await new Promise(resolve => setTimeout(resolve, 800));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Delete Confirmation Demo</h1>
          <p className="text-lg text-gray-600">
            Test all the delete confirmation dialogs with different variants and scenarios
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Board Delete */}
          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">Delete Board</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                Test deleting a board with all its lists and tasks.
              </p>
              <Button
                variant="destructive"
                onClick={() => setDeleteBoardOpen(true)}
                className="w-full"
              >
                Delete Board
              </Button>
            </CardContent>
          </Card>

          {/* List Delete */}
          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">Delete List</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                Test deleting a list with all its tasks.
              </p>
              <Button
                variant="destructive"
                onClick={() => setDeleteListOpen(true)}
                className="w-full"
              >
                Delete List
              </Button>
            </CardContent>
          </Card>

          {/* Task Delete */}
          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">Delete Task</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                Test deleting a single task.
              </p>
              <Button
                variant="destructive"
                onClick={() => setDeleteTaskOpen(true)}
                className="w-full"
              >
                Delete Task
              </Button>
            </CardContent>
          </Card>

          {/* Warning Variant */}
          <Card>
            <CardHeader>
              <CardTitle className="text-yellow-600">Warning Action</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                Test a warning confirmation dialog.
              </p>
              <Button
                variant="outline"
                onClick={() => setDeleteWarningOpen(true)}
                className="w-full border-yellow-300 text-yellow-700 hover:bg-yellow-50"
              >
                Archive Item
              </Button>
            </CardContent>
          </Card>

          {/* Info Variant */}
          <Card>
            <CardHeader>
              <CardTitle className="text-blue-600">Info Action</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                Test an info confirmation dialog.
              </p>
              <Button
                variant="outline"
                onClick={() => setDeleteInfoOpen(true)}
                className="w-full border-blue-300 text-blue-700 hover:bg-blue-50"
              >
                Confirm Action
              </Button>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card className="md:col-span-2 lg:col-span-3">
            <CardHeader>
              <CardTitle className="text-gray-700">How to Test</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Features to Test:</h4>
                  <ul className="space-y-1">
                    <li>• Click any delete button to open the dialog</li>
                    <li>• Try closing with the X button</li>
                    <li>• Test the Cancel button</li>
                    <li>• Confirm deletion to see loading state</li>
                    <li>• Check different variants (danger, warning, info)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">What You'll See:</h4>
                  <ul className="space-y-1">
                    <li>• Beautiful, modern UI design</li>
                    <li>• Smooth animations and transitions</li>
                    <li>• Loading states with spinners</li>
                    <li>• Responsive design for all screens</li>
                    <li>• Professional color-coded variants</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* API Health Check */}
        <div className="mt-12">
          <ApiHealthCheck />
        </div>
      </div>

      {/* Delete Board Dialog */}
      <DeleteConfirmation
        isOpen={deleteBoardOpen}
        onClose={() => setDeleteBoardOpen(false)}
        onConfirm={handleDeleteBoard}
        title="Delete Board"
        message="Are you sure you want to delete this board?"
        itemName="My Project Board"
        itemType="board"
        variant="danger"
      />

      {/* Delete List Dialog */}
      <DeleteConfirmation
        isOpen={deleteListOpen}
        onClose={() => setDeleteListOpen(false)}
        onConfirm={handleDeleteList}
        title="Delete List"
        message="Are you sure you want to delete this list?"
        itemName="In Progress Tasks"
        itemType="list"
        variant="danger"
      />

      {/* Delete Task Dialog */}
      <DeleteConfirmation
        isOpen={deleteTaskOpen}
        onClose={() => setDeleteTaskOpen(false)}
        onConfirm={handleDeleteTask}
        title="Delete Task"
        message="Are you sure you want to delete this task?"
        itemName="Complete user authentication"
        itemType="task"
        variant="danger"
      />

      {/* Warning Dialog */}
      <DeleteConfirmation
        isOpen={deleteWarningOpen}
        onClose={() => setDeleteWarningOpen(false)}
        onConfirm={handleWarning}
        title="Archive Item"
        message="Are you sure you want to archive this item?"
        itemName="Project Documentation"
        itemType="document"
        variant="warning"
      />

      {/* Info Dialog */}
      <DeleteConfirmation
        isOpen={deleteInfoOpen}
        onClose={() => setDeleteInfoOpen(false)}
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
