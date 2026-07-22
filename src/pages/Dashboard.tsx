import React, { useState, useEffect } from 'react';
import { Task, TaskFormData } from '../types';
import { taskService } from '../services/taskService';
import { useAuth } from '../context/AuthContext';
import { StatCard } from '../components/StatCard';
import { TaskCard } from '../components/TaskCard';
import { TaskModal } from '../components/TaskModal';
import { LoadingSpinner } from '../components/LoadingSpinner';
import {
  CheckSquare,
  Clock,
  ListTodo,
  AlertOctagon,
  Plus,
  ArrowRight,
  TrendingUp,
  Flame,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { addToast } = useAuth();

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const data = await taskService.getTasks();
      setTasks(data);
    } catch (err: any) {
      addToast('error', 'Failed to load tasks for dashboard.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Metrics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'Completed').length;
  const pendingTasks = tasks.filter((t) => t.status === 'Pending').length;
  const highPriorityTasks = tasks.filter((t) => t.priority === 'High' && t.status === 'Pending').length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Recent pending tasks
  const recentPending = tasks.filter((t) => t.status === 'Pending').slice(0, 4);

  const handleStatusToggle = async (task: Task) => {
    const newStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
    try {
      await taskService.updateTask(task._id, { status: newStatus });
      setTasks((prev) =>
        prev.map((t) => (t._id === task._id ? { ...t, status: newStatus } : t))
      );
      addToast(
        'success',
        `Task "${task.title}" marked as ${newStatus.toLowerCase()}.`
      );
    } catch (err: any) {
      addToast('error', 'Failed to update task status.');
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await taskService.deleteTask(id);
      setTasks((prev) => prev.filter((t) => t._id !== id));
      addToast('info', 'Task deleted.');
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
      {/* Banner / Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 p-6 sm:p-8 rounded-2xl text-white shadow-lg">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Flame className="w-4 h-4" /> Productivity Hub
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Overview Dashboard</h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Track your tasks, prioritize your workflow, and stay ahead of deadlines.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="self-start sm:self-center flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md transition-all active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Task</span>
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Tasks"
          value={totalTasks}
          icon={ListTodo}
          subtitle="All created tasks"
          colorScheme="slate"
        />
        <StatCard
          title="Completed"
          value={completedTasks}
          icon={CheckSquare}
          subtitle={`${completionRate}% completion rate`}
          colorScheme="emerald"
        />
        <StatCard
          title="Pending Tasks"
          value={pendingTasks}
          icon={Clock}
          subtitle="Requires attention"
          colorScheme="amber"
        />
        <StatCard
          title="High Priority"
          value={highPriorityTasks}
          icon={AlertOctagon}
          subtitle="Urgent pending tasks"
          colorScheme="rose"
        />
      </div>

      {/* Progress Bar & Status Summary */}
      <div className="p-6 bg-white border border-slate-200/90 rounded-2xl shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900">Task Completion Rate</h3>
          </div>
          <span className="text-xs font-bold text-slate-700">{completionRate}%</span>
        </div>

        {/* Progress Track */}
        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden p-0.5 border border-slate-200/60">
          <div
            className="bg-emerald-600 h-full rounded-full transition-all duration-500"
            style={{ width: `${completionRate}%` }}
          />
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-slate-500 font-medium pt-3 border-t border-slate-100">
          <span>Completed: <strong className="text-slate-800">{completedTasks}</strong></span>
          <span>Pending: <strong className="text-slate-800">{pendingTasks}</strong></span>
          <span>Total: <strong className="text-slate-800">{totalTasks}</strong></span>
        </div>
      </div>

      {/* Recent Pending Tasks Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            Urgent & Pending Tasks
          </h2>
          <Link
            to="/tasks"
            className="text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1 group"
          >
            <span>View All Tasks</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {isLoading ? (
          <LoadingSpinner message="Fetching dashboard statistics..." />
        ) : recentPending.length === 0 ? (
          <div className="p-8 text-center bg-white border border-dashed border-slate-200 rounded-2xl">
            <CheckSquare className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-slate-800">All caught up!</h3>
            <p className="text-xs text-slate-500 mt-1">No pending tasks found in your queue.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentPending.map((task) => (
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
      </div>

      {/* Task Modal */}
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
