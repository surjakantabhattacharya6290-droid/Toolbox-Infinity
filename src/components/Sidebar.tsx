import { useState } from 'react';
import * as Icons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { TOOLS, type ToolId } from '@/lib/relations';
import { getTheme } from '@/lib/theme';

interface SidebarProps {
  activeTool: ToolId | null;
  onSelectTool: (id: ToolId) => void;
  onGoHome: () => void;
  isHome: boolean;
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export function Sidebar({ activeTool, onSelectTool, onGoHome, isHome, collapsed, onToggleCollapse, mobileOpen, onCloseMobile }: SidebarProps) {
  const [hovered, setHovered] = useState<string | null>(null);
  const categories = [...new Set(TOOLS.map(t => t.category))];

  return (
    <>
      {mobileOpen && <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden" onClick={onCloseMobile} />}
      <aside
        className={`fixed md:relative z-50 h-full transition-all duration-300 ${
          collapsed ? 'w-16' : 'w-60'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
        style={{
          background: 'linear-gradient(180deg, rgba(5,7,15,0.95), rgba(8,10,20,0.98))',
          borderRight: '1px solid rgba(255,255,255,0.04)',
        }}
      >
        <div className="flex flex-col h-full">
          {/* Logo / collapse */}
          <div className="flex items-center justify-between px-3 py-4 border-b border-white/5">
            {!collapsed && (
              <button onClick={onGoHome} className="flex items-center gap-2 group">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 via-violet-500 to-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Icons.Infinity className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-black shimmer-text tracking-wide">TOOLBOX</span>
              </button>
            )}
            <div className="flex items-center gap-1">
              {!collapsed && (
                <button
                  onClick={onGoHome}
                  className={`p-1.5 rounded-lg transition-colors ${isHome ? 'text-cyan-300 bg-cyan-500/10' : 'text-slate-500 hover:text-cyan-400 hover:bg-white/5'}`}
                  title="Dashboard"
                >
                  <Icons.LayoutGrid className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={onToggleCollapse}
                className="p-1.5 rounded-lg hover:bg-white/5 text-slate-500 hover:text-cyan-400 transition-colors hidden md:block"
              >
                {collapsed ? <Icons.ChevronRight className="w-4 h-4" /> : <Icons.ChevronLeft className="w-4 h-4" />}
              </button>
              <button onClick={onCloseMobile} className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 md:hidden">
                <Icons.X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Home button */}
          <div className="px-2 pt-3 pb-1">
            <button
              onClick={() => { onGoHome(); onCloseMobile(); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 ${
                isHome ? 'scale-[1.02]' : 'hover:scale-[1.01]'
              }`}
              style={isHome
                ? { background: 'linear-gradient(135deg, rgba(34,211,238,0.12), rgba(167,139,250,0.08))', border: '1px solid rgba(34,211,238,0.3)', boxShadow: '0 0 16px rgba(34,211,238,0.15)' }
                : { border: '1px solid transparent' }
              }
            >
              <Icons.LayoutGrid className="w-4 h-4 flex-shrink-0" style={{ color: isHome ? '#22d3ee' : '#64748b' }} />
              {!collapsed && <span className="text-xs font-semibold" style={{ color: isHome ? '#e0f7fa' : '#94a3b8' }}>Dashboard</span>}
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto py-2 px-1.5 space-y-3 scrollbar-thin">
            {categories.map(cat => (
              <div key={cat}>
                {!collapsed && (
                  <p className="px-3 py-1.5 text-[9px] uppercase tracking-widest text-slate-600 font-bold">{cat}</p>
                )}
                <div className="space-y-0.5">
                  {TOOLS.filter(t => t.category === cat).map(tool => {
                    const Icon = (Icons as unknown as Record<string, LucideIcon | undefined>)[tool.icon] ?? Icons.Box;
                    const isActive = activeTool === tool.id;
                    const isHovered = hovered === tool.id;
                    const theme = getTheme(tool.theme);
                    return (
                      <button
                        key={tool.id}
                        onClick={() => { onSelectTool(tool.id); onCloseMobile(); }}
                        onMouseEnter={() => setHovered(tool.id)}
                        onMouseLeave={() => setHovered(null)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 group relative ${
                          isActive ? 'scale-[1.02]' : 'hover:scale-[1.01]'
                        }`}
                        style={isActive
                          ? { background: theme.cardBg, border: `1px solid ${theme.border}`, boxShadow: `0 0 16px ${theme.glow}, inset 0 0 8px ${theme.glow2}` }
                          : { border: '1px solid transparent' }
                        }
                      >
                        <Icon
                          className="w-4 h-4 flex-shrink-0 transition-transform group-hover:scale-110"
                          style={{ color: isActive || isHovered ? theme.primary : '#64748b' }}
                        />
                        {!collapsed && (
                          <span className="text-xs font-medium truncate" style={{ color: isActive ? theme.text : '#94a3b8' }}>
                            {tool.shortName}
                          </span>
                        )}
                        {isActive && !collapsed && (
                          <div className="ml-auto w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: theme.primary, boxShadow: `0 0 6px ${theme.primary}` }} />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          <div className="px-3 py-3 border-t border-white/5">
            <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-2'}`}>
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-400 to-cyan-500 flex items-center justify-center text-xs font-bold text-white">
                TI
              </div>
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-slate-400 font-medium">Toolbox Infinity</p>
                  <p className="text-[9px] text-cyan-500/40">v2.0 • Cosmic</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
