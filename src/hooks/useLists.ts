import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { listsApi } from '@/services/api';
import { List, CreateListData, UpdateListData } from '@/types';

export const useLists = (boardId?: string) => {
  const queryClient = useQueryClient();

  const {
    data: lists = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['lists', boardId],
    queryFn: async () => {
      if (boardId) {
        const response = await listsApi.getByBoard(boardId);
        return response.data;
      } else {
        const response = await listsApi.getAll();
        return response.data;
      }
    },
    enabled: !!boardId || boardId === undefined,
  });

  const createListMutation = useMutation({
    mutationFn: (data: CreateListData) => listsApi.create(data),
    onSuccess: () => {
      // Invalidate and refetch lists for the specific board
      if (boardId) {
        queryClient.invalidateQueries({ queryKey: ['lists', boardId] });
      }
      // Also invalidate all lists
      queryClient.invalidateQueries({ queryKey: ['lists'] });
    },
  });

  const updateListMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateListData }) =>
      listsApi.update(id, data),
    onSuccess: (response, { id }) => {
      // Update the list in the cache
      queryClient.setQueryData(['lists', boardId], (old: List[] | undefined) => {
        if (!old) return old;
        return old.map(list => 
          list.id === id ? { ...list, ...response.data } : list
        );
      });
      // Also invalidate to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['lists', boardId] });
    },
  });

  const updateListPositionsMutation = useMutation({
    mutationFn: (updates: Array<{ id: string; position: number }>) =>
      listsApi.updatePositions(updates),
    onSuccess: (response) => {
      // Update all lists in the cache with new positions
      queryClient.setQueryData(['lists', boardId], (old: List[] | undefined) => {
        if (!old) return old;
        return response.data;
      });
      // Also invalidate to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['lists', boardId] });
    },
  });

  const deleteListMutation = useMutation({
    mutationFn: (id: string) => listsApi.delete(id),
    onSuccess: (_, id) => {
      queryClient.setQueryData(['lists', boardId], (old: List[] | undefined) => {
        if (!old) return old;
        return old.filter(list => list.id !== id);
      });
      // Also invalidate to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['lists', boardId] });
    },
    onError: (error, id) => {
      console.error('Failed to delete list:', id, error);
      throw error; // Re-throw to be handled by the component
    },
  });

  return {
    lists,
    isLoading,
    error,
    createList: createListMutation.mutate,
    createListAsync: createListMutation.mutateAsync,
    updateList: updateListMutation.mutate,
    updateListAsync: updateListMutation.mutateAsync,
    updateListPositions: updateListPositionsMutation.mutate,
    updateListPositionsAsync: updateListPositionsMutation.mutateAsync,
    deleteList: deleteListMutation.mutate,
    deleteListAsync: deleteListMutation.mutateAsync,
    isCreating: createListMutation.isPending,
    isUpdating: updateListMutation.isPending,
    isUpdatingPositions: updateListPositionsMutation.isPending,
    isDeleting: deleteListMutation.isPending,
  };
};

export const useList = (id: string) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['lists', 'detail', id],
    queryFn: async () => {
      const response = await listsApi.getById(id);
      return response.data;
    },
    enabled: !!id,
  });
};
