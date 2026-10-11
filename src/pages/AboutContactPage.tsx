import React, { useState } from 'react';
import {
  Mail,
  Send,
  Github,
  Youtube,
  Linkedin,
  Cpu,
  Layers,
  Shield,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import type { WebsiteSettings } from '../types';
import { api } from '../services/api';

interface AboutContactPageProps {
  settings?: WebsiteSettings | null;
}

export const AboutContactPage: React.FC<AboutContactPageProps> = ({ settings }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    honeypot: '' // Spam protection trap
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setErrorMessage('Please fill in your name, email, and message.');
      setStatus('error');
      return;
    }

    try {
      setStatus('submitting');
      setErrorMessage('');
      await api.sendContactMessage(formData);
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '', honeypot: '' });
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err.message || 'Failed to deliver message.');
    }
  };

  const skillMatrix = [
    {
      category: 'Microcontrollers & Silicon',
      skills: ['ESP32 (S3, WROOM)', 'ESP8266 NodeMCU', 'ATmega328P / Arduino', 'STM32 ARM Cortex', 'FreeRTOS Task Queues']
    },
    {
      category: 'Buses & Protocols',
      skills: ['ESP-NOW 2.4GHz RF', 'I2S Digital Audio DMA', 'Hardware I2C (Fast 400kHz)', 'SPI Bus Displays', 'UART / NMEA GPS', 'MQTT / WebSockets']
    },
    {
      category: 'Electronics & Hardware',
      skills: ['KiCad PCB Layout', 'Precision Soldering (SMD & THT)', 'Oscilloscope Signal Debugging', 'Step-down Buck Regulators', 'Li-ion Battery PMIC']
    },
    {
      category: 'Robotics & Mechanical',
      skills: ['Inverse Kinematics Trigonometry', 'PCA9685 16-Ch PWM Servo Bus', 'CAD Modeling & 3D Printing', 'H-Bridge Motor Drivers', 'Acoustic Baffle Chambers']
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Profile Section */}
      <div className="bg-[#090e1a] border border-cyan-500/20 rounded-3xl p-6 sm:p-10 shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {/* Avatar / Portrait */}
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-2xl overflow-hidden border-2 border-cyan-400 shadow-[0_0_25px_rgba(0,240,255,0.2)]">
              <img
                src={settings?.makerAvatar || '/src/assets/images/maker_profile_portrait_1791611566803.jpg'}
                alt={settings?.makerName || 'Agam Singh'}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#090e1a]/60 via-transparent to-transparent pointer-events-none" />
            </div>

            <div className="space-y-1">
              <h2 className="text-xl font-bold text-white">{settings?.makerName || 'Agam Singh'}</h2>
              <p className="text-xs font-mono text-cyan-400">{settings?.makerRole || 'Hardware Maker & Robotics Engineer'}</p>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3 pt-2">
              {settings?.githubUrl && (
                <a
                  href={settings.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition-colors"
                  title="GitHub"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
              {settings?.youtubeUrl && (
                <a
                  href={settings.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition-colors"
                  title="YouTube"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              )}
              {settings?.linkedinUrl && (
                <a
                  href={settings.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition-colors"
                  title="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Bio text */}
          <div className="md:col-span-2 space-y-4">
            <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
              MAKER MANIFESTO & PHILOSOPHY
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Engineering Practical Inventions From First Principles
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {settings?.makerBio ||
                'Electronics maker, embedded systems developer, and robotics enthusiast specializing in ESP32/ESP8266 architectures, low-power IoT networks (ESP-NOW), custom OLED human-machine interfaces, and physical AI voice assistants. Building practical safety devices and autonomous robotic platforms.'}
            </p>
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-400 space-y-1">
              <span className="font-mono text-cyan-400 font-semibold">Laboratory Focus:</span>
              <p>
                Zero-telemetry open hardware, transparent firmware, repairable electronics, and safety devices that operate without cellular towers or subscriptions.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Technical Skill Matrix */}
      <div className="space-y-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Technical Hardware & Firmware Stack
          </h2>
          <p className="text-sm text-slate-400">
            Silicon architectures, communication standards, and prototyping tools actively utilized.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {skillMatrix.map((item, idx) => (
            <div
              key={idx}
              className="bg-[#090e1a] border border-slate-800 rounded-xl p-5 space-y-3"
            >
              <h3 className="text-sm font-bold text-cyan-300 font-mono uppercase tracking-wider">
                {item.category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {item.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-xs font-mono text-slate-300 bg-slate-900 px-2.5 py-1 rounded border border-slate-800"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Form with Anti-Spam Protection */}
      <div className="bg-[#090e1a] border border-cyan-500/20 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-cyan-400" />
            <h2 className="text-2xl font-bold text-white tracking-tight">Direct Lab Transmission</h2>
          </div>
          <p className="text-sm text-slate-400">
            Have an engineering inquiry, collaborative hardware idea, or robotics question? Send a message directly into the lab queue.
          </p>
        </div>

        {status === 'success' ? (
          <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-2xl p-6 text-center space-y-3">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <h3 className="text-base font-bold text-white">Transmission Received</h3>
            <p className="text-xs text-slate-300 max-w-md mx-auto">
              Your message has been delivered to the laboratory dashboard. I will review your telemetry and reply via email shortly.
            </p>
            <button
              onClick={() => setStatus('idle')}
              className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-emerald-900/60 text-emerald-200 border border-emerald-500/30"
            >
              Send Another Transmission
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Honeypot field for automated spam bots (hidden visually) */}
            <div className="hidden" aria-hidden="true">
              <label htmlFor="hp_field">Leave this empty</label>
              <input
                id="hp_field"
                type="text"
                value={formData.honeypot}
                onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider">
                  Your Name / Call-Sign *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Chen"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#060a12] border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. alex@makerlab.org"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[#060a12] border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider">
                Subject
              </label>
              <input
                type="text"
                placeholder="e.g. Question on ESP-NOW mesh packet repeaters"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full bg-[#060a12] border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider">
                Message Content *
              </label>
              <textarea
                required
                rows={5}
                placeholder="Write your technical questions, project ideas, or feedback..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-[#060a12] border border-slate-800 rounded-xl p-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 transition-colors leading-relaxed"
              />
            </div>

            {status === 'error' && (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-xs text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'submitting'}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-sm hover:from-cyan-400 hover:to-blue-500 transition-all shadow-[0_0_20px_rgba(0,240,255,0.3)] flex items-center gap-2 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{status === 'submitting' ? 'Transmitting...' : 'Send Laboratory Message'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
