import { motion } from 'framer-motion'
import { SCHOOL } from '../data/config'

type Props = {
  compact?: boolean
  premium?: boolean
}

export function Header({ compact, premium }: Props) {
  return (
    <motion.header
      className={`topo ${premium ? 'topo--tech' : ''}`}
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <img src="/logo-escola.png" alt={`Logo ${SCHOOL.nome}`} className="logo" />
      <div>
        <p className="kicker">{SCHOOL.disciplina} · {SCHOOL.serie}</p>
        <h1>Detetives da Poluição</h1>
        {!compact && (
          <p className="sub">
            {SCHOOL.professora} · {SCHOOL.nome}
          </p>
        )}
      </div>
    </motion.header>
  )
}
