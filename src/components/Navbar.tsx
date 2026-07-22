import React from 'react';
import { Menu, Plus, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  onMenuToggle: () => void;
  onOpenAddTaskModal?: () => void;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
  title?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onMenuToggle,
  onOpenAddTaskModal,
  searchQuery,
  onSearchChange,
  title = 'Dashboard',
}) => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
      {/* Left section: Hamburger & Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          aria-label="Toggle navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h2 className="text-lg font-semibold text-slate-900 tracking-tight">{title}</h2>
        </div>
      </div>

      {/* Right section: Search bar & Quick Add Task */}
      <div className="flex items-center gap-3">
        {onSearchChange !== undefined && (
          <div className="relative hidden sm:block w-48 md:w-64">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery || ''}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 text-slate-900 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-slate-800/10 focus:border-slate-400 transition-all placeholder:text-slate-400"
            />
          </div>
        )}

        {onOpenAddTaskModal && (
          <button
            id="btn-navbar-add-task"
            onClick={onOpenAddTaskModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-sm transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>New Task</span>
          </button>
        )}

        {/* User Chip */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-800 font-semibold flex items-center justify-center text-xs border border-slate-200">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
        </div>
      </div>
    </header>
  );
};
