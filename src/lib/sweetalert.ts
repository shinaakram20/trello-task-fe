import Swal from 'sweetalert2';

// Simple toast notification functions using console and a simple DOM-based toast
export const showSuccessToast = (title: string, message: string) => {
  console.log(`✅ ${title}: ${message}`);
  showSimpleToast(`${title}: ${message}`, 'success');
};

export const showErrorToast = (title: string, message: string) => {
  console.error(`❌ ${title}: ${message}`);
  showSimpleToast(`${title}: ${message}`, 'error');
};

// Simple DOM-based toast implementation
function showSimpleToast(message: string, type: 'success' | 'error') {
  // Remove existing toasts
  const existingToasts = document.querySelectorAll('.simple-toast');
  existingToasts.forEach(toast => toast.remove());

  // Create toast element
  const toast = document.createElement('div');
  toast.className = `simple-toast fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg text-white max-w-sm ${
    type === 'success' ? 'bg-green-600' : 'bg-red-600'
  }`;
  toast.textContent = message;

  // Add to DOM
  document.body.appendChild(toast);

  // Auto-remove after 3 seconds
  setTimeout(() => {
    if (toast.parentNode) {
      toast.parentNode.removeChild(toast);
    }
  }, 3000);

  // Click to dismiss
  toast.addEventListener('click', () => {
    if (toast.parentNode) {
      toast.parentNode.removeChild(toast);
    }
  });
}

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
