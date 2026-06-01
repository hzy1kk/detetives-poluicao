import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

const variants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
}

type Props = {
  children: ReactNode
  screenKey: string
}

export function PageTransition({ children, screenKey }: Props) {
  return (
    <motion.div
      key={screenKey}
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.12, ease: 'linear' }}
      className="page-transition"
    >
      {children}
    </motion.div>
  )
}
