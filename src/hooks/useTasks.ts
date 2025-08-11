import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tasksApi } from '@/services/api';
import { Task, CreateTaskData, UpdateTaskData } from '@/types';
import { showSuccessToast, showErrorToast } from '@/lib/sweetalert';
import React from 'react';

export const useTasks = (listId?: string, boardId?: string) => {
  const queryClient = useQueryClient();

  const {
    data: tasks = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['tasks', listId, boardId],
    queryFn: async () => {
      if (listId) {
        const response = await tasksApi.getByList(listId);
        return response.data;
      } else if (boardId) {
        const response = await tasksApi.getByBoard(boardId);
        return response.data;
      } else {
        const response = await tasksApi.getAll();
        return response.data;
      } 
    },
    enabled: !!listId || !!boardId || (listId === undefined && boardId === undefined),
  });

  // Show error toast when query fails
  React.useEffect(() => {
    if (error) {
      showErrorToast("Error", "Failed to load tasks. Please try again.");
    }
  }, [error]);

  const createTaskMutation = useMutation({
    mutationFn: (data: CreateTaskData) => tasksApi.create(data),
    onSuccess: () => {
      // Invalidate and refetch tasks for the specific list
      if (listId) {
        queryClient.invalidateQueries({ queryKey: ['tasks', listId] });
      }
      // Invalidate and refetch tasks for the specific board
      if (boardId) {
        queryClient.invalidateQueries({ queryKey: ['tasks', boardId] });
      }
      // Also invalidate all tasks
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      
      showSuccessToast("Success", "Task created successfully!");
    },
    onError: (error) => {
      showErrorToast("Error", "Failed to create task. Please try again.");
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTaskData }) =>
      tasksApi.update(id, data),
    onSuccess: (response, { id }) => {
      // Update the task in the cache
      queryClient.setQueryData(['tasks', listId, boardId], (old: Task[] | undefined) => {
        if (!old) return old;
        return old.map(task =>
          task.id === id ? { ...task, ...response.data } : task
        );
      });
      // Also invalidate to ensure consistency
      if (listId) {
        queryClient.invalidateQueries({ queryKey: ['tasks', listId] });
      }
      if (boardId) {
        queryClient.invalidateQueries({ queryKey: ['tasks', boardId] });
      }
      
      showSuccessToast("Success", "Task updated successfully!");
    },
    onError: (error) => {
      showErrorToast("Error", "Failed to update task. Please try again.");
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: (id: string) => tasksApi.delete(id),
    onSuccess: (_, id) => {
      console.log('Task deleted successfully, updating cache for:', id);
      
      // Only update cache if we have valid data
      if (!id) {
        console.warn('No task ID provided for cache update');
        return;
      }
      
      // Remove the task from all relevant caches immediately
      queryClient.setQueryData(['tasks', listId, boardId], (old: Task[] | undefined) => {
        if (!old) return old;
        const filtered = old.filter(task => task.id !== id);
        console.log('Updated tasks cache:', { before: old.length, after: filtered.length });
        return filtered;
      });
      
      // Also update the general tasks cache
      queryClient.setQueryData(['tasks'], (old: Task[] | undefined) => {
        if (!old) return old;
        const filtered = old.filter(task => task.id !== id);
        console.log('Updated general tasks cache:', { before: old.length, after: filtered.length });
        return filtered;
      });
      
      // Invalidate all related queries to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      if (listId) {
        queryClient.invalidateQueries({ queryKey: ['tasks', listId] });
      }
      if (boardId) {
        queryClient.invalidateQueries({ queryKey: ['tasks', boardId] });
      }
      
      showSuccessToast("Success", "Task deleted successfully!");
    },
    onError: (error) => {
      showErrorToast("Error", "Failed to delete task. Please try again.");
    },
  });

  const moveTaskMutation = useMutation({
    mutationFn: ({ id, listId, position }: { id: string; listId: string; position?: number }) =>
      tasksApi.move(id, listId, position),
    onSuccess: () => {
      // Invalidate both source and destination lists
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      // Also invalidate board-specific queries
      if (boardId) {
        queryClient.invalidateQueries({ queryKey: ['tasks', boardId] });
      }
      
      showSuccessToast("Success", "Task moved successfully!");
    },
    onError: (error) => {
      showErrorToast("Error", "Failed to move task. Please try again.");
    },
  });

  const updatePositionMutation = useMutation({
    mutationFn: ({ id, position }: { id: string; position: number }) =>
      tasksApi.updatePosition(id, position),
    onSuccess: () => {
      // Invalidate tasks to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      // Also invalidate board-specific queries
      if (boardId) {
        queryClient.invalidateQueries({ queryKey: ['tasks', boardId] });
      }
      
      showSuccessToast("Success", "Task position updated successfully!");
    },
    onError: (error) => {
      showErrorToast("Error", "Failed to update task position. Please try again.");
    },
  });

  const updateTaskPositionsMutation = useMutation({
    mutationFn: (updates: Array<{ id: string; position: number }>) =>
      tasksApi.updatePositions(updates),
    onSuccess: (response) => {
      // Update all tasks in the cache with new positions
      queryClient.setQueryData(['tasks'], (old: Task[] | undefined) => {
        if (!old) return old;
        return response.data;
      });
      // Also invalidate to ensure consistency
      if (listId) {
        queryClient.invalidateQueries({ queryKey: ['tasks', listId] });
      }
      if (boardId) {
        queryClient.invalidateQueries({ queryKey: ['tasks', boardId] });
      }
      
      showSuccessToast("Success", "Task positions updated successfully!");
    },
    onError: (error) => {
      showErrorToast("Error", "Failed to update task positions. Please try again.");
    },
  });

  return {
    tasks,
    isLoading,
    error,
    createTask: createTaskMutation.mutate,
    createTaskAsync: createTaskMutation.mutateAsync,
    updateTask: updateTaskMutation.mutate,
    updateTaskAsync: updateTaskMutation.mutateAsync,
    deleteTask: deleteTaskMutation.mutate,
    deleteTaskAsync: deleteTaskMutation.mutateAsync,
    moveTask: moveTaskMutation.mutate,
    moveTaskAsync: moveTaskMutation.mutateAsync,
    updatePosition: updatePositionMutation.mutate,
    updatePositionAsync: updatePositionMutation.mutateAsync,
    updateTaskPositions: updateTaskPositionsMutation.mutate,
    updateTaskPositionsAsync: updateTaskPositionsMutation.mutateAsync,
    isCreating: createTaskMutation.isPending,
    isUpdating: updateTaskMutation.isPending,
    isDeleting: deleteTaskMutation.isPending,
    isMoving: moveTaskMutation.isPending,
    isUpdatingPosition: updatePositionMutation.isPending,
  };
};

export const useTask = (id: string) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['tasks', 'detail', id],
    queryFn: async () => {
      const response = await tasksApi.getById(id);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useTaskOperations = () => {
  const queryClient = useQueryClient();

  const deleteTaskMutation = useMutation({
    mutationFn: (id: string) => tasksApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTaskData }) =>
      tasksApi.update(id, data),
    onSuccess: () => {
      // Invalidate all task queries to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  return {
    deleteTask: deleteTaskMutation.mutate,
    deleteTaskAsync: deleteTaskMutation.mutateAsync,
    updateTask: updateTaskMutation.mutate,
    updateTaskAsync: updateTaskMutation.mutateAsync,
    isDeleting: deleteTaskMutation.isPending,
    isUpdating: updateTaskMutation.isPending,
  };
};
