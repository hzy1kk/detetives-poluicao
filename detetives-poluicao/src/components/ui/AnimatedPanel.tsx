import { motion, type HTMLMotionProps } from 'framer-motion'
import type { ReactNode } from 'react'

type Props = HTMLMotionProps<'section'> & {
  children: ReactNode
  className?: string
  delay?: number
}

export function AnimatedPanel({ children, className = '', delay = 0, ...rest }: Props) {
  return (
    <motion.section
      className={className}
      initial={{ opacity: 0, y: 28, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -16, scale: 0.98 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    >
      {children}
    </motion.section>
  )
}

export function StaggerItem({
  children,
  index = 0,
  className = '',
}: {
  children: ReactNode
  index?: number
  className?: string
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.08 * index, duration: 0.4, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}
