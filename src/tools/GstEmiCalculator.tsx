import { useState, useMemo } from 'react';
import { Calculator, TrendingUp, Percent } from 'lucide-react';
import { ToolCard, ToolStat, ToolLabel } from '@/components/ToolCard';
import { TOOL_MAP } from '@/lib/relations';
import { playChime } from '@/lib/audio';
import { rewardToolUse } from '@/lib/rewards';

const tool = TOOL_MAP['gst-emi-calculator'];

type Mode = 'gst' | 'emi';

export function GstEmiCalculator() {
  const [mode, setMode] = useState<Mode>('emi');

  // EMI state
  const [principal, setPrincipal] = useState(500000);
  const [rate, setRate] = useState(10);
  const [tenure, setTenure] = useState(60);

  // GST state
  const [amount, setAmount] = useState(10000);
  const [gstRate, setGstRate] = useState(18);

  const emiResult = useMemo(() => {
    const r = rate / 12 / 100;
    const n = tenure;
    const emi = r === 0 ? principal / n : (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const total = emi * n;
    const interest = total - principal;
    return { emi, total, interest };
  }, [principal, rate, tenure]);

  const gstResult = useMemo(() => {
    const gst = (amount * gstRate) / 100;
    return { gst, total: amount + gst, cgst: gst / 2, sgst: gst / 2 };
  }, [amount, gstRate]);

  const handleCalc = () => {
    playChime();
    rewardToolUse('gst-emi-calculator');
  };

  return (
    <ToolCard tool={tool}>
      <div className="flex gap-2 mb-5">
        <button
          onClick={() => { setMode('emi'); playChime(); }}
          className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
          style={mode === 'emi'
            ? { background: 'linear-gradient(135deg, #fbbf24, #f59e0b)', color: '#0d0c08' }
            : { background: 'rgba(251,191,36,0.1)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.2)' }}
        >
          EMI Calculator
        </button>
        <button
          onClick={() => { setMode('gst'); playChime(); }}
          className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
          style={mode === 'gst'
            ? { background: 'linear-gradient(135deg, #fbbf24, #f59e0b)', color: '#0d0c08' }
            : { background: 'rgba(251,191,36,0.1)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.2)' }}
        >
          GST Calculator
        </button>
      </div>

      {mode === 'emi' ? (
        <>
          <div className="space-y-4 mb-5">
            <div>
              <div className="flex justify-between mb-1.5">
                <ToolLabel theme={tool.theme}>Loan Amount</ToolLabel>
                <span className="text-sm font-bold text-amber-300">₹{principal.toLocaleString()}</span>
              </div>
              <input type="range" min="10000" max="10000000" step="10000" value={principal} onChange={e => { setPrincipal(Number(e.target.value)); handleCalc(); }} className="w-full accent-amber-400" />
            </div>
            <div>
              <div className="flex justify-between mb-1.5">
                <ToolLabel theme={tool.theme}>Interest Rate (% / year)</ToolLabel>
                <span className="text-sm font-bold text-amber-300">{rate}%</span>
              </div>
              <input type="range" min="0" max="30" step="0.5" value={rate} onChange={e => { setRate(Number(e.target.value)); handleCalc(); }} className="w-full accent-amber-400" />
            </div>
            <div>
              <div className="flex justify-between mb-1.5">
                <ToolLabel theme={tool.theme}>Tenure (months)</ToolLabel>
                <span className="text-sm font-bold text-amber-300">{tenure} mo</span>
              </div>
              <input type="range" min="1" max="360" value={tenure} onChange={e => { setTenure(Number(e.target.value)); handleCalc(); }} className="w-full accent-amber-400" />
            </div>
          </div>

          <div className="p-5 rounded-2xl text-center mb-4" style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)' }}>
            <p className="text-xs uppercase tracking-widest text-amber-400/60 mb-1">Monthly EMI</p>
            <p className="text-3xl font-black text-amber-200">₹{Math.round(emiResult.emi).toLocaleString()}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <ToolStat label="Total Interest" value={`₹${Math.round(emiResult.interest).toLocaleString()}`} theme={tool.theme} />
            <ToolStat label="Total Payable" value={`₹${Math.round(emiResult.total).toLocaleString()}`} theme={tool.theme} />
          </div>
        </>
      ) : (
        <>
          <div className="space-y-4 mb-5">
            <div>
              <div className="flex justify-between mb-1.5">
                <ToolLabel theme={tool.theme}>Base Amount</ToolLabel>
                <span className="text-sm font-bold text-amber-300">₹{amount.toLocaleString()}</span>
              </div>
              <input type="range" min="100" max="10000000" step="100" value={amount} onChange={e => { setAmount(Number(e.target.value)); handleCalc(); }} className="w-full accent-amber-400" />
            </div>
            <div>
              <div className="flex justify-between mb-1.5">
                <ToolLabel theme={tool.theme}>GST Rate</ToolLabel>
                <span className="text-sm font-bold text-amber-300">{gstRate}%</span>
              </div>
              <input type="range" min="0" max="28" step="1" value={gstRate} onChange={e => { setGstRate(Number(e.target.value)); handleCalc(); }} className="w-full accent-amber-400" />
            </div>
          </div>

          <div className="p-5 rounded-2xl text-center mb-4" style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)' }}>
            <p className="text-xs uppercase tracking-widest text-amber-400/60 mb-1">Total with GST</p>
            <p className="text-3xl font-black text-amber-200">₹{Math.round(gstResult.total).toLocaleString()}</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            <ToolStat label="GST Amount" value={`₹${Math.round(gstResult.gst).toLocaleString()}`} theme={tool.theme} />
            <ToolStat label="CGST" value={`₹${Math.round(gstResult.cgst).toLocaleString()}`} theme={tool.theme} />
            <ToolStat label="SGST" value={`₹${Math.round(gstResult.sgst).toLocaleString()}`} theme={tool.theme} />
          </div>
        </>
      )}

      <div className="flex items-center gap-2 mt-4 text-xs text-amber-400/40">
        <Calculator className="w-3.5 h-3.5" />
        <span>Calculations update in real-time. EMI uses standard amortization formula.</span>
      </div>
    </ToolCard>
  );
}
