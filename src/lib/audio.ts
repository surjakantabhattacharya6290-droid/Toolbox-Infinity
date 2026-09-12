let audioEnabled = true;

export function initAudio(): void {
  const stored = localStorage.getItem('tbx_audio_enabled');
  audioEnabled = stored === null ? true : stored === 'true';
}

export function isAudioEnabled(): boolean {
  return audioEnabled;
}

export function setAudioEnabled(enabled: boolean): void {
  audioEnabled = enabled;
  localStorage.setItem('tbx_audio_enabled', String(enabled));
}

export function playChime(freqStart = 880, freqEnd = 1760): void {
  if (!audioEnabled) return;
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freqStart, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freqEnd, ctx.currentTime + 0.12);
    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  } catch {
    // AudioContext not available
  }
}

export function playArpeggio(): void {
  if (!audioEnabled) return;
  [523, 659, 784].forEach((freq, i) => {
    setTimeout(() => playChime(freq, freq * 1.5), i * 120);
  });
}
