import { motion } from 'framer-motion'

type Props = {
  selected?: boolean
  highlight?: boolean
  onClick: () => void
  children: React.ReactNode
}

export function QuizOption({ selected, highlight, onClick, children }: Props) {
  return (
    <motion.button
      type="button"
      className={`quiz-option${selected ? ' quiz-option--selected' : ''}${highlight ? ' quiz-option--highlight' : ''}`}
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
    >
      <span className="quiz-option__radio" aria-hidden />
      <span>{children}</span>
    </motion.button>
  )
}
