'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface DeleteConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title?: string;
  message?: string;
  itemName?: string;
  itemType?: string;
  isLoading?: boolean;
  variant?: 'danger' | 'warning' | 'info';
}

export default function DeleteConfirmation({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Deletion',
  message = 'Are you sure you want to delete this item?',
  itemName,
  itemType = 'item',
  isLoading = false,
  variant = 'danger'
}: DeleteConfirmationProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      const result = onConfirm();
      if (result instanceof Promise) {
        await result;
      }
      onClose();
    } catch (error) {
      console.error('Error during deletion:', error);
      // Show error to user
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(`Failed to delete ${itemType}: ${errorMessage}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    if (!isDeleting) {
      onClose();
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open && !isDeleting) {
      onClose();
    }
  };

  const variantStyles = {
    danger: {
      icon: <Trash2 className="h-12 w-12 text-red-500" />,
      button: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
      header: 'text-red-600',
      accent: 'text-red-500'
    },
    warning: {
      icon: <AlertTriangle className="h-12 w-12 text-yellow-500" />,
      button: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
      header: 'text-yellow-600',
      accent: 'text-yellow-500'
    },
    info: {
      icon: <AlertTriangle className="h-12 w-12 text-blue-500" />,
      button: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
      header: 'text-blue-600',
      accent: 'text-blue-500'
    }
  };

  const currentVariant = variantStyles[variant];

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden">
        {/* Header with close button */}
        <div className="flex items-center justify-between p-6 pb-4">
          <DialogTitle className={`text-xl font-semibold ${currentVariant.header}`}>
            {title}
          </DialogTitle>
        </div>

        {/* Content */}
        <div className="px-6 pb-6">
          {/* Icon and main message */}
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <div className="p-4 rounded-full bg-gray-50">
                {currentVariant.icon}
              </div>
            </div>
            
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {message}
            </h3>
            
            {itemName && (
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm font-medium">
                <span className="mr-2">🗑️</span>
                {itemName}
              </div>
            )}
            
            <p className="text-sm text-gray-600 mt-3">
              This action cannot be undone. The {itemType} will be permanently removed.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isDeleting}
              className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>
            
            <Button
              onClick={handleConfirm}
              disabled={isDeleting}
              className={`flex-1 text-white ${currentVariant.button} transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]`}
            >
              {isDeleting || isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Deleting...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Trash2 className="h-4 w-4" />
                  <span>Delete {itemType}</span>
                </div>
              )}
            </Button>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}
