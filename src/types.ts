export interface Todo {
  id: string;
  title: string;
  description: string;
  deadline: string;
  status: 'pending' | 'completed';
  createdAt: string;
}

export type TodoStatus = 'all' | 'pending' | 'completed';