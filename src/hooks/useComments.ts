import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { commentsApi } from '@/services/api';

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

  const createCommentMutation = useMutation({
    mutationFn: (data: { content: string; userId?: string }) =>
      commentsApi.create({ taskId, ...data }),
    onSuccess: () => {
      // Invalidate and refetch comments for the task
      queryClient.invalidateQueries({ queryKey: ['comments', taskId] });
      // Also invalidate comment count
      queryClient.invalidateQueries({ queryKey: ['commentCount', taskId] });
    },
  });

  const updateCommentMutation = useMutation({
    mutationFn: ({ id, content }: { id: string; content: string }) =>
      commentsApi.update(id, { content }),
    onSuccess: () => {
      // Invalidate and refetch comments for the task
      queryClient.invalidateQueries({ queryKey: ['comments', taskId] });
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: (id: string) => commentsApi.delete(id),
    onSuccess: () => {
      // Invalidate and refetch comments for the task
      queryClient.invalidateQueries({ queryKey: ['comments', taskId] });
      // Also invalidate comment count
      queryClient.invalidateQueries({ queryKey: ['commentCount', taskId] });
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
