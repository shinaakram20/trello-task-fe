'use client';

import DeleteConfirmation from '@/components/ui/delete-confirmation';
import { LoadingPage } from '@/components/ui/loading';
import { useLists } from '@/hooks/useLists';
import { useTasks } from '@/hooks/useTasks';
import { List, Task } from '@/types';
import {
  closestCorners,
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
} from '@dnd-kit/sortable';
import { useState, useMemo } from 'react';
import DraggableTask from './DraggableTask';
import SortableList from './SortableList';

interface DndBoardProps {
  boardId: string;
}

export default function DndBoard({ boardId }: DndBoardProps) {
  const { lists, updateList, updateListPositions, deleteList, isUpdating, isDeleting, isUpdatingPositions } = useLists(boardId);
  const { tasks, moveTask, updatePosition, updateTaskPositions, isMoving, isUpdatingPosition } = useTasks();
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [activeList, setActiveList] = useState<List | null>(null);
  // Organize tasks by list - use useMemo instead of useEffect to prevent infinite loops
  const listTasks = useMemo(() => {
    const organized: Record<string, Task[]> = {};
    lists.forEach((list: List) => {
      organized[list.id] = tasks.filter((task: Task) => task.list_id === list.id);
    });
    return organized;
  }, [lists, tasks]);
  const [deleteListId, setDeleteListId] = useState<string | null>(null);
  const [dragOverListId, setDragOverListId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;

    // Check if dragging a task
    const task = tasks.find((t: Task) => t.id === active.id);
    if (task) {
      setActiveTask(task);
      return;
    }

    // Check if dragging a list
    const list = lists.find((l: List) => l.id === active.id);
    if (list) {
      setActiveList(list);
      return;
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    const activeTask = tasks.find((task: Task) => task.id === activeId);
    const activeList = lists.find((list: List) => list.id === activeId);
    const overList = lists.find((list: List) => list.id === overId);
    const overTask = tasks.find((task: Task) => task.id === overId);

    // Handle task dragging
    if (activeTask) {
      if (overTask) {
      } else if (overList) {
      }
    }

    // Handle list dragging - provide visual feedback
    if (activeList && overList) {
      // Track which list we're hovering over for visual feedback
      setDragOverListId(overId);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveTask(null);
      setActiveList(null);
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) {
      setActiveTask(null);
      setActiveList(null);
      return;
    }

    const activeTask = tasks.find((task: Task) => task.id === activeId);
    const activeList = lists.find((list: List) => list.id === activeId);
    const overList = lists.find((list: List) => list.id === overId);

    // Handle task dragging
    if (activeTask) {
      const activeListId = activeTask.list_id;

      // Check if dropping on another task (for reordering within same list)
      const overTask = tasks.find((task: Task) => task.id === overId);

      if (overTask) {
        // Dropping on another task - reorder within the same list
        if (activeListId === overTask.list_id) {
          // Same list - reorder tasks
          const listTasks = tasks.filter((t: Task) => t.list_id === activeListId);
          const oldIndex = listTasks.findIndex((t: Task) => t.id === activeId);
          const newIndex = listTasks.findIndex((t: Task) => t.id === overId);

          if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
            // Reorder the tasks using arrayMove
            const reorderedTasks = arrayMove(listTasks as Task[], oldIndex, newIndex);

            // Prepare bulk update with new positions
            const updates = reorderedTasks.map((task: Task, index: number) => ({
              id: task.id,
              position: index + 1 // Start from 1 and increment
            }));

            // Use the bulk position update endpoint
            updateTaskPositions(updates);
          }
        } else {
          // Different lists - move task to new list
          moveTask({
            id: activeId,
            listId: overTask.list_id,
            position: 0 // Add to top of the new list
          });
        }
      } else if (overList) {
        // Dropping on a list - move task to that list
        if (activeListId !== overId) {
          moveTask({
            id: activeId,
            listId: overId,
            position: 0 // Add to top of the new list
          });
        }
      }
    }

    // Handle list reordering
    if (activeList && overList) {
      const oldIndex = lists.findIndex((l: List) => l.id === activeId);
      const newIndex = lists.findIndex((l: List) => l.id === overId);

      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {

        // Calculate new positions using arrayMove
        const reorderedLists = arrayMove(lists as List[], oldIndex, newIndex);

        // Prepare bulk update with new positions
        const updates = reorderedLists.map((list: List, index: number) => ({
          id: list.id,
          position: index + 1
        }));

        updateListPositions(updates);
      }
    }

    setActiveTask(null);
    setActiveList(null);
    setDragOverListId(null);
  };



  const handleEditList = (id: string, data: Partial<List>) => {
    updateList({ id, data });
  };

  const handleDeleteList = (id: string) => {
    setDeleteListId(id);
  };

  const handleConfirmDeleteList = () => {
    if (deleteListId) {
      deleteList(deleteListId);
      setDeleteListId(null);
    }
  };

  const handleTaskMove = (taskId: string, newListId: string, newPosition?: number) => {
    moveTask({
      id: taskId,
      listId: newListId,
      position: newPosition
    });
  };

  if (isUpdating || isDeleting || isMoving || isUpdatingPosition || isUpdatingPositions) {
    return <LoadingPage text="Updating board..." />;
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={lists.map((list: List) => list.id)} strategy={horizontalListSortingStrategy}>
        {/* Global Loading Indicator */}
        {(isMoving || isUpdatingPosition || isUpdatingPositions) && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
            <div className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span className="text-sm font-medium">
                {isMoving ? 'Moving task...' : 
                 isUpdatingPosition ? 'Updating task position...' : 
                 isUpdatingPositions ? 'Updating list positions...' : 'Updating...'}
              </span>
            </div>
          </div>
        )}
        
        <div className="flex gap-3 overflow-x-auto py-4 !mt-10 h-full">
          {/* Initial drop zone */}
          <div className="flex-shrink-0 w-2 h-full flex items-center justify-center">
            {activeList && dragOverListId === lists[0]?.id && (
              <div className="w-1 h-20 bg-blue-400 rounded-full animate-pulse"></div>
            )}
            {isUpdatingPositions && (
              <div className="w-1 h-20 bg-blue-500 rounded-full animate-pulse"></div>
            )}
            {(isMoving || isUpdatingPosition) && (
              <div className="w-1 h-20 bg-green-500 rounded-full animate-pulse"></div>
            )}
          </div>

          {lists.map((list: List) => (
            <div key={list.id} className="flex-shrink-0 w-80 h-full">
              <SortableList
                list={list}
                tasks={listTasks[list.id] || []}
                lists={lists}
                onEditList={handleEditList}
                onDeleteList={handleDeleteList}
                onTaskMove={handleTaskMove}
                isDragOver={!!(activeList && dragOverListId === list.id)}
                isUpdatingPositions={isUpdatingPositions}
              />

              {/* Drop zone after each list */}
              <div className="flex-shrink-0 w-2 h-full flex items-center justify-center">
                {activeList && dragOverListId === list.id && (
                  <div className="w-1 h-20 bg-blue-400 rounded-full animate-pulse"></div>
                )}
                {isUpdatingPositions && (
                  <div className="w-1 h-20 bg-blue-500 rounded-full animate-pulse"></div>
                )}
                {(isMoving || isUpdatingPosition) && (
                  <div className="w-1 h-20 bg-green-500 rounded-full animate-pulse"></div>
                )}
              </div>
            </div>
          ))}

          {lists.length === 0 && (
            <div className="flex-shrink-0 w-80 h-full">
              <div className="h-48 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                <div className="text-center text-gray-500">
                  {isUpdatingPositions ? (
                    <>
                      <div className="w-12 h-12 mx-auto mb-2 rounded-lg border-2 border-blue-500 border-t-transparent flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      </div>
                      <p className="text-sm">Updating lists...</p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm">No lists yet</p>
                      <p className="text-xs">Create your first list to get started</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </SortableContext>

      {/* Drag Overlay */}
      <DragOverlay>
        {activeTask ? (
          <div className="w-80 h-full">
            <DraggableTask
              task={activeTask}
              onEdit={() => { }}
              onDelete={() => { }}
              lists={lists}
              isMoving={isMoving}
              isUpdatingPosition={isUpdatingPosition}
            />
          </div>
        ) : activeList ? (
          <div className="w-80 h-full">
            <div className="h-fit min-h-[340px] max-h-[400px] bg-white shadow-2xl rounded-lg border-2 border-blue-400 opacity-95 transform rotate-2 relative">
              {isUpdatingPositions && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-lg z-10 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm text-blue-600 font-medium">Updating...</span>
                  </div>
                </div>
              )}
              <div className="p-4 border-b bg-blue-50">
                <h3 className="font-semibold text-gray-900 flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  {activeList.title}
                </h3>
              </div>
              <div className="p-4">
                <div className="text-sm text-gray-500 mb-3">
                  {listTasks[activeList.id]?.length || 0} tasks
                </div>
                <div className="space-y-2">
                  {listTasks[activeList.id]?.slice(0, 3).map((task) => (
                    <div key={task.id} className="p-2 bg-gray-50 rounded border-l-2 border-blue-300">
                      <div className="text-xs font-medium text-gray-700 truncate">{task.title}</div>
                    </div>
                  ))}
                  {listTasks[activeList.id]?.length > 3 && (
                    <div className="text-xs text-gray-400 text-center">
                      +{listTasks[activeList.id].length - 3} more tasks
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </DragOverlay>

      {/* Delete List Confirmation Dialog */}
      <DeleteConfirmation
        isOpen={!!deleteListId}
        onClose={() => setDeleteListId(null)}
        onConfirm={handleConfirmDeleteList}
        title="Delete List"
        message="Are you sure you want to delete this list?"
        itemName={lists.find((l: List) => l.id === deleteListId)?.title}
        itemType="list"
        isLoading={isDeleting}
        variant="danger"
      />
    </DndContext>
  );
}
