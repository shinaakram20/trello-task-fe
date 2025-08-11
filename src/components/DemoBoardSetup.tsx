'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, CheckCircle, Clock, ListTodo } from 'lucide-react';
import { useLists } from '@/hooks/useLists';

interface DemoBoardSetupProps {
  boardId: string;
  onComplete: () => void;
}

const defaultLists = [
  {
    title: 'To Do',
    description: 'Tasks that need to be started',
    color: 'bg-gray-100 border-gray-200'
  },
  {
    title: 'In Progress',
    description: 'Tasks currently being worked on',
    color: 'bg-blue-100 border-blue-200'
  },
  {
    title: 'Done',
    description: 'Completed tasks',
    color: 'bg-green-100 border-green-200'
  }
];

export default function DemoBoardSetup({ boardId, onComplete }: DemoBoardSetupProps) {
  const { createListAsync, isCreating } = useLists(boardId);
  const [isSettingUp, setIsSettingUp] = useState(false);
  const [createdLists, setCreatedLists] = useState<string[]>([]);

  const handleSetupDemo = async () => {
    setIsSettingUp(true);
    setCreatedLists([]);

    try {
      for (const list of defaultLists) {
        const newList = await createListAsync({
          title: list.title,
          boardId: boardId
        });

        if (newList && newList.data && newList.data.id) {
          setCreatedLists(prev => [...prev, newList.data.id]);
        }

        // Small delay to show progress
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      onComplete();
    } catch (error) {
      console.error('Error setting up demo board:', error);
    } finally {
      setIsSettingUp(false);
    }
  };

  const getListIcon = (title: string) => {
    switch (title.toLowerCase()) {
      case 'to do':
        return <ListTodo className="h-5 w-5 text-gray-600" />;
      case 'in progress':
        return <Clock className="h-5 w-5 text-blue-600" />;
      case 'done':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      default:
        return <ListTodo className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Welcome to Your New Board! 🎉</CardTitle>
        <p className="text-gray-600">
          Let's get you started with a basic setup. You can always customize this later.
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Preview of what will be created */}
        <div className="space-y-3">
          <h3 className="font-medium text-gray-900">This will create:</h3>
          <div className="grid gap-3">
            {defaultLists.map((list, index) => (
              <div
                key={list.title}
                className={`flex items-center space-x-3 p-3 rounded-lg border ${list.color}`}
              >
                {getListIcon(list.title)}
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{list.title}</h4>
                  <p className="text-sm text-gray-600">{list.description}</p>
                </div>
                {createdLists.length > index && (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">✨ Benefits of this setup:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Organize tasks by status</li>
            <li>• Drag and drop tasks between lists</li>
            <li>• Visual progress tracking</li>
            <li>• Standard workflow structure</li>
          </ul>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={handleSetupDemo}
            disabled={isSettingUp || isCreating}
            className="flex-1"
          >
            {isSettingUp ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Setting up...</span>
              </div>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Setup Demo Board
              </>
            )}
          </Button>

          <Button
            variant="outline"
            onClick={onComplete}
            disabled={isSettingUp || isCreating}
            className="flex-1"
          >
            Skip Setup
          </Button>
        </div>

        {/* Progress indicator */}
        {isSettingUp && (
          <div className="text-center">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(createdLists.length / defaultLists.length) * 100}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Creating list {createdLists.length + 1} of {defaultLists.length}...
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
