import * as Icons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { TOOLS, type ToolId } from '@/lib/relations';
import { getTheme } from '@/lib/theme';
import { playChime } from '@/lib/audio';

interface ToolGridProps {
  onSelectTool: (id: ToolId) => void;
}

export function ToolGrid({ onSelectTool }: ToolGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {TOOLS.map((tool, idx) => {
        const Icon = (Icons as unknown as Record<string, LucideIcon | undefined>)[tool.icon] ?? Icons.Box;
        const theme = getTheme(tool.theme);
        return (
          <button
            key={tool.id}
            onClick={() => { onSelectTool(tool.id); playChime(600, 900); }}
            className="group glass-card rounded-2xl p-5 text-left transition-all duration-300 hover:scale-[1.04] hover:-translate-y-1 relative overflow-hidden"
            style={{ animationDelay: `${idx * 50}ms` }}
          >
            {/* Hover glow layer */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              style={{ background: `radial-gradient(circle at 50% 0%, ${theme.glow}, transparent 70%)` }}
            />

            {/* Top neon line */}
            <div
              className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ background: `linear-gradient(90deg, transparent, ${theme.primary}, transparent)` }}
            />

            <div className="relative">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110 group-hover:rotate-3"
                style={{
                  background: `linear-gradient(135deg, ${theme.chipBg}, rgba(15,20,35,0.4))`,
                  border: `1px solid ${theme.chipBorder}`,
                  boxShadow: `0 0 12px ${theme.glow}`,
                }}
              >
                <Icon className="w-6 h-6" style={{ color: theme.primary }} />
              </div>
              <h4 className="text-sm font-bold text-slate-100 mb-1 group-hover:text-white transition-colors">{tool.name}</h4>
              <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{tool.description}</p>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
                <span
                  className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                  style={{ background: theme.chipBg, color: theme.chipText, border: `1px solid ${theme.chipBorder}` }}
                >
                  {tool.category}
                </span>
                <Icons.ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-300 group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
