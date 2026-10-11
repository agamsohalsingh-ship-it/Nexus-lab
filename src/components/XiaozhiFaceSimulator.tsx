import React, { useState, useEffect } from 'react';
import { Volume2, Mic, Sparkles, Radio } from 'lucide-react';

export const XiaozhiFaceSimulator: React.FC = () => {
  const [mode, setMode] = useState<'idle' | 'listening' | 'thinking' | 'speaking'>('speaking');
  const [blink, setBlink] = useState(false);
  const [pulse, setPulse] = useState(0);

  // Automatic blink timer
  useEffect(() => {
    const interval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 220);
    }, 3800);
    return () => clearInterval(interval);
  }, []);

  // Audio wave pulse when speaking
  useEffect(() => {
    if (mode === 'speaking') {
      const pulseInterval = setInterval(() => {
        setPulse((prev) => (prev + 1) % 6);
      }, 180);
      return () => clearInterval(pulseInterval);
    }
  }, [mode]);

  return (
    <div className="bg-[#090e1a] border border-cyan-500/20 rounded-2xl p-6 shadow-xl flex flex-col items-center">
      <div className="w-full flex items-center justify-between pb-3 mb-6 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-white">GC9A01 Circular OLED Eye Render Simulation</h3>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
          <span>I2S 16kHz</span>
        </div>
      </div>

      {/* The Circular Screen Bezel */}
      <div className="relative w-64 h-64 rounded-full bg-[#050811] p-3 shadow-[0_0_40px_rgba(0,240,255,0.25)] border-4 border-slate-800 flex items-center justify-center">
        {/* Outer illuminated cyan status ring */}
        <div className={`absolute inset-0 rounded-full border-2 transition-all duration-300 pointer-events-none ${
          mode === 'listening' ? 'border-cyan-400 shadow-[0_0_20px_#00f0ff]' :
          mode === 'thinking' ? 'border-fuchsia-500 shadow-[0_0_20px_#ff007f] animate-spin' :
          mode === 'speaking' ? 'border-cyan-300 shadow-[0_0_25px_#00f0ff]' :
          'border-cyan-500/30'
        }`} />

        {/* OLED Pixel Canvas */}
        <div className="w-56 h-56 rounded-full bg-[#04060c] relative overflow-hidden flex flex-col items-center justify-center border border-cyan-500/20">
          {/* Subtle CRT scanline effect */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,240,255,0.03)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none"></div>

          {/* Eyes rendering */}
          <div className="flex items-center justify-center gap-8 relative z-10 transition-all duration-150">
            {/* Left Eye */}
            <div
              className={`rounded-full bg-cyan-300 transition-all duration-150 shadow-[0_0_15px_#00f0ff] flex items-center justify-center ${
                blink ? 'h-1.5 w-12' :
                mode === 'listening' ? 'w-14 h-16' :
                mode === 'thinking' ? 'w-12 h-10 rotate-6' :
                mode === 'speaking' ? `w-14 h-${12 + (pulse % 4) * 2}` :
                'w-12 h-14'
              }`}
            >
              {!blink && (
                <div className={`w-3.5 h-3.5 rounded-full bg-[#04060c] ${
                  mode === 'listening' ? 'translate-x-1.5' :
                  mode === 'thinking' ? '-translate-y-1' :
                  ''
                }`} />
              )}
            </div>

            {/* Right Eye */}
            <div
              className={`rounded-full bg-cyan-300 transition-all duration-150 shadow-[0_0_15px_#00f0ff] flex items-center justify-center ${
                blink ? 'h-1.5 w-12' :
                mode === 'listening' ? 'w-14 h-16' :
                mode === 'thinking' ? 'w-12 h-10 -rotate-6' :
                mode === 'speaking' ? `w-14 h-${12 + (pulse % 4) * 2}` :
                'w-12 h-14'
              }`}
            >
              {!blink && (
                <div className={`w-3.5 h-3.5 rounded-full bg-[#04060c] ${
                  mode === 'listening' ? 'translate-x-1.5' :
                  mode === 'thinking' ? '-translate-y-1' :
                  ''
                }`} />
              )}
            </div>
          </div>

          {/* Mode label on screen bottom */}
          <div className="absolute bottom-6 font-mono text-[11px] text-cyan-400 tracking-wider uppercase">
            {mode}
          </div>
        </div>
      </div>

      {/* State Switcher Buttons */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        <button
          onClick={() => setMode('idle')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
            mode === 'idle'
              ? 'bg-cyan-950/80 text-cyan-300 border-cyan-400 shadow-[0_0_10px_rgba(0,240,255,0.2)]'
              : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
          }`}
        >
          Idle Standby
        </button>

        <button
          onClick={() => setMode('listening')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
            mode === 'listening'
              ? 'bg-cyan-950/80 text-cyan-300 border-cyan-400 shadow-[0_0_10px_rgba(0,240,255,0.2)]'
              : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
          }`}
        >
          <Mic className="w-3.5 h-3.5 text-cyan-400" />
          <span>VAD Listening</span>
        </button>

        <button
          onClick={() => setMode('thinking')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
            mode === 'thinking'
              ? 'bg-fuchsia-950/80 text-fuchsia-300 border-fuchsia-400 shadow-[0_0_10px_rgba(255,0,127,0.2)]'
              : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-fuchsia-400" />
          <span>LLM Inference</span>
        </button>

        <button
          onClick={() => setMode('speaking')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
            mode === 'speaking'
              ? 'bg-cyan-950/80 text-cyan-300 border-cyan-400 shadow-[0_0_10px_rgba(0,240,255,0.2)]'
              : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
          }`}
        >
          <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
          <span>I2S Speech Out</span>
        </button>
      </div>

      <p className="mt-4 text-xs text-slate-400 text-center max-w-sm">
        Rendered using optimized frame-buffer pixel arrays running at 50 FPS on the GC9A01 controller over high-speed hardware SPI.
      </p>
    </div>
  );
};
