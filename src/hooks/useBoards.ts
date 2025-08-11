import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { boardsApi } from '@/services/api';
import { Board, CreateBoardData, UpdateBoardData } from '@/types';
import { useAppStore } from '@/stores/useAppStore';

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

  const createBoardMutation = useMutation({
    mutationFn: (data: CreateBoardData) => boardsApi.create(data),
    onSuccess: (response) => {
      const newBoard = response.data;
      addBoard(newBoard);
      queryClient.invalidateQueries({ queryKey: ['boards'] });
    },
  });

  const updateBoardMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBoardData }) =>
      boardsApi.update(id, data),
    onSuccess: (response, { id }) => {
      const updatedBoard = response.data;
      updateBoard(id, updatedBoard);
      queryClient.invalidateQueries({ queryKey: ['boards'] });
    },
  });

  const deleteBoardMutation = useMutation({
    mutationFn: (id: string) => boardsApi.delete(id),
    onSuccess: (_, id) => {
      deleteBoard(id);
      queryClient.invalidateQueries({ queryKey: ['boards'] });
    },
    onError: (error, id) => {
      console.error('Failed to delete board:', id, error);
      throw error; 
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
