import { useState, useMemo } from 'react';
import { Calendar, Clock } from 'lucide-react';
import { ToolCard, ToolStat, ToolLabel } from '@/components/ToolCard';
import { TOOL_MAP } from '@/lib/relations';
import { playChime } from '@/lib/audio';
import { rewardToolUse } from '@/lib/rewards';

const tool = TOOL_MAP['age-calculator'];

function todayStr() {
  return new Date().toISOString().split('T')[0];
}

export function AgeCalculator() {
  const [birthDate, setBirthDate] = useState('');
  const [targetDate, setTargetDate] = useState(todayStr());

  const result = useMemo(() => {
    if (!birthDate) return null;
    const birth = new Date(birthDate);
    const target = new Date(targetDate);
    if (target < birth) return null;

    let years = target.getFullYear() - birth.getFullYear();
    let months = target.getMonth() - birth.getMonth();
    let days = target.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(target.getFullYear(), target.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    const totalMs = target.getTime() - birth.getTime();
    const totalDays = Math.floor(totalMs / 86400000);
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = years * 12 + months;
    const totalHours = Math.floor(totalMs / 3600000);
    const totalMinutes = Math.floor(totalMs / 60000);

    const nextBirthday = new Date(target.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBirthday < target) nextBirthday.setFullYear(nextBirthday.getFullYear() + 1);
    const daysToBirthday = Math.ceil((nextBirthday.getTime() - target.getTime()) / 86400000);

    return { years, months, days, totalDays, totalWeeks, totalMonths, totalHours, totalMinutes, daysToBirthday };
  }, [birthDate, targetDate]);

  return (
    <ToolCard tool={tool}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div>
          <ToolLabel theme={tool.theme}>Birth Date</ToolLabel>
          <input
            type="date"
            value={birthDate}
            onChange={e => { setBirthDate(e.target.value); playChime(600, 900); if (e.target.value) rewardToolUse('age-calculator'); }}
            max={todayStr()}
            className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
            style={{ background: 'rgba(20,30,50,0.5)', color: '#f0f9ff', border: '1px solid rgba(147,197,253,0.2)' }}
          />
        </div>
        <div>
          <ToolLabel theme={tool.theme}>Target Date (default: today)</ToolLabel>
          <input
            type="date"
            value={targetDate}
            onChange={e => setTargetDate(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
            style={{ background: 'rgba(20,30,50,0.5)', color: '#f0f9ff', border: '1px solid rgba(147,197,253,0.2)' }}
          />
        </div>
      </div>

      {result ? (
        <>
          <div className="p-6 rounded-2xl mb-4 text-center" style={{ background: 'rgba(147,197,253,0.08)', border: '1px solid rgba(147,197,253,0.2)' }}>
            <p className="text-xs uppercase tracking-widest text-blue-300/60 mb-2">Your Age</p>
            <p className="text-3xl font-black text-blue-100">
              {result.years}<span className="text-lg text-blue-300/60"> years</span>{' '}
              {result.months}<span className="text-lg text-blue-300/60"> months</span>{' '}
              {result.days}<span className="text-lg text-blue-300/60"> days</span>
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            <ToolStat label="Total Days" value={result.totalDays.toLocaleString()} theme={tool.theme} />
            <ToolStat label="Total Weeks" value={result.totalWeeks.toLocaleString()} theme={tool.theme} />
            <ToolStat label="Total Months" value={result.totalMonths.toLocaleString()} theme={tool.theme} />
            <ToolStat label="Total Hours" value={result.totalHours.toLocaleString()} theme={tool.theme} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <ToolStat label="Total Minutes" value={result.totalMinutes.toLocaleString()} theme={tool.theme} />
            <ToolStat label="Days to Birthday" value={result.daysToBirthday} theme={tool.theme} />
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <Calendar className="w-12 h-12 mx-auto text-blue-400/30 mb-3" />
          <p className="text-sm text-blue-300/50">Select a birth date to calculate precise age telemetry</p>
          <div className="flex items-center justify-center gap-1.5 mt-3 text-xs text-blue-400/40">
            <Clock className="w-3.5 h-3.5" />
            <span>Calculates down to the minute</span>
          </div>
        </div>
      )}
    </ToolCard>
  );
}
