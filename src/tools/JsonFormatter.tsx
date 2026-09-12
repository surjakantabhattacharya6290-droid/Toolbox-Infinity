import { useState, useMemo } from 'react';
import { Braces, Copy, Trash2, Check, AlertCircle, ChevronRight, ChevronDown } from 'lucide-react';
import { ToolCard, ToolButton } from '@/components/ToolCard';
import { TOOL_MAP } from '@/lib/relations';
import { playChime } from '@/lib/audio';
import { pushToast } from '@/components/Toast';
import { rewardToolUse } from '@/lib/rewards';

const tool = TOOL_MAP['json-formatter'];

interface TreeNodeProps {
  data: unknown;
  keyName?: string;
  depth: number;
}

function TreeNode({ data, keyName, depth }: TreeNodeProps) {
  const [open, setOpen] = useState(depth < 2);
  const isObj = typeof data === 'object' && data !== null;
  const isArr = Array.isArray(data);

  if (!isObj) {
    return (
      <div style={{ marginLeft: depth * 16 }} className="flex items-baseline gap-1.5 py-0.5">
        {keyName !== undefined && <span className="text-green-400 font-medium">"{keyName}":</span>}
        <span className={typeof data === 'string' ? 'text-cyan-300' : typeof data === 'number' ? 'text-amber-300' : typeof data === 'boolean' ? 'text-purple-300' : 'text-rose-300'}>
          {typeof data === 'string' ? `"${data}"` : String(data)}
        </span>
      </div>
    );
  }

  const entries = Object.entries(data as Record<string, unknown>);

  return (
    <div style={{ marginLeft: depth * 16 }}>
      <button onClick={() => setOpen(!open)} className="flex items-center gap-1 py-0.5 hover:bg-green-500/10 rounded px-1">
        {open ? <ChevronDown className="w-3.5 h-3.5 text-green-400" /> : <ChevronRight className="w-3.5 h-3.5 text-green-400" />}
        {keyName !== undefined && <span className="text-green-400 font-medium">"{keyName}":</span>}
        <span className="text-slate-500">{isArr ? '[' : '{'}</span>
        {!open && <span className="text-slate-500">{isArr ? ']' : '}'} <span className="text-slate-600 text-xs">{entries.length} items</span></span>}
      </button>
      {open && (
        <>
          {entries.map(([k, v]) => <TreeNode key={k} data={v} keyName={k} depth={depth + 1} />)}
          <div className="text-slate-500">{isArr ? ']' : '}'}</div>
        </>
      )}
    </div>
  );
}

export function JsonFormatter() {
  const [input, setInput] = useState('');
  const [indent, setIndent] = useState(2);

  const { parsed, error, formatted } = useMemo(() => {
    if (!input.trim()) return { parsed: null, error: null, formatted: '' };
    try {
      const obj = JSON.parse(input);
      return { parsed: obj, error: null, formatted: JSON.stringify(obj, null, indent) };
    } catch (e) {
      return { parsed: null, error: (e as Error).message, formatted: '' };
    }
  }, [input, indent]);

  const format = () => {
    if (parsed) {
      setInput(JSON.stringify(parsed, null, indent));
      playChime();
      pushToast('JSON formatted!', 'success');
      rewardToolUse('json-formatter');
    }
  };

  const minify = () => {
    if (parsed) {
      setInput(JSON.stringify(parsed));
      playChime();
      pushToast('JSON minified!', 'success');
    }
  };

  const copy = () => {
    if (formatted) {
      navigator.clipboard.writeText(formatted);
      playChime();
      pushToast('Copied to clipboard!', 'success');
    }
  };

  return (
    <ToolCard tool={tool}>
      <div className="flex flex-wrap gap-2 mb-4">
        <ToolButton onClick={format} disabled={!parsed} theme={tool.theme}>Format</ToolButton>
        <ToolButton onClick={minify} disabled={!parsed} theme={tool.theme} variant="ghost">Minify</ToolButton>
        <ToolButton onClick={copy} disabled={!formatted} theme={tool.theme} variant="ghost">
          <span className="flex items-center gap-1.5"><Copy className="w-3.5 h-3.5" /> Copy</span>
        </ToolButton>
        <ToolButton onClick={() => setInput('')} disabled={!input} theme={tool.theme} variant="ghost">
          <span className="flex items-center gap-1.5"><Trash2 className="w-3.5 h-3.5" /> Clear</span>
        </ToolButton>
        <div className="flex items-center gap-2 ml-auto">
          <label className="text-xs text-green-400/60">Indent:</label>
          <select value={indent} onChange={e => setIndent(Number(e.target.value))} className="px-2 py-1 rounded-lg bg-slate-900 text-green-300 text-xs border border-green-400/20">
            <option value={2}>2 spaces</option>
            <option value={4}>4 spaces</option>
            <option value={0}>Minified</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-green-400/60 mb-1.5 flex items-center gap-1.5"><Braces className="w-3.5 h-3.5" /> Input</p>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder='{"name":"Toolbox","version":1,"tools":[...]}'
            rows={14}
            className="w-full p-3 rounded-xl text-sm font-mono outline-none resize-y"
            style={{ background: 'rgba(10,15,10,0.6)', color: '#dcfce7', border: '1px solid rgba(74,222,128,0.2)' }}
          />
        </div>
        <div>
          <p className="text-xs text-green-400/60 mb-1.5 flex items-center gap-1.5">
            {error ? <AlertCircle className="w-3.5 h-3.5 text-rose-400" /> : <Check className="w-3.5 h-3.5" />} {error ? 'Error' : 'Tree View'}
          </p>
          {error ? (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-400/30 text-sm text-rose-300 font-mono">
              {error}
            </div>
          ) : parsed ? (
            <div className="p-3 rounded-xl overflow-auto max-h-80 font-mono text-sm" style={{ background: 'rgba(10,15,10,0.6)', border: '1px solid rgba(74,222,128,0.2)' }}>
              <TreeNode data={parsed} depth={0} />
            </div>
          ) : (
            <div className="p-3 rounded-xl text-sm text-green-500/30 text-center" style={{ background: 'rgba(10,15,10,0.6)', border: '1px solid rgba(74,222,128,0.1)' }}>
              Formatted output appears here
            </div>
          )}
        </div>
      </div>
    </ToolCard>
  );
}
