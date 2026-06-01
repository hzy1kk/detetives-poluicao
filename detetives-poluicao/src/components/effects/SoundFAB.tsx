import { motion } from 'framer-motion'
import { Volume2, VolumeX, Waves } from 'lucide-react'
import { playClick } from '../../lib/audio'

type Props = {
  soundOn: boolean
  ambientOn: boolean
  onToggleSound: () => void
  onToggleAmbient: () => void
}

export function SoundFAB({ soundOn, ambientOn, onToggleSound, onToggleAmbient }: Props) {
  return (
    <div className="sound-fab-group">
      <motion.button
        type="button"
        className={`sound-fab ${ambientOn ? 'on' : ''}`}
        title={ambientOn ? 'Ambiente ligado' : 'Ambiente desligado'}
        whileTap={{ scale: 0.92 }}
        onClick={() => {
          playClick()
          onToggleAmbient()
        }}
        aria-label="Som ambiente"
        aria-pressed={ambientOn}
      >
        <Waves aria-hidden size={20} strokeWidth={2} />
      </motion.button>
      <motion.button
        type="button"
        className={`sound-fab ${soundOn ? 'on' : ''}`}
        title={soundOn ? 'Efeitos ligados' : 'Efeitos desligados'}
        whileTap={{ scale: 0.92 }}
        onClick={() => {
          if (soundOn) playClick()
          onToggleSound()
        }}
        aria-label="Efeitos sonoros"
        aria-pressed={soundOn}
      >
        {soundOn ? (
          <Volume2 aria-hidden size={20} strokeWidth={2} />
        ) : (
          <VolumeX aria-hidden size={20} strokeWidth={2} />
        )}
      </motion.button>
    </div>
  )
}
