import { motion } from 'framer-motion'

type Props = {
  selected?: boolean
  onClick: () => void
  children: React.ReactNode
}

export function QuizOption({ selected, onClick, children }: Props) {
  return (
    <motion.button
      type="button"
      className={`quiz-option${selected ? ' quiz-option--selected' : ''}`}
      onClick={onClick}
      whileTap={{ scale: 0.99 }}
    >
      <span className="quiz-option__radio" aria-hidden />
      <span>{children}</span>
    </motion.button>
  )
}
