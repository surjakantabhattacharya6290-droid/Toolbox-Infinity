import * as Icons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { CATEGORIES, type ToolCategory } from '@/lib/relations';

interface CategoryTabsProps {
  active: ToolCategory;
  onChange: (cat: ToolCategory) => void;
  counts: Record<ToolCategory, number>;
}

export function CategoryTabs({ active, onChange, counts }: CategoryTabsProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {CATEGORIES.map(cat => {
        const Icon = (Icons as unknown as Record<string, LucideIcon | undefined>)[cat.icon] ?? Icons.Box;
        const isActive = active === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => onChange(cat.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
              isActive ? 'scale-[1.03]' : 'hover:scale-[1.01]'
            }`}
            style={isActive
              ? { background: 'linear-gradient(135deg, rgba(34,211,238,0.15), rgba(167,139,250,0.1))', border: '1px solid rgba(34,211,238,0.35)', boxShadow: '0 0 16px rgba(34,211,238,0.12)' }
              : { border: '1px solid rgba(255,255,255,0.05)', background: 'rgba(15,20,35,0.3)' }
            }
          >
            <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-300' : 'text-slate-500'}`} />
            <span className={isActive ? 'text-slate-100' : 'text-slate-400'}>{cat.label}</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${isActive ? 'bg-cyan-500/20 text-cyan-300' : 'bg-white/5 text-slate-500'}`}>
              {counts[cat.id]}
            </span>
          </button>
        );
      })}
    </div>
  );
}
