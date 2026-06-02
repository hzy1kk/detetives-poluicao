import { motion } from 'framer-motion'

type Props = {
  selected?: boolean
  highlight?: boolean
  hideRadio?: boolean
  status?: 'correct' | 'wrong'
  disabled?: boolean
  onClick: () => void
  children: React.ReactNode
}

export function QuizOption({
  selected,
  highlight,
  hideRadio = false,
  status,
  disabled,
  onClick,
  children,
}: Props) {
  const statusClass =
    status === 'correct' ? ' quiz-option--correct' : status === 'wrong' ? ' quiz-option--wrong' : ''

  return (
    <motion.button
      type="button"
      className={`quiz-option${selected ? ' quiz-option--selected' : ''}${highlight ? ' quiz-option--highlight' : ''}${statusClass}${hideRadio ? ' quiz-option--no-radio' : ''}`}
      onClick={onClick}
      disabled={disabled}
      whileTap={disabled ? undefined : { scale: 0.97 }}
    >
      {!hideRadio && <span className="quiz-option__radio" aria-hidden />}
      <span className="quiz-option__content">{children}</span>
    </motion.button>
  )
}
