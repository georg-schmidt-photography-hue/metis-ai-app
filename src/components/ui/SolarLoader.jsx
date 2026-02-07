import { useEffect } from 'react'

const planets = [
  { name: 'Mercury', color: 'from-gray-500 to-gray-800', orbit: 2.5, size: 0.3, duration: 2 },
  { name: 'Venus', color: 'from-yellow-400 to-yellow-700', orbit: 3.5, size: 0.4, duration: 3 },
  { name: 'Earth', color: 'from-sky-400 to-blue-900', orbit: 4.5, size: 0.45, duration: 4 },
  { name: 'Mars', color: 'from-red-400 to-red-800', orbit: 5.5, size: 0.4, duration: 5 },
  { name: 'Jupiter', color: 'from-amber-400 to-amber-800', orbit: 7, size: 0.8, duration: 6 },
  { name: 'Saturn', color: 'from-orange-400 to-orange-800', orbit: 8, size: 0.7, duration: 7, ring: true },
  { name: 'Uranus', color: 'from-teal-300 to-cyan-700', orbit: 9, size: 0.6, duration: 8 },
  { name: 'Neptune', color: 'from-blue-500 to-indigo-900', orbit: 10, size: 0.6, duration: 9 },
]

export default function SolarLoader({ size = 40, speed = 1, className = '' }) {
  useEffect(() => {
    if (!document.getElementById('orbit3d-keyframes')) {
      const styleEl = document.createElement('style')
      styleEl.id = 'orbit3d-keyframes'
      styleEl.innerHTML = `
        @keyframes orbit3d {
          0% { transform: rotateX(20deg) rotateY(0deg); }
          100% { transform: rotateX(20deg) rotateY(-360deg); }
        }
        @keyframes tilt {
          0%, 100% { transform: rotateX(10deg) rotateY(0deg); }
          50% { transform: rotateX(-10deg) rotateY(10deg); }
        }
      `
      document.head.appendChild(styleEl)
    }
  }, [])

  return (
    <div
      className={`relative mx-auto flex items-center justify-center ${className}`}
      style={{
        width: `${size * 10}px`,
        height: `${size * 10}px`,
        perspective: '1200px',
      }}
    >
      <div
        className="relative animate-[tilt_10s_infinite_linear]"
        style={{ width: '100%', height: '100%', transformStyle: 'preserve-3d' }}
      >
        {/* Diagonal Axis Line */}
        <div
          className="absolute left-1/2 top-40 bg-gradient-to-r from-neutral-300/70 to-neutral-500/70"
          style={{
            width: `${size * 10}px`,
            height: '1.5px',
            transform: 'translate(-50%, -50%) rotate(38deg)',
            boxShadow: '0 0 8px rgba(255,255,255,0.3)',
            zIndex: 0,
          }}
        />

        {/* Sun */}
        <div
          className="absolute flex items-center justify-center rounded-full shadow-lg bg-gradient-to-br from-yellow-300 to-orange-500"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            boxShadow: '0 0 40px rgba(255, 200, 0, 0.7), inset 0 0 15px rgba(255,255,255,0.5)',
            transform: 'translateZ(30px)',
            zIndex: 10,
          }}
        />

        {/* Planets + Orbits */}
        {planets.map((planet, i) => (
          <div
            key={i}
            className="absolute rounded-full border border-neutral-300/30"
            style={{
              width: `${planet.orbit * size}px`,
              height: `${planet.orbit * size}px`,
              animation: `orbit3d ${planet.duration / speed}s linear infinite`,
              transformStyle: 'preserve-3d',
              transform: `rotateX(20deg) translateZ(${(i % 2 === 0 ? 1 : -1) * 25}px)`,
            }}
          >
            <div
              className={`absolute rounded-full bg-gradient-to-br ${planet.color} shadow-inner`}
              style={{
                width: `${planet.size * size}px`,
                height: `${planet.size * size}px`,
                top: '50%',
                left: '100%',
                transform: 'translate(-50%, -50%) rotateX(15deg)',
                boxShadow: 'inset -6px -6px 12px rgba(0,0,0,0.6), inset 4px 4px 8px rgba(255,255,255,0.2)',
              }}
            >
              <div
                className="absolute rounded-full bg-white/40 blur-[2px]"
                style={{
                  width: `${planet.size * size * 0.3}px`,
                  height: `${planet.size * size * 0.3}px`,
                  top: '25%',
                  left: '25%',
                  opacity: 0.6,
                }}
              />
              {planet.ring && (
                <div
                  className="absolute bg-gradient-to-r from-neutral-300 to-neutral-500 opacity-80"
                  style={{
                    width: `${planet.size * size * 2}px`,
                    height: '1.5px',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%) rotate(25deg)',
                  }}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
