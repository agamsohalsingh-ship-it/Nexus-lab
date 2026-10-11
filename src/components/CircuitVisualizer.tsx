import React from 'react';
import type { PinConnection } from '../types';
import { Cpu, ArrowRightLeft, Zap } from 'lucide-react';

interface CircuitVisualizerProps {
  pinConnections: PinConnection[];
  title?: string;
  mcuName?: string;
}

export const CircuitVisualizer: React.FC<CircuitVisualizerProps> = ({
  pinConnections,
  title = 'Circuit Pinout & Hardware Interconnects',
  mcuName = 'Microcontroller'
}) => {
  if (!pinConnections || pinConnections.length === 0) {
    return null;
  }

  const getVoltageBadgeColor = (voltage: string) => {
    const v = voltage.toUpperCase();
    if (v.includes('5V')) return 'text-amber-400 bg-amber-950/40 border-amber-500/30';
    if (v.includes('3.3V')) return 'text-cyan-400 bg-cyan-950/40 border-cyan-500/30';
    if (v.includes('GND')) return 'text-slate-400 bg-slate-900 border-slate-700';
    if (v.includes('ANALOG')) return 'text-fuchsia-400 bg-fuchsia-950/40 border-fuchsia-500/30';
    return 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30';
  };

  return (
    <div className="bg-[#0b101d] border border-cyan-500/20 rounded-xl overflow-hidden shadow-lg">
      <div className="px-5 py-4 border-b border-slate-800 bg-[#0d1424] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-cyan-400" />
          <h4 className="text-sm font-semibold text-slate-200">{title}</h4>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Cpu className="w-3.5 h-3.5 text-slate-400" />
          <span>Target: {mcuName}</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800/80 bg-slate-900/50 text-slate-400 uppercase tracking-wider font-mono">
              <th className="py-3 px-4">Component Pin</th>
              <th className="py-3 px-2 text-center">Bus</th>
              <th className="py-3 px-4">Microcontroller Pin</th>
              <th className="py-3 px-3">Rail / Level</th>
              <th className="py-3 px-4">Signal Function</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {pinConnections.map((pin) => (
              <tr key={pin.id} className="hover:bg-slate-800/30 transition-colors">
                <td className="py-3 px-4 font-semibold text-slate-200">
                  {pin.componentPin}
                </td>
                <td className="py-3 px-2 text-center text-slate-400">
                  <ArrowRightLeft className="w-3 h-3 inline-block text-cyan-500/70" />
                </td>
                <td className="py-3 px-4 font-semibold text-cyan-300">
                  {pin.mcuPin}
                </td>
                <td className="py-3 px-3">
                  <span className={`inline-flex px-2 py-0.5 rounded text-[11px] border font-medium ${getVoltageBadgeColor(pin.voltage)}`}>
                    {pin.voltage}
                  </span>
                </td>
                <td className="py-3 px-4 font-sans text-slate-300">
                  {pin.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
