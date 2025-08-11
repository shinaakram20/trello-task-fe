import Swal from 'sweetalert2';

// Success toast configuration
export const showSuccessToast = (title: string, message?: string) => {
  Swal.fire({
    icon: 'success',
    title,
    text: message,
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    background: '#10b981',
    color: '#ffffff',
    customClass: {
      popup: 'swal2-toast',
    },
  });
};

// Error toast configuration
export const showErrorToast = (title: string, message?: string) => {
  Swal.fire({
    icon: 'error',
    title,
    text: message,
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 4000,
    timerProgressBar: true,
    background: '#ef4444',
    color: '#ffffff',
    customClass: {
      popup: 'swal2-toast',
    },
  });
};

// Warning toast configuration
export const showWarningToast = (title: string, message?: string) => {
  Swal.fire({
    icon: 'warning',
    title,
    text: message,
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3500,
    timerProgressBar: true,
    background: '#f59e0b',
    color: '#ffffff',
    customClass: {
      popup: 'swal2-toast',
    },
  });
};

// Info toast configuration
export const showInfoToast = (title: string, message?: string) => {
  Swal.fire({
    icon: 'info',
    title,
    text: message,
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    background: '#3b82f6',
    color: '#ffffff',
    customClass: {
      popup: 'swal2-toast',
    },
  });
};

// Confirmation dialog
export const showConfirmDialog = (
  title: string,
  text: string,
  confirmButtonText: string = 'Yes',
  cancelButtonText: string = 'Cancel'
) => {
  return Swal.fire({
    title,
    text,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#10b981',
    cancelButtonColor: '#6b7280',
    confirmButtonText,
    cancelButtonText,
  });
};

// Delete confirmation dialog
export const showDeleteConfirmDialog = (itemName: string = 'item') => {
  return Swal.fire({
    title: 'Are you sure?',
    text: `You won't be able to revert this! This will permanently delete the ${itemName}.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel',
  });
};
