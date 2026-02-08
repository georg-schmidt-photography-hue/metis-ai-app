export default function AbstractRings({ className = '' }) {
  const rings = [
    { size: 280, color: '#D4952B', rotateX: 65, rotateY: 0, duration: 12, delay: 0, width: 2.5 },
    { size: 260, color: '#E8B86D', rotateX: 50, rotateY: 60, duration: 15, delay: -3, width: 2 },
    { size: 300, color: '#C17A1A', rotateX: 75, rotateY: 120, duration: 18, delay: -6, width: 2.5 },
    { size: 240, color: '#F0D0A0', rotateX: 40, rotateY: 180, duration: 14, delay: -2, width: 1.5 },
    { size: 220, color: '#A86B10', rotateX: 55, rotateY: 240, duration: 16, delay: -4, width: 2 },
    { size: 310, color: '#D4952B44', rotateX: 80, rotateY: 300, duration: 20, delay: -8, width: 1.5 },
  ]

  return (
    <div className={`relative ${className}`} style={{ width: 380, height: 380 }}>
      <div
        className="absolute inset-0"
        style={{
          perspective: '800px',
          perspectiveOrigin: '50% 50%',
        }}
      >
        {rings.map((ring, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: ring.size,
              height: ring.size,
              top: '50%',
              left: '50%',
              marginTop: -ring.size / 2,
              marginLeft: -ring.size / 2,
              border: `${ring.width}px solid ${ring.color}`,
              animation: `ring-spin-${i} ${ring.duration}s linear infinite`,
              animationDelay: `${ring.delay}s`,
              transformStyle: 'preserve-3d',
              boxShadow: `0 0 20px ${ring.color}33`,
            }}
          />
        ))}

        {/* Glow center */}
        <div
          className="absolute rounded-full"
          style={{
            width: 80,
            height: 80,
            top: '50%',
            left: '50%',
            marginTop: -40,
            marginLeft: -40,
            background: 'radial-gradient(circle, #D4952B22 0%, transparent 70%)',
            animation: 'glow-pulse 4s ease-in-out infinite',
          }}
        />
      </div>

      <style>{`
        ${rings.map((ring, i) => `
          @keyframes ring-spin-${i} {
            0% {
              transform: rotateX(${ring.rotateX}deg) rotateY(${ring.rotateY}deg) rotateZ(0deg);
            }
            100% {
              transform: rotateX(${ring.rotateX}deg) rotateY(${ring.rotateY}deg) rotateZ(360deg);
            }
          }
        `).join('')}

        @keyframes glow-pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.3); }
        }
      `}</style>
    </div>
  )
}
