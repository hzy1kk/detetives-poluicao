import { useState } from 'react'
import { motion } from 'framer-motion'
import { AUTHORS, TEAM_PASSWORD, TURMA_PADRAO } from '../data/config'
import type { Difficulty } from '../types'
import { playClick } from '../lib/audio'
import { AnimatedPanel, StaggerItem } from './ui/AnimatedPanel'

type Props = {
  onLogin: (nome: string, turma: string, dificuldade: Difficulty) => void
  onTeacherAccess: () => void
  defaultDifficulty: Difficulty
}

const DIFF_LABELS: Record<Difficulty, string> = {
  facil: 'Fácil · 4 pistas',
  medio: 'Médio · 5 pistas',
  dificil: 'Difícil · 6 pistas',
}

export function LoginScreen({ onLogin, onTeacherAccess, defaultDifficulty }: Props) {
  const [nome, setNome] = useState('')
  const [turma] = useState(TURMA_PADRAO)
  const [senha, setSenha] = useState('')
  const [dificuldade, setDificuldade] = useState<Difficulty>(defaultDifficulty)
  const [erro, setErro] = useState('')

  function submit(e: React.FormEvent) {
    e.preventDefault()
    playClick()
    if (!nome.trim()) {
      setErro('Informe seu nome.')
      return
    }
    if (senha !== TEAM_PASSWORD) {
      setErro('Senha da turma incorreta. Dica: palavra do jogo.')
      return
    }
    setErro('')
    onLogin(nome.trim(), turma, dificuldade)
  }

  return (
    <div className="login-stage">
      <AnimatedPanel className="login-glass card">
        <span className="login-tag-4d">Lab 3D · Fusão cromática · Tempo real</span>
        <div className="login-hero-icon">
          <motion.span
            animate={{ rotate: [0, 8, -8, 0], scale: [1, 1.08, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            🔬🌊🧪
          </motion.span>
        </div>
        <h2>Entrar na investigação</h2>
        <p className="lead">
          Ambiente imersivo 3D · Casos de poluição · Turma <strong>AALG</strong> · ~10 min por missão
        </p>

        <form onSubmit={submit} className="grid">
          <StaggerItem index={0}>
            <label>
              Nome completo
              <input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                autoComplete="name"
                placeholder="Seu nome"
              />
            </label>
          </StaggerItem>

          <StaggerItem index={1}>
            <label>
              Turma
              <div className="turma-badge-field">
                <input value={turma} readOnly aria-readonly />
              </div>
            </label>
          </StaggerItem>

          <StaggerItem index={2}>
            <span className="sr-only">Nível do caso</span>
            <p style={{ margin: '0 0 0.35rem', fontWeight: 700, fontSize: '0.88rem' }}>Nível do caso</p>
            <div className="difficulty-pills" role="group" aria-label="Dificuldade">
              {(['facil', 'medio', 'dificil'] as const).map((d) => (
                <button
                  key={d}
                  type="button"
                  className={dificuldade === d ? 'active' : ''}
                  onClick={() => {
                    playClick()
                    setDificuldade(d)
                  }}
                >
                  {DIFF_LABELS[d]}
                </button>
              ))}
            </div>
          </StaggerItem>

          <StaggerItem index={3}>
            <label>
              Senha da turma
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="••••••••"
              />
            </label>
          </StaggerItem>

          {erro && (
            <motion.p
              className="erro"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
            >
              {erro}
            </motion.p>
          )}

          <StaggerItem index={4}>
            <motion.button
              type="submit"
              className="btn-fusion btn-block"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Iniciar missão 3D
            </motion.button>
          </StaggerItem>
        </form>

        <button
          type="button"
          className="btn-link"
          onClick={() => {
            playClick()
            onTeacherAccess()
          }}
        >
          Acesso professor (PIN)
        </button>

        <footer className="creditos-mini">
          <strong>Equipe:</strong>{' '}
          {AUTHORS.map((a) => (
            <span key={a.nome} className={a.destaque ? 'destaque' : ''}>
              {a.nome}
              {a.destaque ? ' ★' : ''}
              {' · '}
            </span>
          ))}
        </footer>
      </AnimatedPanel>
    </div>
  )
}
