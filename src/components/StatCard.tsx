import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  subtitle?: string;
  colorScheme?: 'indigo' | 'emerald' | 'amber' | 'rose' | 'slate';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  subtitle,
  colorScheme = 'slate',
}) => {
  const schemeStyles = {
    indigo: {
      bg: 'bg-indigo-50/70 border-indigo-100',
      iconBg: 'bg-indigo-600 text-white',
      text: 'text-indigo-950',
    },
    emerald: {
      bg: 'bg-emerald-50/70 border-emerald-100',
      iconBg: 'bg-emerald-600 text-white',
      text: 'text-emerald-950',
    },
    amber: {
      bg: 'bg-amber-50/70 border-amber-100',
      iconBg: 'bg-amber-600 text-white',
      text: 'text-amber-950',
    },
    rose: {
      bg: 'bg-rose-50/70 border-rose-100',
      iconBg: 'bg-rose-600 text-white',
      text: 'text-rose-950',
    },
    slate: {
      bg: 'bg-white border-slate-200/90',
      iconBg: 'bg-slate-900 text-white',
      text: 'text-slate-900',
    },
  };

  const current = schemeStyles[colorScheme];

  return (
    <div
      className={`p-5 rounded-2xl border shadow-xs transition-all hover:shadow-md ${current.bg}`}
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
        <div className={`p-2.5 rounded-xl shadow-xs ${current.iconBg}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="mt-3">
        <p className={`text-2xl sm:text-3xl font-bold tracking-tight ${current.text}`}>
          {value}
        </p>
        {subtitle && <p className="text-xs font-medium text-slate-500 mt-1">{subtitle}</p>}
      </div>
    </div>
  );
};
