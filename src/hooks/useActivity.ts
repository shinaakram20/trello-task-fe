import { useQuery } from '@tanstack/react-query';
import { activityApi } from '@/services/api';

export const useBoardActivity = (boardId: string, limit: number = 50) => {
  return useQuery({
    queryKey: ['activity', 'board', boardId, limit],
    queryFn: async () => {
      const response = await activityApi.getBoardActivity(boardId, limit);
      return response.data;
    },
    enabled: !!boardId,
  });
};

export const useUserActivity = (userId: string, limit: number = 50) => {
  return useQuery({
    queryKey: ['activity', 'user', userId, limit],
    queryFn: async () => {
      const response = await activityApi.getUserActivity(userId, limit);
      return response.data;
    },
    enabled: !!userId,
  });
};
