import React, { useState, useEffect } from 'react';
import { Plus, Calendar, CheckCircle2, Circle, Trash2, Edit2 } from 'lucide-react';
import { Todo, TodoStatus } from './types';

function App() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem('todos');
    return saved ? JSON.parse(saved) : [];
  });
  const [filter, setFilter] = useState<TodoStatus>('all');
  const [newTodo, setNewTodo] = useState({
    title: '',
    description: '',
    deadline: ''
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.title.trim()) return;

    const todo: Todo = {
      id: crypto.randomUUID(),
      ...newTodo,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    setTodos([todo, ...todos]);
    setNewTodo({ title: '', description: '', deadline: '' });
  };

  const toggleStatus = (id: string) => {
    setTodos(todos.map(todo =>
      todo.id === id
        ? { ...todo, status: todo.status === 'pending' ? 'completed' : 'pending' }
        : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const startEditing = (todo: Todo) => {
    setEditingId(todo.id);
    setNewTodo({
      title: todo.title,
      description: todo.description,
      deadline: todo.deadline
    });
  };

  const updateTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId || !newTodo.title.trim()) return;

    setTodos(todos.map(todo =>
      todo.id === editingId
        ? { ...todo, ...newTodo }
        : todo
    ));
    setEditingId(null);
    setNewTodo({ title: '', description: '', deadline: '' });
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'all') return true;
    return todo.status === filter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-4xl font-bold text-indigo-900 mb-8 text-center">
          Task Manager
        </h1>

        <form onSubmit={editingId ? updateTodo : addTodo} className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid gap-4">
            <input
              type="text"
              placeholder="Task title"
              value={newTodo.title}
              onChange={e => setNewTodo({ ...newTodo, title: e.target.value })}
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <textarea
              placeholder="Description"
              value={newTodo.description}
              onChange={e => setNewTodo({ ...newTodo, description: e.target.value })}
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <div className="flex items-center gap-2">
              <Calendar className="text-gray-500" size={20} />
              <input
                type="datetime-local"
                value={newTodo.deadline}
                onChange={e => setNewTodo({ ...newTodo, deadline: e.target.value })}
                className="flex-1 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={20} />
              {editingId ? 'Update Task' : 'Add Task'}
            </button>
          </div>
        </form>

        <div className="flex gap-4 mb-6">
          {(['all', 'pending', 'completed'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-md ${
                filter === status
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filteredTodos.map(todo => (
            <div
              key={todo.id}
              className={`bg-white rounded-lg shadow-md p-6 ${
                todo.status === 'completed' ? 'opacity-75' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <button onClick={() => toggleStatus(todo.id)}>
                      {todo.status === 'completed' ? (
                        <CheckCircle2 className="text-green-500" size={24} />
                      ) : (
                        <Circle className="text-gray-400" size={24} />
                      )}
                    </button>
                    <h3 className={`text-xl font-semibold ${
                      todo.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'
                    }`}>
                      {todo.title}
                    </h3>
                  </div>
                  <p className="mt-2 text-gray-600">{todo.description}</p>
                  {todo.deadline && (
                    <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                      <Calendar size={16} />
                      {new Date(todo.deadline).toLocaleString()}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEditing(todo)}
                    className="p-2 text-gray-500 hover:text-indigo-600 transition-colors"
                  >
                    <Edit2 size={20} />
                  </button>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filteredTodos.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No tasks found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;