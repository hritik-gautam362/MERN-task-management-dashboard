import React from 'react';
import { Task } from '../types';
import { Calendar, CheckCircle2, Circle, Edit3, Trash2, Clock, AlertTriangle } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onStatusToggle: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onStatusToggle,
  onEdit,
  onDelete,
}) => {
  const isCompleted = task.status === 'Completed';

  // Format dates cleanly for Indian locale
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  // Check if overdue
  const isOverdue =
    !isCompleted &&
    task.dueDate &&
    new Date(task.dueDate).setHours(23, 59, 59, 999) < new Date().getTime();

  const priorityColors = {
    Low: 'bg-slate-100 text-slate-700 border-slate-200',
    Medium: 'bg-amber-50 text-amber-800 border-amber-200',
    High: 'bg-rose-50 text-rose-700 border-rose-200 font-semibold',
  };

  return (
    <div
      id={`task-card-${task._id}`}
      className={`group relative p-5 bg-white rounded-xl border transition-all duration-200 hover:shadow-md ${
        isCompleted
          ? 'border-slate-200 bg-slate-50/50 opacity-80'
          : isOverdue
          ? 'border-rose-200 bg-rose-50/30'
          : 'border-slate-200/90 hover:border-slate-300'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Status Toggle Checkbox */}
        <button
          onClick={() => onStatusToggle(task)}
          className="mt-0.5 text-slate-400 hover:text-emerald-600 transition-colors shrink-0 focus:outline-none"
          title={isCompleted ? 'Mark as Pending' : 'Mark as Completed'}
        >
          {isCompleted ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
          ) : (
            <Circle className="w-5 h-5 hover:text-slate-600" />
          )}
        </button>

        {/* Task Title & Description */}
        <div className="flex-1 min-w-0">
          <h3
            className={`text-sm font-semibold tracking-tight transition-all ${
              isCompleted ? 'line-through text-slate-400 font-normal' : 'text-slate-900'
            }`}
          >
            {task.title}
          </h3>

          {task.description && (
            <p
              className={`mt-1 text-xs line-clamp-2 ${
                isCompleted ? 'text-slate-400' : 'text-slate-600'
              }`}
            >
              {task.description}
            </p>
          )}

          {/* Badges & Meta Info */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {/* Priority Badge */}
            <span
              className={`px-2.5 py-0.5 text-[11px] rounded-md border ${
                priorityColors[task.priority] || priorityColors.Medium
              }`}
            >
              {task.priority} Priority
            </span>

            {/* Status Badge */}
            <span
              className={`px-2.5 py-0.5 text-[11px] rounded-md border font-medium ${
                isCompleted
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-sky-50 text-sky-700 border-sky-200'
              }`}
            >
              {task.status}
            </span>

            {/* Overdue Warning */}
            {isOverdue && (
              <span className="px-2 py-0.5 text-[11px] rounded-md bg-rose-100 text-rose-800 border border-rose-200 font-medium flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-rose-600" /> Overdue
              </span>
            )}
          </div>

          {/* Dates */}
          <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Due: {formatDate(task.dueDate)}</span>
            </div>

            <div className="flex items-center gap-1 text-slate-400">
              <Clock className="w-3.5 h-3.5" />
              <span>Created: {formatDate(task.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Edit & Delete Action Buttons */}
        <div className="flex items-center gap-1 shrink-0 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(task)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Edit Task"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(task._id)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            title="Delete Task"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
