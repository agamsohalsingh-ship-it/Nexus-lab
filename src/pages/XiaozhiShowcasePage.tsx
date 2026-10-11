import React from 'react';
import {
  Cpu,
  Mic,
  Volume2,
  Tv,
  Wifi,
  Sparkles,
  Terminal,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { XiaozhiFaceSimulator } from '../components/XiaozhiFaceSimulator';
import { CircuitVisualizer } from '../components/CircuitVisualizer';
import type { Project } from '../types';

interface XiaozhiShowcasePageProps {
  xiaozhiProject?: Project | null;
  onNavigateToProject: (slug: string) => void;
}

export const XiaozhiShowcasePage: React.FC<XiaozhiShowcasePageProps> = ({
  xiaozhiProject,
  onNavigateToProject
}) => {
  const hardwareSpecs = [
    {
      title: 'Compute Core',
      name: 'ESP32-S3-WROOM-1',
      desc: 'Xtensa LX7 Dual-Core @ 240MHz with 8MB Octal PSRAM and 16MB SPI Flash. Runs dual FreeRTOS tasks dedicated to audio DMA and TLS WebSocket streaming.'
    },
    {
      title: 'Audio Input',
      name: 'INMP441 MEMS Microphone',
      desc: 'High-performance omnidirectional I2S digital microphone module with 61 dBA SNR and -26 dBFS sensitivity. Bypasses noisy analog ADC lines.'
    },
    {
      title: 'Audio Output',
      name: 'MAX98357A I2S DAC Amplifier',
      desc: '3.2W Class-D mono digital-to-analog converter and amplifier driving a 40mm 4-ohm chambered micro-speaker with 92% power efficiency.'
    },
    {
      title: 'Human-Machine Interface',
      name: 'GC9A01 1.28" Round IPS LCD',
      desc: '240x240 RGB circular display connected via high-speed hardware SPI. Custom vector eye rendering routines provide emotional and communicative feedback.'
    }
  ];

  const firmwareSteps = [
    {
      step: '01',
      title: 'ESP-IDF & Toolchain Setup',
      desc: 'Configure ESP-IDF v5.2 with PSRAM enabled (Octal mode) and I2S driver installed with DMA buffers tuned to 512 samples.'
    },
    {
      step: '02',
      title: 'Audio Buffering & VAD Logic',
      desc: 'Core 0 runs the real-time audio pipeline: 16kHz 16-bit PCM voice activity detection (VAD) monitors room acoustics and triggers streaming.'
    },
    {
      step: '03',
      title: 'Full-Duplex WebSocket Streaming',
      desc: 'Core 1 streams binary audio frames over TLS WebSockets to an LLM speech pipeline, receiving synchronized streaming audio chunks.'
    },
    {
      step: '04',
      title: 'Vector Animation Engine',
      desc: 'SPI display updates in real-time between audio packets, altering eye geometry and dilation based on incoming audio amplitude peaks.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-950/40 text-cyan-300 text-xs font-mono">
          <Sparkles className="w-3.5 h-3.5" />
          <span>FLAGSHIP AI HARDWARE PROTOTYPE</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          Xiaozhi-Style ESP32 AI Voice Companion
        </h1>
        <p className="text-base text-slate-300 leading-relaxed">
          A physical manifestation of modern conversational intelligence. Engineered around the dual-core ESP32-S3 with digital I2S audio pipelines, full-duplex WebSocket streaming, and expressive circular OLED eye animations.
        </p>
      </div>

      {/* Main Interactive Showcase Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Device Photo & Real Hardware Details */}
        <div className="relative rounded-2xl overflow-hidden border border-cyan-500/20 bg-slate-950 shadow-2xl group">
          <img
            src="/src/assets/images/xiaozhi_esp32_assistant_1791611579093.jpg"
            alt="Xiaozhi ESP32 AI Assistant Hardware Prototype"
            className="w-full h-auto object-cover group-hover:scale-102 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#090e1a] via-[#090e1a]/20 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
            <span className="text-xs font-mono text-cyan-400 bg-slate-900/80 px-2.5 py-1 rounded border border-slate-800">
              Hardware Revision: Rev 0.4
            </span>
            {xiaozhiProject && (
              <button
                onClick={() => onNavigateToProject(xiaozhiProject.slug)}
                className="text-xs font-semibold text-white bg-cyan-600/80 hover:bg-cyan-500 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
              >
                <span>Full Project Page</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Interactive Screen Simulator */}
        <div>
          <XiaozhiFaceSimulator />
        </div>
      </div>

      {/* Hardware Architecture Breakdown */}
      <div className="space-y-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Hardware Engineering & Audio Pipeline
          </h2>
          <p className="text-sm text-slate-400">
            Selected components specifically chosen to eliminate analog distortion and RF switching noise.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {hardwareSpecs.map((spec, idx) => (
            <div
              key={idx}
              className="bg-[#090e1a] border border-slate-800 rounded-xl p-6 space-y-3 hover:border-cyan-500/30 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
                  {spec.title}
                </span>
                <Cpu className="w-4 h-4 text-slate-500" />
              </div>
              <h3 className="text-lg font-bold text-white">{spec.name}</h3>
              <p className="text-sm text-slate-300 leading-relaxed">{spec.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Circuit Connections */}
      {xiaozhiProject?.pinConnections && (
        <div className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Hardware Interconnects & Pinout Table
            </h2>
            <p className="text-sm text-slate-400">
              Precise GPIO assignments for the ESP32-S3 host board.
            </p>
          </div>
          <CircuitVisualizer
            pinConnections={xiaozhiProject.pinConnections}
            title="Xiaozhi ESP32-S3 Bus Mapping"
            mcuName="ESP32-S3 WROOM-1 N16R8"
          />
        </div>
      )}

      {/* Firmware & Architecture Execution */}
      <div className="bg-[#090e1a] border border-cyan-500/20 rounded-2xl p-8 space-y-8">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Firmware Architecture & FreeRTOS Pipeline
          </h2>
          <p className="text-sm text-slate-400">
            How the dual Xtensa LX7 cores orchestrate latency-critical audio processing and networking.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {firmwareSteps.map((step) => (
            <div
              key={step.step}
              className="bg-[#060a12] border border-slate-800 rounded-xl p-5 space-y-3"
            >
              <div className="text-2xl font-mono font-bold text-cyan-400">{step.step}</div>
              <h3 className="text-base font-bold text-white">{step.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Troubleshooting & Engineering Log */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-[#090e1a] border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <span>Critical Troubleshooting Log</span>
          </h3>

          <div className="space-y-3 text-sm text-slate-300">
            <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1">
              <span className="text-xs font-mono text-cyan-400 font-semibold">
                Issue: Acoustic Feedback Loop
              </span>
              <p className="text-xs text-slate-400">
                Micro-speaker sound caused the INMP441 microphone to re-trigger Voice Activity Detection in an endless loop. Fixed by designing a dual-chamber 3D printed enclosure with silicone acoustic isolation rings.
              </p>
            </div>

            <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1">
              <span className="text-xs font-mono text-cyan-400 font-semibold">
                Issue: DMA Audio Underruns
              </span>
              <p className="text-xs text-slate-400">
                During rapid Wi-Fi frame transmissions, audio playback occasionally clipped. Tuned FreeRTOS task priorities: audio DMA was set to priority 22 on Core 0 while WebSocket network thread was moved to priority 5 on Core 1.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#090e1a] border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-fuchsia-400" />
            <span>Future AI Assistant Roadmap</span>
          </h3>

          <div className="space-y-3 text-sm text-slate-300">
            <div className="flex items-start gap-3 p-3 bg-slate-900/80 rounded-xl border border-slate-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
              <div>
                <span className="text-xs font-semibold text-white">On-Device Neural Wake-Word (ESP-SR)</span>
                <p className="text-xs text-slate-400 mt-0.5">
                  Eliminating external cloud triggers by compiling lightweight 8-bit quantized wake-word models directly to ESP32-S3 vector instructions.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-slate-900/80 rounded-xl border border-slate-800">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
              <div>
                <span className="text-xs font-semibold text-white">Local Offline Speech Synthesis Fallback</span>
                <p className="text-xs text-slate-400 mt-0.5">
                  Porting SAM (Software Automatic Mouth) speech synthesis for instant offline feedback when internet connectivity drops.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-slate-900/80 rounded-xl border border-slate-800">
              <CheckCircle2 className="w-4 h-4 text-fuchsia-400 mt-0.5 shrink-0" />
              <div>
                <span className="text-xs font-semibold text-white">Integrated Thermal & Environmental Telemetry</span>
                <p className="text-xs text-slate-400 mt-0.5">
                  Adding BME680 indoor air quality sensor so the assistant can proactively warn the lab when soldering smoke builds up.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
