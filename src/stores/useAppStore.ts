import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Board, List, Task, CreateBoardData, CreateListData, CreateTaskData } from '@/types';

interface AppState {
  // Data
  boards: Board[];
  lists: List[];
  tasks: Task[];
  currentBoard: Board | null;
  currentList: List | null;
  
  // UI State
  isLoading: boolean;
  error: string | null;
  isCreateBoardOpen: boolean;
  isCreateListOpen: boolean;
  isCreateTaskOpen: boolean;
  isEditTaskOpen: boolean;
  editingTask: Task | null;
  
  // Actions
  setBoards: (boards: Board[]) => void;
  setLists: (lists: List[]) => void;
  setTasks: (tasks: Task[]) => void;
  setCurrentBoard: (board: Board | null) => void;
  setCurrentList: (list: List | null) => void;
  
  // Board actions
  addBoard: (board: Board) => void;
  updateBoard: (id: string, updates: Partial<Board>) => void;
  deleteBoard: (id: string) => void;
  
  // List actions
  addList: (list: List) => void;
  updateList: (id: string, updates: Partial<List>) => void;
  deleteList: (id: string) => void;
  
  // Task actions
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTask: (taskId: string, newListId: string, newPosition: number) => void;
  
  // UI actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setCreateBoardOpen: (open: boolean) => void;
  setCreateListOpen: (open: boolean) => void;
  setCreateTaskOpen: (open: boolean) => void;
  setEditTaskOpen: (open: boolean, task?: Task) => void;
  
  // Utility actions
  getListsByBoard: (boardId: string) => List[];
  getTasksByList: (listId: string) => Task[];
  clearError: () => void;
}

export const useAppStore = create<AppState>()(
  devtools(
    (set, get) => ({
      // Initial state
      boards: [],
      lists: [],
      tasks: [],
      currentBoard: null,
      currentList: null,
      isLoading: false,
      error: null,
      isCreateBoardOpen: false,
      isCreateListOpen: false,
      isCreateTaskOpen: false,
      isEditTaskOpen: false,
      editingTask: null,
      
      // Setters
      setBoards: (boards) => set({ boards }),
      setLists: (lists) => set({ lists }),
      setTasks: (tasks) => set({ tasks }),
      setCurrentBoard: (board) => set({ currentBoard: board }),
      setCurrentList: (list) => set({ currentList: list }),
      
      // Board actions
      addBoard: (board) => set((state) => ({ 
        boards: [...state.boards, board] 
      })),
      
      updateBoard: (id, updates) => set((state) => ({
        boards: state.boards.map(board => 
          board.id === id ? { ...board, ...updates } : board
        ),
        currentBoard: state.currentBoard?.id === id 
          ? { ...state.currentBoard, ...updates } 
          : state.currentBoard
      })),
      
      deleteBoard: (id) => set((state) => ({
        boards: state.boards.filter(board => board.id !== id),
        currentBoard: state.currentBoard?.id === id ? null : state.currentBoard
      })),
      
      // List actions
      addList: (list) => set((state) => ({ 
        lists: [...state.lists, list] 
      })),
      
      updateList: (id, updates) => set((state) => ({
        lists: state.lists.map(list => 
          list.id === id ? { ...list, ...updates } : list
        ),
        currentList: state.currentList?.id === id 
          ? { ...state.currentList, ...updates } 
          : state.currentList
      })),
      
      deleteList: (id) => set((state) => ({
        lists: state.lists.filter(list => list.id !== id),
        currentList: state.currentList?.id === id ? null : state.currentList
      })),
      
      // Task actions
      addTask: (task) => set((state) => ({ 
        tasks: [...state.tasks, task] 
      })),
      
      updateTask: (id, updates) => set((state) => ({
        tasks: state.tasks.map(task => 
          task.id === id ? { ...task, ...updates } : task
        ),
        editingTask: state.editingTask?.id === id 
          ? { ...state.editingTask, ...updates } 
          : state.editingTask
      })),
      
      deleteTask: (id) => set((state) => ({
        tasks: state.tasks.filter(task => task.id !== id),
        editingTask: state.editingTask?.id === id ? null : state.editingTask
      })),
      
      moveTask: (taskId, newListId, newPosition) => set((state) => {
        const updatedTasks = state.tasks.map(task => {
          if (task.id === taskId) {
            return { ...task, list_id: newListId, position: newPosition };
          }
          return task;
        });
        return { tasks: updatedTasks };
      }),
      
      // UI actions
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      setCreateBoardOpen: (open) => set({ isCreateBoardOpen: open }),
      setCreateListOpen: (open) => set({ isCreateListOpen: open }),
      setCreateTaskOpen: (open) => set({ isCreateTaskOpen: open }),
      setEditTaskOpen: (open, task) => set({ 
        isEditTaskOpen: open, 
        editingTask: task || null 
      }),
      
      // Utility actions
      getListsByBoard: (boardId) => {
        const state = get();
        return state.lists
          .filter(list => list.board_id === boardId)
          .sort((a, b) => a.position - b.position);
      },
      
      getTasksByList: (listId) => {
        const state = get();
        return state.tasks
          .filter(task => task.list_id === listId)
          .sort((a, b) => a.position - b.position);
      },
      
      clearError: () => set({ error: null }),
    }),
    {
      name: 'app-store',
    }
  )
);
