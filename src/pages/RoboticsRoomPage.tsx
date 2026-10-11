import React from 'react';
import { Bot, Cpu, Zap, Activity, ChevronRight, Layers, PlayCircle, Wrench } from 'lucide-react';
import { RobotArmSimulator } from '../components/RobotArmSimulator';
import type { Project } from '../types';

interface RoboticsRoomPageProps {
  projects: Project[];
  onSelectProject: (slug: string) => void;
}

export const RoboticsRoomPage: React.FC<RoboticsRoomPageProps> = ({
  projects,
  onSelectProject
}) => {
  const roboticsProjects = projects.filter(
    (p) =>
      p.category === 'Robotics and Automation' ||
      p.tags.some((t) => ['Robotics', 'Servos', 'Kinematics', 'Automation'].includes(t))
  );

  const motorDriverGuide = [
    {
      chip: 'PCA9685 16-Channel PWM',
      role: 'Servo Bus Driver',
      voltage: '5V - 6V Rail',
      interface: 'I2C (0x40)',
      notes: 'Offloads high-precision 12-bit pulse generation from the MCU. Essential for multi-joint manipulators to avoid timer jitter.'
    },
    {
      chip: 'TB6612FNG Dual H-Bridge',
      role: 'DC Motor & Stepper Driver',
      voltage: '4.5V - 13.5V Rail',
      interface: 'PWM + Direction',
      notes: 'Modern MOSFET-based H-bridge with only 0.5V internal drop. Far superior to legacy bipolar L298N drivers which waste energy as heat.'
    },
    {
      chip: 'MG996R Metal-Gear Servos',
      role: 'Arm Joint Actuator',
      voltage: '6.0V Optimized',
      interface: '50Hz PWM (1.0-2.0ms)',
      notes: 'Provides 11 kg-cm stall torque. Requires dedicated 5A power rail with bulk capacitance to handle instantaneous current spikes.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Header */}
      <div className="space-y-3 border-b border-slate-800 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-950/40 text-cyan-300 text-xs font-mono">
          <Bot className="w-3.5 h-3.5" />
          <span>ROBOTICS & ACTUATION WORKSHOP</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Robotics Room
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
          Dedicated exploration center for articulated manipulator arms, inverse kinematics algorithms, high-current servo power distribution, and precision automation mechanisms.
        </p>
      </div>

      {/* Interactive Inverse Kinematics Simulator */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Kinematics Simulation Testbed
            </h2>
            <p className="text-xs text-slate-400">
              Interactive 2-link planar solver executing trigonometric joint coordinate calculation.
            </p>
          </div>
        </div>
        <RobotArmSimulator />
      </div>

      {/* Robotics Projects Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white tracking-tight">
            Active Robotics Builds & Mechanisms
          </h2>
          <span className="text-xs font-mono text-cyan-400">
            {roboticsProjects.length} Systems Documented
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {roboticsProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => onSelectProject(project.slug)}
              className="cursor-pointer bg-[#090e1a] rounded-2xl border border-slate-800 hover:border-cyan-500/40 transition-all overflow-hidden flex flex-col group shadow-lg hover:shadow-[0_0_20px_rgba(0,240,255,0.1)]"
            >
              <div className="relative h-56 w-full overflow-hidden bg-slate-900">
                <img
                  src={project.coverImage}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#090e1a] via-[#090e1a]/30 to-transparent" />

                <div className="absolute top-4 right-4">
                  <span className="px-2.5 py-1 text-xs font-semibold rounded-md border text-cyan-400 border-cyan-500/30 bg-cyan-950/40">
                    {project.status}
                  </span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors mb-2">
                    {project.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                    {project.summary}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span>{project.components.length} Components</span>
                  <span className="text-cyan-400 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Inspect Schematics <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Motor Drivers & Actuation Engineering Reference */}
      <div className="space-y-6">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            <span>Motor Drivers & Actuator Topologies</span>
          </h2>
          <p className="text-xs text-slate-400">
            Selected driver architectures utilized across Nexus Robotics builds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {motorDriverGuide.map((item, idx) => (
            <div
              key={idx}
              className="bg-[#090e1a] border border-slate-800 rounded-xl p-5 space-y-3"
            >
              <div className="text-xs font-mono text-cyan-400 font-semibold">{item.role}</div>
              <h3 className="text-base font-bold text-white">{item.chip}</h3>
              <div className="space-y-1 text-xs font-mono text-slate-400">
                <div>Rail: <span className="text-slate-200">{item.voltage}</span></div>
                <div>Bus: <span className="text-slate-200">{item.interface}</span></div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-sans pt-2 border-t border-slate-800">
                {item.notes}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
