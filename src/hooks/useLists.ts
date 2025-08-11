import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { listsApi } from '@/services/api';
import { List, CreateListData, UpdateListData } from '@/types';
import { showSuccessToast, showErrorToast } from '@/lib/sweetalert';
import React from 'react';

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

  // Show error toast when query fails
  React.useEffect(() => {
    if (error) {
      showErrorToast("Error", "Failed to load lists. Please try again.");
    }
  }, [error]);

  const createListMutation = useMutation({
    mutationFn: (data: CreateListData) => listsApi.create(data),
    onSuccess: () => {
      // Invalidate and refetch lists for the specific board
      if (boardId) {
        queryClient.invalidateQueries({ queryKey: ['lists', boardId] });
      }
      // Also invalidate all lists
      queryClient.invalidateQueries({ queryKey: ['lists'] });

      showSuccessToast("Success", "List created successfully!");
    },
    onError: (error) => {
      showErrorToast("Error", "Failed to create list. Please try again.");
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

      showSuccessToast("Success", "List updated successfully!");
    },
    onError: (error) => {
      showErrorToast("Error", "Failed to update list. Please try again.");
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

      showSuccessToast("Success", "List positions updated successfully!");
    },
    onError: (error) => {
      showErrorToast("Error", "Failed to update list positions. Please try again.");
    },
  });

  const deleteListMutation = useMutation({
    mutationFn: (id: string) => listsApi.delete(id),
    onSuccess: (_, id) => {
      console.log('List deleted successfully, updating cache for:', id);

      // Only update cache if we have valid data
      if (!id) {
        console.warn('No list ID provided for cache update');
        return;
      }

      // Remove the list from all relevant caches immediately
      queryClient.setQueryData(['lists', boardId], (old: List[] | undefined) => {
        if (!old) return old;
        const filtered = old.filter(list => list.id !== id);
        console.log('Updated lists cache:', { before: old.length, after: filtered.length });
        return filtered;
      });

      // Also update the general lists cache
      queryClient.setQueryData(['lists'], (old: List[] | undefined) => {
        if (!old) return old;
        const filtered = old.filter(list => list.id !== id);
        console.log('Updated general lists cache:', { before: old.length, after: filtered.length });
        return filtered;
      });

      // Invalidate all related queries to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['lists'] });
      if (boardId) {
        queryClient.invalidateQueries({ queryKey: ['lists', boardId] });
      }

      showSuccessToast("Success", "List deleted successfully!");
    },
    onError: (error) => {
      showErrorToast("Error", "Failed to delete list. Please try again.");
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
