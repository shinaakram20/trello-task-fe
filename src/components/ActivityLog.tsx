'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useBoardActivity } from '@/hooks/useActivity';
import { formatDistanceToNow } from 'date-fns';
import { Activity, CheckSquare, Clock, FileText, List, Move, User } from 'lucide-react';

interface ActivityLogProps {
  boardId: string;
  limit?: number;
}

interface ActivityItem {
  id: string;
  action_type: string;
  entity_type: string;
  entity_title: string;
  created_at: string;
  user_name?: string;
  user_email?: string;
  metadata?: any;
}

export default function ActivityLog({ boardId, limit = 20 }: ActivityLogProps) {
  const { data: activities = [], isLoading, error } = useBoardActivity(boardId, limit);

  const getActionIcon = (actionType: string, entityType: string) => {
    switch (actionType) {
      case 'create':
        return entityType === 'task' ? <CheckSquare className="h-4 w-4" /> : <List className="h-4 w-4" />;
      case 'update':
        return <FileText className="h-4 w-4" />;
      case 'delete':
        return <FileText className="h-4 w-4" />;
      case 'move':
        return <Move className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getActionColor = (actionType: string) => {
    switch (actionType) {
      case 'create':
        return 'bg-green-100 text-green-800';
      case 'update':
        return 'bg-blue-100 text-blue-800';
      case 'delete':
        return 'bg-red-100 text-red-800';
      case 'move':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getActionText = (actionType: string, entityType: string, entityTitle: string) => {
    const entityDisplay = entityType === 'task' ? 'task' : entityType;
    const titleDisplay = entityTitle || entityDisplay;

    switch (actionType) {
      case 'create':
        return `Created ${entityDisplay} "${titleDisplay}"`;
      case 'update':
        return `Updated ${entityDisplay} "${titleDisplay}"`;
      case 'delete':
        return `Deleted ${entityDisplay} "${titleDisplay}"`;
      case 'move':
        return `Moved task "${titleDisplay}"`;
      default:
        return `${actionType} ${entityDisplay} "${titleDisplay}"`;
    }
  };

  const getMoveDescription = (metadata: any) => {
    if (metadata?.oldListId && metadata?.newListId) {
      return `from list to another list`;
    }
    return '';
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-500">Loading activity...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-red-500">
            <p>Failed to load activity</p>
            <p className="text-sm text-gray-500">Please try again later</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (activities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No recent activity</p>
            <p className="text-sm">Activity will appear here as you use the board</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-gray-100">
          {activities.map((activity: ActivityItem) => (
            <div key={activity.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  <div className="p-2 rounded-full bg-gray-100">
                    {getActionIcon(activity.action_type, activity.entity_type)}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge
                      variant="outline"
                      className={`text-xs ${getActionColor(activity.action_type)}`}
                    >
                      {activity.action_type.charAt(0).toUpperCase() + activity.action_type.slice(1)}
                    </Badge>
                    <span className="text-sm text-gray-600">
                      {getActionText(activity.action_type, activity.entity_type, activity.entity_title)}
                    </span>
                  </div>

                  {activity.action_type === 'move' && activity.metadata && (
                    <p className="text-sm text-gray-500 mb-2">
                      {getMoveDescription(activity.metadata)}
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span>{activity.user_name || activity.user_email || 'Unknown user'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
