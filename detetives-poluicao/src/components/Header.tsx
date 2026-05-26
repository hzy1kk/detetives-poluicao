import { motion } from 'framer-motion'
import { SCHOOL } from '../data/config'

type Props = {
  compact?: boolean
  premium?: boolean
}

export function Header({ compact, premium }: Props) {
  return (
    <motion.header
      className={`topo ${premium ? 'topo--premium' : ''}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <img src="/logo-escola.png" alt={`Logo ${SCHOOL.nome}`} className="logo" />
      <div>
        {premium && <span className="badge-turma">Turma {SCHOOL.turma}</span>}
        <p className="kicker">
          {SCHOOL.disciplina} · {SCHOOL.serie}
          {!premium && ` · Turma ${SCHOOL.turma}`}
        </p>
        <h1>Detetives da Poluição</h1>
        {!compact && (
          <p className="sub">
            {SCHOOL.professora} · {SCHOOL.nome} · {SCHOOL.cidade}
          </p>
        )}
      </div>
    </motion.header>
  )
}
