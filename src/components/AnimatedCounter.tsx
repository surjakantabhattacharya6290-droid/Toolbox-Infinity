import { useEffect, useRef, useState } from 'react';

interface AnimatedCounterProps {
  value: number;
  className?: string;
  duration?: number;
}

export function AnimatedCounter({ value, className = '', duration = 600 }: AnimatedCounterProps) {
  const [display, setDisplay] = useState(value);
  const [pulsing, setPulsing] = useState(false);
  const prevRef = useRef(value);

  useEffect(() => {
    const prev = prevRef.current;
    if (value === prev) return;

    setPulsing(true);
    const start = performance.now();
    const diff = value - prev;

    const tick = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(prev + diff * eased));
      if (t < 1) requestAnimationFrame(tick);
      else { setDisplay(value); prevRef.current = value; }
    };
    requestAnimationFrame(tick);

    const timer = setTimeout(() => setPulsing(false), 600);
    return () => clearTimeout(timer);
  }, [value, duration]);

  return (
    <span className={`${pulsing ? 'animate-countPulse' : ''} ${className}`}>
      {display.toLocaleString()}
    </span>
  );
}
