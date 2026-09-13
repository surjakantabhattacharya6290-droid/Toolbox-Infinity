import { Sun, Moon, Monitor } from 'lucide-react';
import type { AppTheme } from '@/lib/theme';

interface ThemeToggleProps {
  theme: AppTheme;
  onChange: (theme: AppTheme) => void;
}

export function ThemeToggle({ theme, onChange }: ThemeToggleProps) {
  const options: { id: AppTheme; icon: typeof Sun; label: string }[] = [
    { id: 'light', icon: Sun, label: 'Light' },
    { id: 'dark', icon: Moon, label: 'Dark' },
    { id: 'system', icon: Monitor, label: 'System' },
  ];

  return (
    <div className="flex items-center gap-1 p-1 rounded-xl glass-card">
      {options.map(opt => {
        const Icon = opt.icon;
        const isActive = theme === opt.id;
        return (
          <button
            key={opt.id}
            onClick={() => onChange(opt.id)}
            className={`p-1.5 rounded-lg transition-all duration-200 ${isActive ? 'scale-105' : 'hover:scale-105'}`}
            style={isActive
              ? { background: 'linear-gradient(135deg, rgba(34,211,238,0.15), rgba(167,139,250,0.1))' }
              : {}
            }
            title={`${opt.label} theme`}
          >
            <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-300' : 'text-slate-500'}`} />
          </button>
        );
      })}
    </div>
  );
}
