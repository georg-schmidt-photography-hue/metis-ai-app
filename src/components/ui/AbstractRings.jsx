import { Canvas, useFrame } from '@react-three/fiber'
import { useRef, useMemo } from 'react'
import * as THREE from 'three'

function TorusRing({ radius, tube, color, rotationSpeed, initialRotation, emissive }) {
  const ref = useRef()

  useFrame((_, delta) => {
    ref.current.rotation.x += rotationSpeed[0] * delta
    ref.current.rotation.y += rotationSpeed[1] * delta
    ref.current.rotation.z += rotationSpeed[2] * delta
  })

  return (
    <mesh ref={ref} rotation={initialRotation}>
      <torusGeometry args={[radius, tube, 64, 100]} />
      <meshStandardMaterial
        color={color}
        emissive={emissive || color}
        emissiveIntensity={0.15}
        metalness={0.8}
        roughness={0.25}
        transparent
        opacity={0.85}
      />
    </mesh>
  )
}

function Scene() {
  const groupRef = useRef()

  useFrame((_, delta) => {
    groupRef.current.rotation.y += delta * 0.08
  })

  return (
    <group ref={groupRef}>
      <TorusRing
        radius={2.2}
        tube={0.08}
        color="#D4952B"
        emissive="#D4952B"
        rotationSpeed={[0.15, 0.25, 0]}
        initialRotation={[Math.PI / 3, 0, 0]}
      />
      <TorusRing
        radius={2.0}
        tube={0.1}
        color="#E8B86D"
        emissive="#E8B86D"
        rotationSpeed={[-0.1, 0.2, 0.05]}
        initialRotation={[Math.PI / 2.2, Math.PI / 4, 0]}
      />
      <TorusRing
        radius={2.4}
        tube={0.07}
        color="#C17A1A"
        emissive="#C17A1A"
        rotationSpeed={[0.12, -0.18, 0.03]}
        initialRotation={[Math.PI / 4, Math.PI / 3, Math.PI / 6]}
      />
      <TorusRing
        radius={1.8}
        tube={0.12}
        color="#F0D0A0"
        emissive="#D4952B"
        rotationSpeed={[-0.08, 0.15, -0.06]}
        initialRotation={[Math.PI / 2.5, -Math.PI / 5, 0]}
      />
      <TorusRing
        radius={2.6}
        tube={0.06}
        color="#A86B10"
        emissive="#A86B10"
        rotationSpeed={[0.05, 0.1, 0.08]}
        initialRotation={[Math.PI / 1.8, Math.PI / 2, Math.PI / 4]}
      />

      {/* Central glow sphere */}
      <mesh>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial
          color="#D4952B"
          emissive="#D4952B"
          emissiveIntensity={0.5}
          transparent
          opacity={0.3}
        />
      </mesh>
    </group>
  )
}

export default function AbstractRings({ className = '' }) {
  return (
    <div className={className} style={{ width: 500, height: 500 }}>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        style={{ background: 'transparent' }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[5, 5, 5]} intensity={1.2} color="#F0D0A0" />
        <pointLight position={[-5, -3, 3]} intensity={0.6} color="#D4952B" />
        <pointLight position={[0, 0, 5]} intensity={0.4} color="#ffffff" />
        <Scene />
      </Canvas>
    </div>
  )
}
