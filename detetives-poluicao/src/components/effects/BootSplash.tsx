import { useEffect } from 'react'
import { motion } from 'framer-motion'

type Props = {
  onDone: () => void
}

export function BootSplash({ onDone }: Props) {
  useEffect(() => {
    const t = window.setTimeout(onDone, 2400)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <motion.div
      className="boot-splash quiz-boot"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="boot-splash__inner">
        <motion.img
          src="/logo-escola.png"
          alt=""
          className="boot-splash__logo"
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.h1
          className="retro"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
        >
          LOADING...
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
          className="boot-splash__sub retro"
          style={{ fontSize: '0.5rem' }}
        >
          DETETIVES DA POLUICAO
        </motion.p>
        <div className="boot-splash__bar">
          <motion.div
            className="boot-splash__bar-fill"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 2, ease: 'easeInOut' }}
          />
        </div>
      </div>
    </motion.div>
  )
}
