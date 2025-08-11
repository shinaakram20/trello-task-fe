'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpDown, GripVertical, Info } from 'lucide-react';
import { useState } from 'react';

export default function DragDropDemoPage() {
  const [tasks, setTasks] = useState([
    { id: '1', title: 'Design user interface', description: 'Create wireframes and mockups', priority: 'high', status: 'todo', position: 1 },
    { id: '2', title: 'Set up database', description: 'Configure database schema and connections', priority: 'medium', status: 'in_progress', position: 2 },
    { id: '3', title: 'Implement authentication', description: 'Add user login and registration', priority: 'high', status: 'todo', position: 3 },
    { id: '4', title: 'Write API endpoints', description: 'Create RESTful API for the application', priority: 'medium', status: 'todo', position: 4 },
    { id: '5', title: 'Add error handling', description: 'Implement comprehensive error handling', priority: 'low', status: 'todo', position: 5 },
  ]);

  const [draggedTask, setDraggedTask] = useState<string | null>(null);
  const [dragOverTask, setDragOverTask] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTask(taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, taskId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverTask(taskId);
  };

  const handleDragLeave = () => {
    setDragOverTask(null);
  };

  const handleDrop = (e: React.DragEvent, targetTaskId: string) => {
    e.preventDefault();

    if (!draggedTask || draggedTask === targetTaskId) {
      setDraggedTask(null);
      setDragOverTask(null);
      return;
    }

    const draggedIndex = tasks.findIndex(t => t.id === draggedTask);
    const targetIndex = tasks.findIndex(t => t.id === targetTaskId);

    if (draggedIndex === -1 || targetIndex === -1) {
      setDraggedTask(null);
      setDragOverTask(null);
      return;
    }

    // Reorder tasks
    const newTasks = [...tasks];
    const [draggedTaskItem] = newTasks.splice(draggedIndex, 1);
    newTasks.splice(targetIndex, 0, draggedTaskItem);

    // Update positions
    const updatedTasks = newTasks.map((task, index) => ({
      ...task,
      position: index + 1
    }));

    setTasks(updatedTasks);
    setDraggedTask(null);
    setDragOverTask(null);
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
    setDragOverTask(null);
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
    switch (status) {
      case 'done': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'todo': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Drag & Drop Task Reordering Demo</h1>
          <p className="text-lg text-gray-600">
            Experience the smooth drag and drop functionality for reordering tasks within lists
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
                <h4 className="font-medium text-gray-900 mb-2">Task Reordering:</h4>
                <ul className="space-y-1">
                  <li>• Drag any task card to reorder it</li>
                  <li>• Drop it above or below another task</li>
                  <li>• Watch positions update automatically</li>
                  <li>• Smooth animations during dragging</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Visual Feedback:</h4>
                <ul className="space-y-1">
                  <li>• Drag handle appears on hover</li>
                  <li>• Position numbers show current order</li>
                  <li>• Drop zones highlight when dragging</li>
                  <li>• Cards show drag state clearly</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Task List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowUpDown className="h-5 w-5" />
              Task List - Drag to Reorder
            </CardTitle>
            <p className="text-sm text-gray-600">
              {tasks.length} tasks • Drag any task to change its position
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tasks.map((task, index) => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task.id)}
                  onDragOver={(e) => handleDragOver(e, task.id)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, task.id)}
                  onDragEnd={handleDragEnd}
                  className={`
                    relative p-4 bg-white rounded-lg border-2 transition-all duration-200 cursor-grab active:cursor-grabbing
                    ${draggedTask === task.id ? 'border-blue-500 shadow-lg scale-105' : 'border-gray-200 hover:border-blue-300'}
                    ${dragOverTask === task.id && draggedTask !== task.id ? 'border-green-400 bg-green-50' : ''}
                    ${draggedTask && draggedTask !== task.id ? 'opacity-75' : ''}
                  `}
                >
                  {/* Drop zone indicator */}
                  {dragOverTask === task.id && draggedTask !== task.id && (
                    <div className="absolute -top-1 left-0 right-0 h-1 bg-green-400 rounded-full animate-pulse" />
                  )}

                  <div className="flex items-start gap-3">
                    {/* Drag handle */}
                    <div className="flex-shrink-0 mt-1">
                      <GripVertical className="h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors" />
                    </div>

                    {/* Position badge */}
                    <div className="flex-shrink-0">
                      <Badge variant="outline" className="text-xs bg-gray-100 text-gray-600">
                        #{task.position}
                      </Badge>
                    </div>

                    {/* Task content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 mb-1">{task.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{task.description}</p>

                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={`text-xs ${getPriorityColor(task.priority)}`}>
                          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                        </Badge>
                        <Badge variant="outline" className={`text-xs whitespace-nowrap ${getStatusColor(task.status)}`}>
                          {task.status.replace('_', ' ').charAt(0).toUpperCase() + task.status.replace('_', ' ').slice(1)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Features Showcase */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-green-600">Smooth Reordering</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Drag tasks up and down to reorder them within the list. Positions update automatically.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-blue-600">Visual Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Clear visual indicators show drag states, drop zones, and position changes.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-purple-600">Position Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Each task shows its current position and updates in real-time during reordering.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
