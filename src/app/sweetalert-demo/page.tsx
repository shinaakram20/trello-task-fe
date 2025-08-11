'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  showSuccessToast, 
  showErrorToast, 
  showWarningToast, 
  showInfoToast,
  showConfirmDialog,
  showDeleteConfirmDialog
} from '@/lib/sweetalert';

export default function SweetAlertDemo() {
  const handleSuccessToast = () => {
    showSuccessToast("Success!", "This is a success message");
  };

  const handleErrorToast = () => {
    showErrorToast("Error!", "This is an error message");
  };

  const handleWarningToast = () => {
    showWarningToast("Warning!", "This is a warning message");
  };

  const handleInfoToast = () => {
    showInfoToast("Info!", "This is an info message");
  };

  const handleConfirmDialog = async () => {
    const result = await showConfirmDialog(
      "Are you sure?",
      "This action cannot be undone.",
      "Yes, proceed",
      "Cancel"
    );
    
    if (result.isConfirmed) {
      showSuccessToast("Confirmed!", "You clicked the confirm button");
    }
  };

  const handleDeleteConfirm = async () => {
    const result = await showDeleteConfirmDialog("task");
    
    if (result.isConfirmed) {
      showSuccessToast("Deleted!", "The task has been deleted");
    }
  };

  return (
    <div className="container mx-auto p-8 space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">SweetAlert2 Demo</h1>
        <p className="text-lg text-muted-foreground">
          Test all the different types of toasts and dialogs
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Success Toast</CardTitle>
            <CardDescription>Shows a green success notification</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleSuccessToast} className="w-full">
              Show Success Toast
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Error Toast</CardTitle>
            <CardDescription>Shows a red error notification</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleErrorToast} variant="destructive" className="w-full">
              Show Error Toast
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Warning Toast</CardTitle>
            <CardDescription>Shows a yellow warning notification</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleWarningToast} variant="outline" className="w-full">
              Show Warning Toast
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Info Toast</CardTitle>
            <CardDescription>Shows a blue info notification</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleInfoToast} variant="secondary" className="w-full">
              Show Info Toast
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Confirm Dialog</CardTitle>
            <CardDescription>Shows a confirmation dialog</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleConfirmDialog} variant="outline" className="w-full">
              Show Confirm Dialog
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Delete Confirmation</CardTitle>
            <CardDescription>Shows a delete confirmation dialog</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleDeleteConfirm} variant="destructive" className="w-full">
              Show Delete Dialog
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="text-center mt-8">
        <p className="text-sm text-muted-foreground">
          These toasts will appear in the top-right corner and automatically disappear after a few seconds.
        </p>
      </div>
    </div>
  );
}
