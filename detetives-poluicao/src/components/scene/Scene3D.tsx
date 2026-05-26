import { Suspense, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial } from '@react-three/drei'
import type { Mesh, Points } from 'three'
import * as THREE from 'three'

const FUSION = ['#00f5d4', '#7b2ff7', '#f72585', '#4cc9f0', '#fee440', '#06d6a0']

function FusionCore() {
  const ref = useRef<Mesh>(null)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (ref.current) {
      ref.current.rotation.x = t * 0.18
      ref.current.rotation.y = t * 0.32
    }
  })

  return (
    <Float speed={2.2} rotationIntensity={0.7} floatIntensity={1.4}>
      <mesh ref={ref}>
        <icosahedronGeometry args={[1.15, 2]} />
        <MeshDistortMaterial
          color="#0a1628"
          emissive="#7b2ff7"
          emissiveIntensity={0.45}
          distort={0.42}
          speed={2.5}
          roughness={0.08}
          metalness={0.92}
        />
      </mesh>
    </Float>
  )
}

function OrbitAtoms() {
  const group = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = state.clock.elapsedTime * 0.12
      group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.08) * 0.12
    }
  })

  return (
    <group ref={group}>
      {FUSION.slice(0, 4).map((color, i) => {
        const angle = (i / 4) * Math.PI * 2
        const r = 2.6
        return (
          <Float key={color} speed={1.4 + i * 0.25} floatIntensity={0.9}>
            <mesh
              position={[
                Math.cos(angle) * r,
                Math.sin(angle * 1.3) * 0.55,
                Math.sin(angle) * r,
              ]}
            >
              <sphereGeometry args={[0.32, 24, 24]} />
              <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={0.55}
                metalness={0.85}
                roughness={0.12}
              />
            </mesh>
          </Float>
        )
      })}
    </group>
  )
}

function ParticleField({ count }: { count: number }) {
  const ref = useRef<Points>(null)
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 14
      arr[i * 3 + 1] = (Math.random() - 0.5) * 10
      arr[i * 3 + 2] = (Math.random() - 0.5) * 10
    }
    return arr
  }, [count])

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.04
      ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.1) * 0.05
    }
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        color="#4cc9f0"
        transparent
        opacity={0.75}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

function SceneContent({ lite }: { lite: boolean }) {
  return (
    <>
      <ambientLight intensity={0.35} />
      <pointLight position={[6, 4, 5]} intensity={1.4} color="#7b2ff7" />
      <pointLight position={[-5, -3, 4]} intensity={1.1} color="#00f5d4" />
      <pointLight position={[0, -4, 2]} intensity={0.6} color="#f72585" />
      <FusionCore />
      <OrbitAtoms />
      {!lite && <ParticleField count={140} />}
      <fog attach="fog" args={['#030712', 5, 16]} />
    </>
  )
}

function useReducedMotion() {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

type Props = {
  intensity?: 'full' | 'lite'
}

export function Scene3D({ intensity = 'full' }: Props) {
  if (useReducedMotion()) return null

  const lite = intensity === 'lite'
  const isMobile =
    typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches

  return (
    <div className="scene-3d" aria-hidden>
      <Canvas
        camera={{ position: [0, 0.2, 6.2], fov: 48 }}
        dpr={isMobile ? [1, 1.25] : [1, 1.75]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <Suspense fallback={null}>
          <SceneContent lite={lite || isMobile} />
        </Suspense>
      </Canvas>
    </div>
  )
}
