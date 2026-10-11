import React, { useState, useRef, useEffect } from 'react';
import { Bot, RefreshCw } from 'lucide-react';

export const RobotArmSimulator: React.FC = () => {
  // Target position in 2D coordinates (X, Y)
  const [target, setTarget] = useState({ x: 140, y: 120 });
  const [isDragging, setIsDragging] = useState(false);
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Arm link lengths
  const L1 = 120; // Base to elbow
  const L2 = 100; // Elbow to wrist

  // Origin on SVG canvas
  const originX = 180;
  const originY = 220;

  // Inverse Kinematics Solver (2-link planar)
  const dist = Math.hypot(target.x, target.y);
  const maxReach = L1 + L2 - 5;
  const clampedDist = Math.min(Math.max(dist, 40), maxReach);
  const scale = clampedDist / (dist || 1);
  const solveX = target.x * scale;
  const solveY = target.y * scale;

  // Cosine rule
  const cosAngle2 = (solveX * solveX + solveY * solveY - L1 * L1 - L2 * L2) / (2 * L1 * L2);
  const clampedCos2 = Math.min(Math.max(cosAngle2, -1), 1);
  const angle2Rad = Math.acos(clampedCos2); // Elbow angle relative to link 1

  const alpha = Math.atan2(solveY, solveX);
  const beta = Math.atan2(L2 * Math.sin(angle2Rad), L1 + L2 * Math.cos(angle2Rad));
  const angle1Rad = alpha - beta; // Shoulder angle relative to horizon

  // Joint positions
  const joint1X = originX;
  const joint1Y = originY;

  const joint2X = originX + L1 * Math.cos(angle1Rad);
  const joint2Y = originY - L1 * Math.sin(angle1Rad);

  const endEffectorX = joint2X + L2 * Math.cos(angle1Rad + angle2Rad);
  const endEffectorY = joint2Y - L2 * Math.sin(angle1Rad + angle2Rad);

  // Angles in degrees for presentation
  const shoulderDeg = Math.round((angle1Rad * 180) / Math.PI);
  const elbowDeg = Math.round((angle2Rad * 180) / Math.PI);

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!isDragging || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    // Convert to relative coords from base
    const relX = clientX - originX;
    const relY = originY - clientY;
    setTarget({ x: Math.max(20, relX), y: Math.max(10, relY) });
  };

  return (
    <div className="bg-[#090e1a] border border-cyan-500/20 rounded-2xl p-6 shadow-xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 mb-4 border-b border-slate-800 gap-2">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-cyan-400" />
          <h3 className="text-base font-bold text-white">Interactive 2-DOF Kinematics Visualizer</h3>
        </div>
        <button
          onClick={() => setTarget({ x: 140, y: 120 })}
          className="text-xs flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Reset Arm Position</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
        {/* SVG Simulation Canvas */}
        <div className="lg:col-span-2 relative bg-[#060a12] rounded-xl border border-slate-800/80 p-2 flex items-center justify-center overflow-hidden">
          <svg
            ref={svgRef}
            viewBox="0 0 360 260"
            className="w-full max-w-md h-64 cursor-crosshair select-none touch-none"
            onPointerDown={() => setIsDragging(true)}
            onPointerUp={() => setIsDragging(false)}
            onPointerLeave={() => setIsDragging(false)}
            onPointerMove={handlePointerMove}
          >
            {/* Grid Lines */}
            <defs>
              <pattern id="simGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(0, 240, 255, 0.05)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="360" height="260" fill="url(#simGrid)" />

            {/* Base platform */}
            <rect x="140" y="220" width="80" height="18" rx="4" fill="#1e293b" stroke="#334155" strokeWidth="2" />
            <line x1="20" y1="238" x2="340" y2="238" stroke="#1e293b" strokeWidth="2" strokeDasharray="4 4" />

            {/* Reach envelope arc */}
            <circle cx={originX} cy={originY} r={maxReach} fill="none" stroke="rgba(0, 240, 255, 0.12)" strokeDasharray="3 3" />

            {/* Link 1 (Base to Elbow) */}
            <line
              x1={joint1X}
              y1={joint1Y}
              x2={joint2X}
              y2={joint2Y}
              stroke="#00f0ff"
              strokeWidth="8"
              strokeLinecap="round"
            />

            {/* Link 2 (Elbow to End Effector) */}
            <line
              x1={joint2X}
              y1={joint2Y}
              x2={endEffectorX}
              y2={endEffectorY}
              stroke="#ff007f"
              strokeWidth="6"
              strokeLinecap="round"
            />

            {/* Shoulder Joint Pivot */}
            <circle cx={joint1X} cy={joint1Y} r="9" fill="#070b14" stroke="#00f0ff" strokeWidth="3" />

            {/* Elbow Joint Pivot */}
            <circle cx={joint2X} cy={joint2Y} r="8" fill="#070b14" stroke="#ff007f" strokeWidth="3" />

            {/* End Effector Gripper Head */}
            <circle cx={endEffectorX} cy={endEffectorY} r="7" fill="#facc15" stroke="#ca8a04" strokeWidth="2" />

            {/* Target Draggable Handle */}
            <g
              transform={`translate(${endEffectorX}, ${endEffectorY})`}
              className="transition-transform"
            >
              <circle r="16" fill="rgba(250, 204, 21, 0.2)" stroke="#facc15" strokeWidth="1.5" strokeDasharray="2 2" />
            </g>
          </svg>

          <div className="absolute bottom-3 left-4 text-[11px] text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded border border-slate-800">
            Click & drag anywhere on grid to position end-effector
          </div>
        </div>

        {/* Real-time Math & Telemetry */}
        <div className="space-y-4">
          <div className="bg-[#060a12] p-4 rounded-xl border border-slate-800/80 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between text-slate-400 pb-2 border-b border-slate-800">
              <span>KINEMATIC STATE</span>
              <span className="text-cyan-400">REAL-TIME</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-400">Target X, Y:</span>
              <span className="text-amber-400 tabular-nums">
                ({Math.round(solveX)}mm, {Math.round(solveY)}mm)
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-400">Shoulder Servo (θ1):</span>
              <span className="text-cyan-400 font-bold tabular-nums">
                {shoulderDeg}°
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-400">Elbow Servo (θ2):</span>
              <span className="text-fuchsia-400 font-bold tabular-nums">
                {elbowDeg}°
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-400">Reach Extension:</span>
              <span className="text-slate-300 tabular-nums">
                {Math.round(clampedDist)} / {maxReach} mm
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed font-sans">
            The ESP32 firmware executes analytic geometric inverse kinematics using hardware floating point math in under 40 microseconds, translating coordinates directly into PCA9685 12-bit PWM register commands.
          </p>
        </div>
      </div>
    </div>
  );
};
