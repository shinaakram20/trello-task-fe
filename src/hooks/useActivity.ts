import { useQuery } from '@tanstack/react-query';
import { activityApi } from '@/services/api';
import { showErrorToast } from '@/lib/sweetalert';
import React from 'react';

export const useBoardActivity = (boardId: string, limit: number = 50) => {

  const query = useQuery({
    queryKey: ['activity', 'board', boardId, limit],
    queryFn: async () => {
      const response = await activityApi.getBoardActivity(boardId, limit);
      return response.data;
    },
    enabled: !!boardId,
  });

  // Show error toast when query fails
  React.useEffect(() => {
    if (query.error) {
      showErrorToast("Error", "Failed to load board activity. Please try again.");
    }
  }, [query.error]);

  return query;
};

export const useUserActivity = (userId: string, limit: number = 50) => {

  const query = useQuery({
    queryKey: ['activity', 'user', userId, limit],
    queryFn: async () => {
      const response = await activityApi.getUserActivity(userId, limit);
      return response.data;
    },
    enabled: !!userId,
  });

  // Show error toast when query fails
  React.useEffect(() => {
    if (query.error) {
      showErrorToast("Error", "Failed to load user activity. Please try again.");
    }
  }, [query.error]);

  return query;
};
