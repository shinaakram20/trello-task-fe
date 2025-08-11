'use client';

import { List, Task } from '@/types';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import DroppableList from './DroppableList';

interface SortableListProps {
  list: List;
  tasks: Task[];
  lists: List[];
  onEditList: (id: string, data: Partial<List>) => void;
  onDeleteList: (id: string) => void;
  onTaskMove: (taskId: string, newListId: string, newPosition?: number) => void;
  isDragOver?: boolean;
  isUpdatingPositions?: boolean;
}

export default function SortableList({
  list,
  tasks,
  lists,
  onEditList,
  onDeleteList,
  onTaskMove,
  isDragOver = false,
  isUpdatingPositions = false
}: SortableListProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: list.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: 'grab' as const,
    userSelect: 'none' as const,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      {...listeners}
      className={`cursor-grab active:cursor-grabbing transition-all duration-200 relative ${
        isDragOver ? 'ring-2 ring-blue-400 ring-opacity-50 scale-105' : ''
      }`}
    >
      {isUpdatingPositions && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-lg z-10 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-blue-600 font-medium">Updating...</span>
          </div>
        </div>
      )}
      {isDragging && (
        <div className="absolute inset-0 bg-blue-50/80 backdrop-blur-sm rounded-lg z-5 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-blue-600 font-medium">Dragging...</span>
          </div>
        </div>
      )}
      <DroppableList
        list={list}
        tasks={tasks}
        lists={lists}
        onEditList={onEditList}
        onDeleteList={onDeleteList}
        onTaskMove={onTaskMove}
        isDragging={isDragging}
        isUpdatingPositions={isUpdatingPositions}
      />
    </div>
  );
}
