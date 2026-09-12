import type { ReactNode } from 'react';
import * as Icons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ToolMeta } from '@/lib/relations';
import { getTheme } from '@/lib/theme';

interface ToolCardProps {
  tool: ToolMeta;
  children: ReactNode;
}

export function ToolCard({ tool, children }: ToolCardProps) {
  const theme = getTheme(tool.theme);
  const Icon = (Icons as unknown as Record<string, LucideIcon | undefined>)[tool.icon] ?? Icons.Box;

  return (
    <div
      className="rounded-3xl backdrop-blur-2xl p-6 sm:p-8 transition-all duration-500 relative overflow-hidden"
      style={{
        background: 'rgba(10,14,26,0.5)',
        backdropFilter: 'blur(20px) saturate(180%)',
        border: `1px solid ${theme.border}`,
        boxShadow: `0 0 30px ${theme.glow}, inset 0 0 20px ${theme.glow2}`,
      }}
    >
      {/* Top neon accent line */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${theme.primary}, transparent)` }} />
      {/* Corner glow */}
      <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-20 pointer-events-none" style={{ background: `radial-gradient(circle, ${theme.glow}, transparent 70%)` }} />

      <div className="flex items-center gap-3 mb-6 relative">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform hover:scale-110"
          style={{
            background: `linear-gradient(135deg, ${theme.chipBg}, rgba(15,20,35,0.4))`,
            border: `1px solid ${theme.chipBorder}`,
            boxShadow: `0 0 12px ${theme.glow}`,
          }}
        >
          <Icon className="w-6 h-6" style={{ color: theme.primary }} />
        </div>
        <div>
          <h2 className="text-xl font-bold" style={{ color: theme.text }}>{tool.name}</h2>
          <p className="text-sm" style={{ color: theme.textMuted }}>{tool.description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

interface ToolButtonProps {
  onClick: () => void;
  children: ReactNode;
  disabled?: boolean;
  variant?: 'primary' | 'ghost';
  theme: ToolMeta['theme'];
  className?: string;
}

export function ToolButton({ onClick, children, disabled, variant = 'primary', theme, className = '' }: ToolButtonProps) {
  const colors = getTheme(theme);
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-[1.03] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${className}`}
      style={variant === 'primary'
        ? { background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`, color: '#0a0e1a', boxShadow: `0 0 15px ${colors.glow}` }
        : { background: colors.chipBg, color: colors.chipText, border: `1px solid ${colors.chipBorder}` }
      }
    >
      {children}
    </button>
  );
}

interface ToolInputProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  theme: ToolMeta['theme'];
  type?: string;
  className?: string;
}

export function ToolInput({ value, onChange, placeholder, theme, type = 'text', className = '' }: ToolInputProps) {
  const colors = getTheme(theme);
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all duration-200 focus:scale-[1.01] ${className}`}
      style={{ background: 'rgba(5,7,15,0.6)', color: colors.text, border: `1px solid ${colors.border}` }}
    />
  );
}

interface ToolLabelProps {
  children: ReactNode;
  theme: ToolMeta['theme'];
  className?: string;
}

export function ToolLabel({ children, theme, className = '' }: ToolLabelProps) {
  const colors = getTheme(theme);
  return (
    <label className={`block text-xs font-semibold mb-1.5 ${className}`} style={{ color: colors.textMuted }}>
      {children}
    </label>
  );
}

interface ToolStatProps {
  label: string;
  value: string | number;
  theme: ToolMeta['theme'];
}

export function ToolStat({ label, value, theme }: ToolStatProps) {
  const colors = getTheme(theme);
  return (
    <div
      className="p-4 rounded-xl backdrop-blur-sm transition-all hover:scale-[1.02]"
      style={{ background: colors.chipBg, border: `1px solid ${colors.chipBorder}` }}
    >
      <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: colors.textMuted }}>{label}</p>
      <p className="text-2xl font-bold" style={{ color: colors.primary }}>{value}</p>
    </div>
  );
}
