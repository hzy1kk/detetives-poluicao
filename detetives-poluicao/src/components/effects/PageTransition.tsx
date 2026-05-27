import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

const variants = {
  initial: { opacity: 0, y: 20, scale: 0.98, filter: 'blur(4px)' },
  animate: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' },
  exit: { opacity: 0, y: -12, scale: 0.99, filter: 'blur(2px)' },
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
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="page-transition"
    >
      {children}
    </motion.div>
  )
}
