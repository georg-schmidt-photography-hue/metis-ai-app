import { useState } from 'react'
import AbstractRings from './ui/AbstractRings'

const BRAND = '#D4952B'

function PlatformSwitch({ label, defaultOn = false }) {
  const [on, setOn] = useState(defaultOn)
  return (
    <div
      className="flex items-center gap-3 cursor-pointer select-none"
      onClick={() => setOn(v => !v)}
    >
      {/* 3D Track */}
      <div
        style={{
          position: 'relative',
          width: 46,
          height: 24,
          borderRadius: 12,
          flexShrink: 0,
          transition: 'background 0.35s ease, box-shadow 0.35s ease',
          background: on
            ? 'linear-gradient(180deg, #c07d1c 0%, #D4952B 40%, #e8a830 100%)'
            : 'linear-gradient(180deg, #1a1a1a 0%, #252525 100%)',
          boxShadow: on
            ? '0 2px 10px rgba(212,149,43,0.45), 0 0 20px rgba(212,149,43,0.2), inset 0 1px 0 rgba(255,255,255,0.2), inset 0 2px 4px rgba(0,0,0,0.2)'
            : '0 2px 6px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04), inset 0 2px 6px rgba(0,0,0,0.5)',
        }}
      >
        {/* 3D Knob */}
        <div
          style={{
            position: 'absolute',
            top: 3,
            left: 3,
            width: 18,
            height: 18,
            borderRadius: '50%',
            background: 'linear-gradient(170deg, #ffffff 0%, #c8c8c8 100%)',
            boxShadow: '0 3px 8px rgba(0,0,0,0.55), 0 1px 3px rgba(0,0,0,0.4), inset 0 -2px 4px rgba(0,0,0,0.12)',
            transform: on ? 'translateX(22px)' : 'translateX(0)',
            transition: 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
            overflow: 'hidden',
          }}
        >
          {/* Glanzpunkt */}
          <div style={{
            position: 'absolute',
            top: 2,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 8,
            height: 4,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.85)',
            filter: 'blur(1px)',
          }} />
        </div>
      </div>

      {/* Glow Dot */}
      <div style={{
        width: 6,
        height: 6,
        borderRadius: '50%',
        flexShrink: 0,
        background: on ? BRAND : '#2a2a2a',
        transition: 'background 0.35s ease, box-shadow 0.35s ease',
        boxShadow: on
          ? '0 0 6px 2px rgba(212,149,43,0.7), 0 0 14px 4px rgba(212,149,43,0.35), 0 0 28px 8px rgba(212,149,43,0.15)'
          : 'none',
        animation: on ? 'glowPulse 2s ease-in-out infinite' : 'none',
      }} />

      {/* Label */}
      <span style={{
        fontSize: 10,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: on ? 'rgba(255,255,255,0.8)' : '#444',
        transition: 'color 0.3s',
      }}>
        {label}
      </span>
    </div>
  )
}

export default function LandingPage({ onStart }) {
  return (
    <div className="h-screen bg-[#0a0a0a] relative overflow-hidden flex flex-col">
      {/* 3D Particle Shape - fullscreen, no visible box */}
      <div className="absolute inset-0 pointer-events-none">
        <AbstractRings />
      </div>

      {/* Top Nav */}
      <nav className="relative z-10 flex items-center justify-between px-8 md:px-16 py-6">
        <div className="flex items-center gap-1.5">
          <span className="text-lg font-semibold tracking-widest" style={{ color: BRAND }}>
            METIS AI
          </span>
          <span
            className="inline-block w-2 h-2 rounded-full"
            style={{ backgroundColor: BRAND }}
          />
        </div>

        <button
          onClick={onStart}
          className="text-sm px-5 py-2 rounded-full cursor-pointer transition-all duration-200 font-medium"
          style={{
            color: '#fff',
            backgroundColor: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.15)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.14)'
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'
          }}
        >
          Dashboard
        </button>
      </nav>

      {/* Hero */}
      <div className="flex-1 relative z-10 flex flex-col items-center justify-center px-6">
        {/* Headline */}
        <h1 className="text-center leading-[1.1] mb-5">
          <span
            className="block text-5xl md:text-7xl font-bold text-white tracking-tight"
            style={{ textShadow: '0 2px 20px rgba(0,0,0,0.8)' }}
          >
            Finden.
          </span>
          <span
            className="block text-5xl md:text-7xl font-bold text-white tracking-tight"
            style={{ textShadow: '0 2px 20px rgba(0,0,0,0.8)' }}
          >
            Analysieren.
          </span>
          <span
            className="block text-5xl md:text-7xl font-bold tracking-tight"
            style={{ color: BRAND, textShadow: '0 2px 20px rgba(0,0,0,0.8)' }}
          >
            Erstellen.
          </span>
        </h1>

        {/* Subtitle */}
        <p
          className="text-base md:text-lg mb-8 text-center max-w-lg leading-relaxed"
          style={{
            color: 'rgba(255,255,255,0.85)',
            textShadow: '0 1px 16px rgba(0,0,0,1), 0 2px 32px rgba(0,0,0,0.9)',
            background: 'rgba(0,0,0,0.25)',
            borderRadius: 8,
            padding: '8px 16px',
            backdropFilter: 'blur(4px)',
          }}
        >
          KI-gestützte Suche nach Top-Beiträgen, Analyse von Erfolgsmustern
          und Erstellung eigener Artikel.
        </p>

        {/* CTA Button */}
        <button
          onClick={onStart}
          className="group flex items-center gap-2.5 px-9 py-4 rounded-full cursor-pointer transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] text-base font-semibold tracking-wide"
          style={{
            color: '#0a0a0a',
            backgroundColor: '#fff',
            boxShadow: '0 0 40px rgba(255,255,255,0.08)',
          }}
        >
          Jetzt starten
          <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </button>

        {/* Platform Switches */}
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-4 mt-12">
          <PlatformSwitch label="LinkedIn" defaultOn={true} />
          <PlatformSwitch label="YouTube" />
          <PlatformSwitch label="Twitter / X" />
        </div>
      </div>

      <style>{`
        @keyframes glowPulse {
          0%, 100% { box-shadow: 0 0 6px 2px rgba(212,149,43,0.7), 0 0 14px 4px rgba(212,149,43,0.35), 0 0 28px 8px rgba(212,149,43,0.15); }
          50%       { box-shadow: 0 0 8px 3px rgba(212,149,43,0.9), 0 0 20px 6px rgba(212,149,43,0.5),  0 0 40px 12px rgba(212,149,43,0.2); }
        }
      `}</style>
    </div>
  )
}
