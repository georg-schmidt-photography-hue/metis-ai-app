import { Canvas, useFrame } from '@react-three/fiber'
import { useRef, useMemo } from 'react'
import * as THREE from 'three'

function GlowRing({ color, radius, tubeRadius, rotation, speed, phase }) {
  const ref = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime * speed + phase
    ref.current.rotation.x = rotation[0] + Math.sin(t) * 0.3
    ref.current.rotation.y = rotation[1] + Math.cos(t * 0.7) * 0.4
    ref.current.rotation.z = rotation[2] + Math.sin(t * 0.5) * 0.2
  })

  return (
    <mesh ref={ref}>
      <torusGeometry args={[radius, tubeRadius, 64, 128]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.8}
        metalness={0.3}
        roughness={0.2}
        transparent
        opacity={0.85}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

function IntertwiningRings() {
  const groupRef = useRef()

  useFrame((state) => {
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.08
  })

  const rings = useMemo(() => [
    { color: '#4F46E5', radius: 1.8, tubeRadius: 0.035, rotation: [0, 0, 0], speed: 0.3, phase: 0 },
    { color: '#7C3AED', radius: 1.6, tubeRadius: 0.035, rotation: [Math.PI / 3, Math.PI / 4, 0], speed: 0.25, phase: 1 },
    { color: '#06B6D4', radius: 1.7, tubeRadius: 0.03, rotation: [Math.PI / 2, 0, Math.PI / 6], speed: 0.35, phase: 2 },
    { color: '#10B981', radius: 1.5, tubeRadius: 0.03, rotation: [Math.PI / 5, Math.PI / 2, Math.PI / 3], speed: 0.28, phase: 3 },
    { color: '#F59E0B', radius: 1.9, tubeRadius: 0.03, rotation: [Math.PI / 4, Math.PI / 6, Math.PI / 2], speed: 0.32, phase: 4 },
    { color: '#EF4444', radius: 1.4, tubeRadius: 0.025, rotation: [Math.PI / 2.5, Math.PI / 3, 0], speed: 0.22, phase: 5 },
    { color: '#EC4899', radius: 1.65, tubeRadius: 0.028, rotation: [0, Math.PI / 2, Math.PI / 4], speed: 0.3, phase: 6 },
  ], [])

  return (
    <group ref={groupRef}>
      {rings.map((ring, i) => (
        <GlowRing key={i} {...ring} />
      ))}
    </group>
  )
}

export default function AbstractRings({ className = '' }) {
  return (
    <div className={className} style={{ width: 600, height: 600 }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        style={{ background: 'transparent' }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.15} />
        <pointLight position={[5, 5, 5]} intensity={0.5} color="#ffffff" />
        <pointLight position={[-5, -3, 3]} intensity={0.3} color="#7C3AED" />
        <IntertwiningRings />
      </Canvas>
    </div>
  )
}
