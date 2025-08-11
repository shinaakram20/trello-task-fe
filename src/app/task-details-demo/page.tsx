'use client';

import TaskDetailsModal from '@/components/TaskDetailsModal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { List, Task } from '@/types';
import { Eye, Info, Plus } from 'lucide-react';
import { useState } from 'react';

export default function TaskDetailsDemoPage() {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sample data for demonstration
  const sampleLists: List[] = [
    { id: '1', board_id: '1', title: 'To Do', position: 1, created_at: '2024-01-01', updated_at: '2024-01-01' },
    { id: '2', board_id: '1', title: 'In Progress', position: 2, created_at: '2024-01-01', updated_at: '2024-01-01' },
    { id: '3', board_id: '1', title: 'Done', position: 3, created_at: '2024-01-01', updated_at: '2024-01-01' },
    { id: '4', board_id: '1', title: 'Review', position: 4, created_at: '2024-01-01', updated_at: '2024-01-01' },
  ];

  const sampleTasks: Task[] = [
    {
      id: '1',
      list_id: '1',
      title: 'Design User Interface',
      description: 'Create wireframes and mockups for the new user interface. Focus on user experience and accessibility. Include mobile responsive design considerations.',
      position: 1,
      due_date: '2024-02-15T10:00:00Z',
      priority: 'high',
      status: 'To Do',
      created_at: '2024-01-15T09:00:00Z',
      updated_at: '2024-01-20T14:30:00Z',
      list_title: 'To Do',
      board_title: 'Product Development'
    },
    {
      id: '2',
      list_id: '2',
      title: 'Implement Authentication System',
      description: 'Build secure user authentication with JWT tokens, password hashing, and role-based access control.',
      position: 1,
      due_date: '2024-02-20T17:00:00Z',
      priority: 'high',
      status: 'In Progress',
      created_at: '2024-01-10T11:00:00Z',
      updated_at: '2024-01-22T16:45:00Z',
      list_title: 'In Progress',
      board_title: 'Product Development'
    },
    {
      id: '3',
      list_id: '3',
      title: 'Write API Documentation',
      description: 'Create comprehensive API documentation using OpenAPI/Swagger. Include examples, error codes, and authentication details.',
      position: 1,
      due_date: '2024-01-30T18:00:00Z',
      priority: 'medium',
      status: 'Done',
      created_at: '2024-01-05T08:00:00Z',
      updated_at: '2024-01-25T12:00:00Z',
      list_title: 'Done',
      board_title: 'Product Development'
    },
    {
      id: '4',
      list_id: '1',
      title: 'Set Up CI/CD Pipeline',
      description: 'Configure automated testing, building, and deployment pipeline using GitHub Actions or similar tools.',
      position: 2,
      due_date: '2024-02-10T16:00:00Z',
      priority: 'medium',
      status: 'To Do',
      created_at: '2024-01-18T10:00:00Z',
      updated_at: '2024-01-18T10:00:00Z',
      list_title: 'To Do',
      board_title: 'Product Development'
    },
    {
      id: '5',
      list_id: '4',
      title: 'Code Review and Testing',
      description: 'Perform thorough code review and implement comprehensive testing including unit tests, integration tests, and end-to-end tests.',
      position: 1,
      due_date: '2024-02-25T15:00:00Z',
      priority: 'low',
      status: 'Review',
      created_at: '2024-01-22T13:00:00Z',
      updated_at: '2024-01-22T13:00:00Z',
      list_title: 'Review',
      board_title: 'Product Development'
    }
  ];

  const openTaskDetails = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes('done')) {
      return 'bg-green-100 text-green-800';
    } else if (statusLower.includes('progress')) {
      return 'bg-blue-100 text-blue-800';
    } else if (statusLower.includes('review')) {
      return 'bg-purple-100 text-purple-800';
    } else {
      return 'bg-gray-100 text-gray-800';
    }
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date() && new Date(dueDate).toDateString() !== new Date().toDateString();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Task Details Modal Demo</h1>
          <p className="text-lg text-gray-600">
            Explore the comprehensive task details view with editing, comments, and more
          </p>
        </div>

        {/* Instructions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-600">
              <Info className="h-5 w-5" />
              How to Use
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Features to Explore:</h4>
                <ul className="space-y-1">
                  <li>• Click the eye icon to view task details</li>
                  <li>• Edit task information inline</li>
                  <li>• Add and manage comments</li>
                  <li>• View task timeline and metadata</li>
                  <li>• Change priority and status</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">What You'll See:</h4>
                <ul className="space-y-1">
                  <li>• Complete task information</li>
                  <li>• Real-time editing capabilities</li>
                  <li>• Comment system integration</li>
                  <li>• Beautiful, organized layout</li>
                  <li>• Responsive design</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sample Tasks */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleTasks.map((task) => (
            <Card key={task.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg mb-2 line-clamp-2">{task.title}</CardTitle>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className={`text-xs ${getPriorityColor(task.priority)}`}>
                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                      </Badge>
                      <Badge variant="outline" className={`text-xs ${getStatusColor(task.status)}`}>
                        {task.status}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openTaskDetails(task)}
                    className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    title="View Details"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                {task.description && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                    {task.description}
                  </p>
                )}
                
                <div className="space-y-2">
                  {task.due_date && (
                    <div className={`flex items-center gap-2 text-xs ${isOverdue(task.due_date) ? 'text-red-600' : 'text-gray-500'}`}>
                      <span className="font-medium">Due:</span>
                      <span>{new Date(task.due_date).toLocaleDateString()}</span>
                      {isOverdue(task.due_date) && (
                        <span className="text-red-500 font-medium">(Overdue)</span>
                      )}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Position #{task.position}</span>
                    <span>List: {task.list_title}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Showcase */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-green-600">📝 Rich Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                View complete task details including description, priority, status, due dates, and position information.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-blue-600">✏️ Inline Editing</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Edit task information directly in the modal. Update title, description, priority, status, and due dates.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-purple-600">💬 Comments System</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Add comments, view comment history, and collaborate with team members on specific tasks.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Task Details Modal */}
      {selectedTask && (
        <TaskDetailsModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedTask(null);
          }}
          task={selectedTask}
          lists={sampleLists}
          onTaskUpdate={(updatedTask) => {
          }}
          onTaskDelete={(taskId) => {
            setIsModalOpen(false);
            setSelectedTask(null);
          }}
        />
      )}
    </div>
  );
}
