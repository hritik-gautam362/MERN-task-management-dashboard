import React, { useState, useEffect } from 'react';
import { Task, TaskFormData, PriorityLevel } from '../types';
import { taskService } from '../services/taskService';
import { useAuth } from '../context/AuthContext';
import { TaskCard } from '../components/TaskCard';
import { TaskModal } from '../components/TaskModal';
import { LoadingSpinner } from '../components/LoadingSpinner';
import {
  Plus,
  Search,
  SlidersHorizontal,
  LayoutGrid,
  List,
  CheckCircle2,
  Clock,
  Inbox,
} from 'lucide-react';

export const TasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter & Search states
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Completed'>('All');
  const [priorityFilter, setPriorityFilter] = useState<'All' | PriorityLevel>('All');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'dueDate'>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { addToast } = useAuth();

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const data = await taskService.getTasks({
        search,
        status: statusFilter,
        priority: priorityFilter,
      });
      setTasks(data);
    } catch (err: any) {
      addToast('error', 'Failed to load tasks.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [statusFilter, priorityFilter]);

  // Handle client-side search & sort
  const filteredTasks = tasks
    .filter((task) => {
      if (!search.trim()) return true;
      const term = search.toLowerCase();
      return (
        task.title.toLowerCase().includes(term) ||
        (task.description && task.description.toLowerCase().includes(term))
      );
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      if (sortBy === 'dueDate') {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      return 0;
    });

  const handleStatusToggle = async (task: Task) => {
    const newStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
    try {
      await taskService.updateTask(task._id, { status: newStatus });
      setTasks((prev) =>
        prev.map((t) => (t._id === task._id ? { ...t, status: newStatus } : t))
      );
      addToast('success', `Task status changed to ${newStatus}`);
    } catch (err: any) {
      addToast('error', 'Failed to update task.');
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await taskService.deleteTask(id);
      setTasks((prev) => prev.filter((t) => t._id !== id));
      addToast('info', 'Task deleted successfully.');
    } catch (err: any) {
      addToast('error', 'Failed to delete task.');
    }
  };

  const handleModalSubmit = async (formData: TaskFormData) => {
    setIsSubmitting(true);
    try {
      if (editingTask) {
        const updated = await taskService.updateTask(editingTask._id, formData);
        setTasks((prev) => prev.map((t) => (t._id === editingTask._id ? updated : t)));
        addToast('success', 'Task updated successfully.');
      } else {
        const created = await taskService.createTask(formData);
        setTasks((prev) => [created, ...prev]);
        addToast('success', 'Task created successfully.');
      }
      setIsModalOpen(false);
      setEditingTask(null);
    } catch (err: any) {
      addToast('error', 'Failed to save task.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openCreateModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header & New Task CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Task Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Create, search, filter, and organize all your project tasks.
          </p>
        </div>

        <button
          id="btn-tasks-new-task"
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-all active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Task</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-xs space-y-3">
        <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 text-slate-900 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800 transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Controls Group */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Priority Filter */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value as any)}
                className="bg-transparent text-xs font-medium text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="All">All Priorities</option>
                <option value="Low">Low Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="High">High Priority</option>
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-xs font-medium text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="newest">Sort: Newest First</option>
                <option value="oldest">Sort: Oldest First</option>
                <option value="dueDate">Sort: Due Date</option>
              </select>
            </div>

            {/* View Layout Toggle */}
            <div className="hidden sm:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg text-xs transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Grid view"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg text-xs transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="List view"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
          <button
            onClick={() => setStatusFilter('All')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              statusFilter === 'All'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Tasks ({tasks.length})
          </button>
          <button
            onClick={() => setStatusFilter('Pending')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              statusFilter === 'Pending'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            Pending ({tasks.filter((t) => t.status === 'Pending').length})
          </button>
          <button
            onClick={() => setStatusFilter('Completed')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              statusFilter === 'Completed'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Completed ({tasks.filter((t) => t.status === 'Completed').length})
          </button>
        </div>
      </div>

      {/* Task List / Grid Display */}
      {isLoading ? (
        <LoadingSpinner message="Loading task list..." />
      ) : filteredTasks.length === 0 ? (
        <div className="p-12 text-center bg-white border border-dashed border-slate-200 rounded-2xl max-w-lg mx-auto">
          <Inbox className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-slate-800">No tasks found</h3>
          <p className="text-xs text-slate-500 mt-1">
            {search || statusFilter !== 'All' || priorityFilter !== 'All'
              ? 'Try adjusting your search query or clear your active filters.'
              : 'You have no tasks saved yet. Click "Add New Task" to get started.'}
          </p>
          <button
            onClick={openCreateModal}
            className="mt-4 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Create First Task</span>
          </button>
        </div>
      ) : (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
              : 'space-y-3'
          }
        >
          {filteredTasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onStatusToggle={handleStatusToggle}
              onEdit={openEditModal}
              onDelete={handleDeleteTask}
            />
          ))}
        </div>
      )}

      {/* Task Creation / Edit Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialData={editingTask}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};
