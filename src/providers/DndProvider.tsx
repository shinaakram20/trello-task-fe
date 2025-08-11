'use client';

import { ReactNode, createContext, useContext, useState } from 'react';
import { DragEndEvent, DragStartEvent } from '@dnd-kit/core';

interface DndContextType {
  activeId: string | null;
  isDragging: boolean;
  handleDragStart: (event: DragStartEvent) => void;
  handleDragEnd: (event: DragEndEvent) => void;
}

const DndContext = createContext<DndContextType | undefined>(undefined);

export const useDnd = () => {
  const context = useContext(DndContext);
  if (!context) {
    throw new Error('useDnd must be used within a DndProvider');
  }
  return context;
};

interface DndProviderProps {
  children: ReactNode;
}

export function DndProvider({ children }: DndProviderProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
  };

  const value: DndContextType = {
    activeId,
    isDragging: !!activeId,
    handleDragStart,
    handleDragEnd,
  };

  return (
    <DndContext.Provider value={value}>
      {children}
    </DndContext.Provider>
  );
}
