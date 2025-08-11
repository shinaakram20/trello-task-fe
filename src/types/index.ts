export interface User {
  id: string;
  email: string;
}

export interface Board {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  color: string;
  created_at: string;
  updated_at: string;
  owner_email?: string;
}

export interface List {
  id: string;
  board_id: string;
  title: string;
  position: number;
  created_at: string;
  updated_at: string;
  board_title?: string;
  owner_email?: string;
}

export interface Task {
  id: string;
  list_id: string;
  title: string;
  description?: string;
  position: number;
  due_date?: string;
  priority: 'low' | 'medium' | 'high';
  status: string; // Changed from 'todo' | 'in_progress' | 'done' to string for dynamic list-based statuses
  created_at: string;
  updated_at: string;
  list_title?: string;
  board_title?: string;
  owner_email?: string;
}

export interface CreateBoardData {
  title: string;
  description?: string;
  color?: string;
}

export interface CreateListData {
  title: string;
  boardId: string;
  position?: number;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  listId: string;
  position?: number;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
  status?: string; // Changed from 'todo' | 'in_progress' | 'done' to string
}

export interface UpdateBoardData {
  title?: string;
  description?: string;
  color?: string;
}

export interface UpdateListData {
  title?: string;
  position?: number;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  position?: number;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
  status?: string; // Changed from 'todo' | 'in_progress' | 'done' to string
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface Comment {
  id: string;
  task_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  owner_email?: string;
}