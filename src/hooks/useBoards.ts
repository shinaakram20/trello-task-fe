import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { boardsApi } from '@/services/api';
import { Board, CreateBoardData, UpdateBoardData } from '@/types';
import { useAppStore } from '@/stores/useAppStore';
import { showSuccessToast, showErrorToast } from '@/lib/sweetalert';
import React from 'react';

export const useBoards = () => {
  const queryClient = useQueryClient();
  const { setBoards, addBoard, updateBoard, deleteBoard } = useAppStore();

  const {
    data: boards = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['boards'],
    queryFn: async () => {
      const response = await boardsApi.getAll();
      const boardsData = response.data;
      setBoards(boardsData);
      return boardsData;
    },
  });

  // Show error toast when query fails
  React.useEffect(() => {
    if (error) {
      showErrorToast("Error", "Failed to load boards. Please try again.");
    }
  }, [error]);

  const createBoardMutation = useMutation({
    mutationFn: (data: CreateBoardData) => boardsApi.create(data),
    onSuccess: (response) => {
      const newBoard = response.data;
      addBoard(newBoard);
      queryClient.invalidateQueries({ queryKey: ['boards'] });
      
      showSuccessToast("Success", "Board created successfully!");
    },
    onError: (error) => {
      showErrorToast("Error", "Failed to create board. Please try again.");
    },
  });

  const updateBoardMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBoardData }) =>
      boardsApi.update(id, data),
    onSuccess: (response, { id }) => {
      const updatedBoard = response.data;
      updateBoard(id, updatedBoard);
      queryClient.invalidateQueries({ queryKey: ['boards'] });
      
      showSuccessToast("Success", "Board updated successfully!");
    },
    onError: (error) => {
      showErrorToast("Error", "Failed to update board. Please try again.");
    },
  });

  const deleteBoardMutation = useMutation({
    mutationFn: (id: string) => boardsApi.delete(id),
    onSuccess: (_, id) => {
      console.log('Board deleted successfully, updating cache for:', id);
      
      // Only update cache if we have valid data
      if (!id) {
        console.warn('No board ID provided for cache update');
        return;
      }
      
      // Remove the board from local store
      deleteBoard(id);
      
      // Remove from query cache immediately
      queryClient.setQueryData(['boards'], (old: Board[] | undefined) => {
        if (!old) return old;
        const filtered = old.filter(board => board.id !== id);
        console.log('Updated boards cache:', { before: old.length, after: filtered.length });
        return filtered;
      });
      
      // Invalidate all related queries to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['boards'] });
      
      // Also invalidate lists and tasks since deleting a board affects everything
      queryClient.invalidateQueries({ queryKey: ['lists'] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      
      // Invalidate board-specific queries
      queryClient.invalidateQueries({ queryKey: ['boards', id] });
      queryClient.invalidateQueries({ queryKey: ['lists', id] });
      queryClient.invalidateQueries({ queryKey: ['tasks', id] });
      
      showSuccessToast("Success", "Board deleted successfully!");
    },
    onError: (error) => {
      showErrorToast("Error", "Failed to delete board. Please try again.");
    },
  });

  return {
    boards,
    isLoading,
    error,
    createBoard: createBoardMutation.mutate,
    createBoardAsync: createBoardMutation.mutateAsync,
    updateBoard: updateBoardMutation.mutate,
    updateBoardAsync: updateBoardMutation.mutateAsync,
    deleteBoard: deleteBoardMutation.mutate,
    deleteBoardAsync: deleteBoardMutation.mutateAsync,
    isCreating: createBoardMutation.isPending,
    isUpdating: updateBoardMutation.isPending,
    isDeleting: deleteBoardMutation.isPending,
  };
};

export const useBoard = (id: string) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['boards', id],
    queryFn: async () => {
      const response = await boardsApi.getById(id);
      return response.data;
    },
    enabled: !!id,
  });
};
