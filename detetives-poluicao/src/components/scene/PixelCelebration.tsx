import { motion } from 'framer-motion'
import type { PerformanceTier } from '../../types'

const TIER_CONFIG: Record<
  PerformanceTier,
  { title: string; subtitle: string; emoji: string }
> = {
  excelente: {
    title: 'NOTA PERFEITA!',
    subtitle: 'Poluente e descarte corretos — sem dicas',
    emoji: '🏆',
  },
  bom: {
    title: 'CASO RESOLVIDO!',
    subtitle: 'Boa investigacao quimica',
    emoji: '⭐',
  },
  parcial: {
    title: 'MEIO CAMINHO',
    subtitle: 'Revise pistas e laboratorio',
    emoji: '🔍',
  },
  reforco: {
    title: 'TENTE DE NOVO',
    subtitle: 'Use o lab antes do veredito',
    emoji: '💾',
  },
}

type Props = {
  tier: PerformanceTier
  notaTotal: number
  onContinue: () => void
}

export function PixelCelebration({ tier, notaTotal, onContinue }: Props) {
  const cfg = TIER_CONFIG[tier]

  return (
    <motion.div
      className="celebration-overlay pixel-celebration"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      aria-labelledby="pixel-celeb-title"
    >
      <div className="pixel-celebration__trophy" aria-hidden>
        {cfg.emoji}
      </div>
      <div className="celebration-text">
        <p className="celebration-tier-badge retro">SCORE {notaTotal}/100</p>
        <h2 id="pixel-celeb-title" className={`celebration-title celebration-title--${tier} retro`}>
          {cfg.title}
        </h2>
        <p className="celebration-subtitle">{cfg.subtitle}</p>
        <motion.button
          type="button"
          className="quiz-btn-primary bit-btn bit-btn--green retro"
          onClick={onContinue}
          whileTap={{ scale: 0.98 }}
          style={{ marginTop: '1rem' }}
        >
          CONTINUAR &gt;&gt;
        </motion.button>
      </div>
    </motion.div>
  )
}
