import { Canvas, useFrame } from '@react-three/fiber'
import { useRef } from 'react'

function GlowingKnot() {
  const ref = useRef()

  useFrame((_, delta) => {
    ref.current.rotation.y += delta * 0.15
    ref.current.rotation.x += delta * 0.05
  })

  return (
    <group ref={ref}>
      {/* Main torusKnot - thick, glossy, organic */}
      <mesh>
        <torusKnotGeometry args={[1.8, 0.45, 256, 64, 2, 3]} />
        <meshPhysicalMaterial
          color="#B8781A"
          emissive="#D4952B"
          emissiveIntensity={0.12}
          metalness={1}
          roughness={0.18}
          clearcoat={0.6}
          clearcoatRoughness={0.1}
          transparent
          opacity={0.9}
          envMapIntensity={1.5}
        />
      </mesh>

      {/* Second knot - slightly different shape, more transparent */}
      <mesh rotation={[Math.PI / 4, Math.PI / 3, 0]}>
        <torusKnotGeometry args={[1.6, 0.3, 200, 48, 3, 2]} />
        <meshPhysicalMaterial
          color="#E8B86D"
          emissive="#D4952B"
          emissiveIntensity={0.08}
          metalness={0.9}
          roughness={0.22}
          clearcoat={0.4}
          clearcoatRoughness={0.15}
          transparent
          opacity={0.5}
        />
      </mesh>

      {/* Inner glow */}
      <mesh>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshBasicMaterial
          color="#D4952B"
          transparent
          opacity={0.04}
        />
      </mesh>
    </group>
  )
}

export default function AbstractRings({ className = '' }) {
  return (
    <div className={className} style={{ width: 600, height: 600 }}>
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 40 }}
        style={{ background: 'transparent' }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.2} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} color="#F5E0C0" />
        <directionalLight position={[-3, -2, 4]} intensity={0.8} color="#D4952B" />
        <pointLight position={[0, 3, 3]} intensity={0.6} color="#ffffff" />
        <GlowingKnot />
      </Canvas>
    </div>
  )
}
