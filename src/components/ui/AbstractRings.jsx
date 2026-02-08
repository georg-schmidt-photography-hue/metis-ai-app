import { Suspense, useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useFBO } from '@react-three/drei'
import * as THREE from 'three'

const simulationMaterial = new THREE.ShaderMaterial({
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    varying vec2 vUv;
    uniform sampler2D uCurrentPosition;
    uniform sampler2D uOriginalPosition;
    uniform float uTime;
    uniform float uCurl;
    uniform float uSpeed;

    vec3 snoise(vec3 uv) {
      uv.x += uTime * 0.01;
      float s = sin(uv.z * 2.1) * 0.2 + cos(uv.y * 3.2) * 0.3 + sin(uv.x * 2.2) * 0.2;
      float c = cos(uv.z * 2.1) * 0.2 + sin(uv.y * 3.2) * 0.3 + cos(uv.x * 2.2) * 0.2;
      float s2 = sin(uv.y * 1.1) * 0.2 + cos(uv.x * 2.2) * 0.3 + sin(uv.z * 1.2) * 0.2;
      float c2 = cos(uv.y * 1.1) * 0.2 + sin(uv.x * 2.2) * 0.3 + cos(uv.z * 1.2) * 0.2;
      return vec3(s, c, s2 * c2) * uCurl;
    }

    void main() {
      vec3 currentPos = texture2D(uCurrentPosition, vUv).xyz;
      vec3 originalPos = texture2D(uOriginalPosition, vUv).xyz;
      vec3 noise = snoise(currentPos * 0.1);
      currentPos += noise * uSpeed;
      // Pull particles back towards original position to prevent drifting
      currentPos = mix(currentPos, originalPos, 0.003);
      gl_FragColor = vec4(currentPos, 1.0);
    }
  `,
  uniforms: {
    uCurrentPosition: { value: null },
    uOriginalPosition: { value: null },
    uTime: { value: 0 },
    uCurl: { value: 1.5 },
    uSpeed: { value: 0.01 },
  },
})

const renderMaterial = new THREE.ShaderMaterial({
  transparent: true,
  depthWrite: false,
  vertexShader: `
    uniform sampler2D uPosition;
    uniform float uTime;
    varying vec3 vColor;

    void main() {
      vec3 pos = texture2D(uPosition, position.xy).xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      gl_PointSize = 2.0;

      vec3 nPos = normalize(pos) * 0.5 + 0.5;
      vec3 gold = vec3(0.831, 0.584, 0.168);
      vec3 amber = vec3(0.906, 0.722, 0.427);
      vec3 deepGold = vec3(0.722, 0.471, 0.102);

      float t = nPos.x * 0.5 + nPos.y * 0.3 + nPos.z * 0.2;
      vColor = mix(deepGold, gold, smoothstep(0.0, 0.5, t));
      vColor = mix(vColor, amber, smoothstep(0.5, 1.0, t));
    }
  `,
  fragmentShader: `
    varying vec3 vColor;
    void main() {
      float d = length(gl_PointCoord - vec2(0.5));
      if (d > 0.5) discard;
      float a = 1.0 - smoothstep(0.3, 0.5, d);
      gl_FragColor = vec4(vColor * 1.3, a);
    }
  `,
  uniforms: {
    uPosition: { value: null },
    uTime: { value: 0 },
  },
})

// Pre-allocate objects used every frame (avoids GC stuttering)
const simScene = new THREE.Scene()
const simCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
const simPlane = new THREE.PlaneGeometry(2, 2)
const simMesh = new THREE.Mesh(simPlane, simulationMaterial)
simScene.add(simMesh)

function ParticleScene() {
  const size = 192
  const pointsRef = useRef()
  const pingPong = useRef(0)
  const { gl } = useThree()

  const fboSettings = {
    type: THREE.FloatType,
    minFilter: THREE.NearestFilter,
    magFilter: THREE.NearestFilter,
  }
  const fbo1 = useFBO(size, size, fboSettings)
  const fbo2 = useFBO(size, size, fboSettings)

  const { originalPositionTexture, particlePositions } = useMemo(() => {
    const particles = new Float32Array(size * size * 4)
    const geometry = new THREE.TorusKnotGeometry(1.2, 0.3, 400, 32)
    const positions = geometry.attributes.position.array

    for (let i = 0; i < size * size; i++) {
      const i4 = i * 4
      const p_i = (i * 3) % positions.length
      particles[i4 + 0] = positions[p_i + 0]
      particles[i4 + 1] = positions[p_i + 1]
      particles[i4 + 2] = positions[p_i + 2]
      particles[i4 + 3] = 1.0
    }

    const originalPositionTexture = new THREE.DataTexture(
      particles,
      size,
      size,
      THREE.RGBAFormat,
      THREE.FloatType
    )
    originalPositionTexture.needsUpdate = true

    const tempScene = new THREE.Scene()
    const tempCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    const tempMaterial = new THREE.MeshBasicMaterial({ map: originalPositionTexture })
    const tempMesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), tempMaterial)
    tempScene.add(tempMesh)

    gl.setRenderTarget(fbo1)
    gl.render(tempScene, tempCamera)
    gl.setRenderTarget(null)

    const particlePositions = new Float32Array(size * size * 3)
    for (let i = 0; i < size * size; i++) {
      const i3 = i * 3
      particlePositions[i3 + 0] = (i % size) / size
      particlePositions[i3 + 1] = Math.floor(i / size) / size
      particlePositions[i3 + 2] = 0
    }

    return { originalPositionTexture, particlePositions }
  }, [size, gl, fbo1])

  useFrame((state) => {
    const { gl, clock } = state
    const current = pingPong.current === 0 ? fbo1 : fbo2
    const target = pingPong.current === 0 ? fbo2 : fbo1

    simulationMaterial.uniforms.uCurrentPosition.value = current.texture
    simulationMaterial.uniforms.uOriginalPosition.value = originalPositionTexture
    simulationMaterial.uniforms.uTime.value = clock.elapsedTime

    gl.setRenderTarget(target)
    gl.render(simScene, simCamera)
    gl.setRenderTarget(null)

    pingPong.current = 1 - pingPong.current

    renderMaterial.uniforms.uPosition.value = target.texture
    renderMaterial.uniforms.uTime.value = clock.elapsedTime

    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.001
      pointsRef.current.rotation.x += 0.0005
    }
  })

  return (
    <points ref={pointsRef} position={[0, 0.8, 0]}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={size * size}
          array={particlePositions}
          itemSize={3}
        />
      </bufferGeometry>
      <primitive object={renderMaterial} attach="material" />
    </points>
  )
}

export default function AbstractRings({ className = '' }) {
  return (
    <div className={className} style={{ width: '100%', height: '100%' }}>
      <Canvas
        camera={{ position: [0, 0, 9], fov: 40 }}
        style={{ background: '#0a0a0a' }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        dpr={1}
      >
        <Suspense fallback={null}>
          <ParticleScene />
        </Suspense>
      </Canvas>
    </div>
  )
}
