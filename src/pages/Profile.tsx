import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User as UserIcon, Mail, ShieldCheck, Calendar, Key, LogOut } from 'lucide-react';

export const Profile: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header card */}
      <div className="p-6 bg-white border border-slate-200/90 rounded-2xl shadow-xs flex flex-col sm:flex-row items-center sm:items-start gap-5">
        <div className="w-16 h-16 rounded-2xl bg-slate-900 text-white font-bold flex items-center justify-center text-2xl shadow-md shrink-0">
          {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
        </div>

        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">{user?.name}</h1>
          <p className="text-xs text-slate-500 mt-0.5">{user?.email}</p>
          <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 text-[11px] font-semibold border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Authenticated User (JWT Session Active)</span>
          </div>
        </div>

        <button
          onClick={logout}
          className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Logout</span>
        </button>
      </div>

      {/* Account Details Card */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-sm font-bold text-slate-900">Account Details</h2>
        </div>

        <div className="p-6 space-y-4 divide-y divide-slate-100">
          <div className="flex items-center justify-between pt-2 first:pt-0">
            <div className="flex items-center gap-3">
              <UserIcon className="w-4 h-4 text-slate-400" />
              <div>
                <p className="text-xs font-semibold text-slate-800">Full Name</p>
                <p className="text-xs text-slate-500">{user?.name}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3">
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-slate-400" />
              <div>
                <p className="text-xs font-semibold text-slate-800">Email Address</p>
                <p className="text-xs text-slate-500">{user?.email}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3">
            <div className="flex items-center gap-3">
              <Key className="w-4 h-4 text-slate-400" />
              <div>
                <p className="text-xs font-semibold text-slate-800">User ID</p>
                <p className="text-xs font-mono text-slate-500">{user?._id}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3">
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-slate-400" />
              <div>
                <p className="text-xs font-semibold text-slate-800">Authentication Method</p>
                <p className="text-xs text-slate-500">JWT Token (Bearer Authentication)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
