import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { commentsApi } from '@/services/api';
import { showSuccessToast, showErrorToast } from '@/lib/sweetalert';
import React from 'react';

export const useComments = (taskId: string) => {
  const queryClient = useQueryClient();

  const {
    data: comments = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['comments', taskId],
    queryFn: async () => {
      const response = await commentsApi.getByTask(taskId);
      return response.data;
    },
    enabled: !!taskId,
  });

  // Show error toast when query fails
  React.useEffect(() => {
    if (error) {
      showErrorToast("Error", "Failed to load comments. Please try again.");
    }
  }, [error]);

  const createCommentMutation = useMutation({
    mutationFn: (data: { content: string; userId?: string }) =>
      commentsApi.create({ taskId, ...data }),
    onSuccess: () => {
      // Invalidate and refetch comments for the task
      queryClient.invalidateQueries({ queryKey: ['comments', taskId] });
      // Also invalidate comment count
      queryClient.invalidateQueries({ queryKey: ['commentCount', taskId] });
      
      showSuccessToast("Success", "Comment added successfully!");
    },
    onError: (error) => {
      showErrorToast("Error", "Failed to add comment. Please try again.");
    },
  });

  const updateCommentMutation = useMutation({
    mutationFn: ({ id, content }: { id: string; content: string }) =>
      commentsApi.update(id, { content }),
    onSuccess: () => {
      // Invalidate and refetch comments for the task
      queryClient.invalidateQueries({ queryKey: ['comments', taskId] });
      
      showSuccessToast("Success", "Comment updated successfully!");
    },
    onError: (error) => {
      showErrorToast("Error", "Failed to update comment. Please try again.");
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: (id: string) => commentsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', taskId] });
      queryClient.invalidateQueries({ queryKey: ['commentCount', taskId] });
      
      showSuccessToast("Success", "Comment deleted successfully!");
    },
    onError: (error) => {
      showErrorToast("Error", "Failed to delete comment. Please try again.");
    },
  });

  return {
    comments,
    isLoading,
    error,
    createComment: createCommentMutation.mutate,
    updateComment: updateCommentMutation.mutate,
    deleteComment: deleteCommentMutation.mutate,
    isCreating: createCommentMutation.isPending,
    isUpdating: updateCommentMutation.isPending,
    isDeleting: deleteCommentMutation.isPending,
  };
};

export const useCommentCount = (taskId: string) => {
  return useQuery({
    queryKey: ['commentCount', taskId],
    queryFn: async () => {
      const response = await commentsApi.getCount(taskId);
      return response.data.count;
    },
    enabled: !!taskId,
  });
};
