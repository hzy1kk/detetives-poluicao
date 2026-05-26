import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial, Stars } from '@react-three/drei'
import { motion } from 'framer-motion'
import type { Mesh } from 'three'
import type { PerformanceTier } from '../../types'

const TIER_CONFIG: Record<
  PerformanceTier,
  {
    title: string
    subtitle: string
    colors: [string, string, string]
    distort: number
    speed: number
    starCount: number
  }
> = {
  excelente: {
    title: 'PARABÉNS, DETETIVE!',
    subtitle: 'Acertou poluente e descarte · Nota máxima',
    colors: ['#fee440', '#00f5d4', '#7b2ff7'],
    distort: 0.35,
    speed: 3,
    starCount: 800,
  },
  bom: {
    title: 'Missão cumprida!',
    subtitle: 'Caso resolvido — ótimo trabalho de Química',
    colors: ['#00f5d4', '#4cc9f0', '#7b2ff7'],
    distort: 0.42,
    speed: 2.5,
    starCount: 500,
  },
  parcial: {
    title: 'Quase lá!',
    subtitle: '50% na nota — revise o item que faltou',
    colors: ['#fee440', '#f72585', '#7b2ff7'],
    distort: 0.5,
    speed: 2,
    starCount: 350,
  },
  reforco: {
    title: 'Continue investigando',
    subtitle: 'Revise pistas e laboratório — você consegue na próxima',
    colors: ['#7b2ff7', '#4cc9f0', '#f72585'],
    distort: 0.55,
    speed: 1.8,
    starCount: 250,
  },
}

function TrophyMesh({ tier }: { tier: PerformanceTier }) {
  const ref = useRef<Mesh>(null)
  const cfg = TIER_CONFIG[tier]

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (ref.current) {
      ref.current.rotation.y = t * 0.5
      ref.current.rotation.x = Math.sin(t * 0.4) * 0.15
    }
  })

  const geometry =
    tier === 'excelente' ? (
      <torusKnotGeometry args={[0.9, 0.28, 128, 24]} />
    ) : tier === 'bom' ? (
      <icosahedronGeometry args={[1.1, 1]} />
    ) : tier === 'parcial' ? (
      <octahedronGeometry args={[1.15, 0]} />
    ) : (
      <dodecahedronGeometry args={[1, 0]} />
    )

  return (
    <Float speed={2} floatIntensity={1.2} rotationIntensity={0.5}>
      <mesh ref={ref}>
        {geometry}
        <MeshDistortMaterial
          color="#0a1628"
          emissive={cfg.colors[0]}
          emissiveIntensity={tier === 'excelente' ? 0.7 : 0.45}
          distort={cfg.distort}
          speed={cfg.speed}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
    </Float>
  )
}

function SceneInner({ tier }: { tier: PerformanceTier }) {
  const cfg = TIER_CONFIG[tier]
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[4, 3, 5]} intensity={1.5} color={cfg.colors[0]} />
      <pointLight position={[-4, -2, 4]} intensity={1.2} color={cfg.colors[1]} />
      <pointLight position={[0, 4, 2]} intensity={0.8} color={cfg.colors[2]} />
      <Stars radius={40} depth={30} count={cfg.starCount} factor={3} fade speed={1} />
      <TrophyMesh tier={tier} />
    </>
  )
}

type Props = {
  tier: PerformanceTier
  notaTotal: number
  onContinue: () => void
}

export function CelebrationScene({ tier, notaTotal, onContinue }: Props) {
  const cfg = TIER_CONFIG[tier]

  return (
    <motion.div
      className="celebration-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="celebration-canvas-wrap">
        <Canvas camera={{ position: [0, 0, 4.5], fov: 50 }} dpr={[1, 1.5]} gl={{ alpha: true }}>
          <Suspense fallback={null}>
            <SceneInner tier={tier} />
          </Suspense>
        </Canvas>
      </div>
      <motion.div
        className="celebration-text"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <p className="celebration-tier-badge">Nota {notaTotal}/100</p>
        <h2 className={`celebration-title celebration-title--${tier}`}>{cfg.title}</h2>
        <p className="celebration-subtitle">{cfg.subtitle}</p>
        <motion.button
          type="button"
          className="btn-fusion"
          onClick={onContinue}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          Ver resultado completo
        </motion.button>
      </motion.div>
    </motion.div>
  )
}
