import { useState } from 'react'
import { motion } from 'framer-motion'
import { SCHOOL } from '../data/config'
import { authenticateStudent, ensureStudentAccountsSeeded } from '../lib/accounts'
import type { Difficulty, StudentAccount } from '../types'
import { playClick } from '../lib/audio'
import { CreditsFooter } from './CreditsFooter'

type Props = {
  onLogin: (account: StudentAccount, dificuldade: Difficulty) => void
  onTeacherAccess: () => void
  defaultDifficulty: Difficulty
}

const DIFF_LABELS: Record<Difficulty, string> = {
  facil: 'Fácil',
  medio: 'Médio',
  dificil: 'Difícil',
}

export function LoginScreen({ onLogin, onTeacherAccess, defaultDifficulty }: Props) {
  const [showForm, setShowForm] = useState(false)
  const [usuario, setUsuario] = useState('')
  const [senha, setSenha] = useState('')
  const [dificuldade, setDificuldade] = useState<Difficulty>(defaultDifficulty)
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)

  ensureStudentAccountsSeeded()

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    playClick()
    setErro('')
    if (!usuario.trim()) {
      setErro('Informe seu usuário.')
      return
    }
    if (!senha) {
      setErro('Informe sua senha.')
      return
    }
    setLoading(true)
    try {
      const account = await authenticateStudent(usuario, senha)
      if (!account) {
        setErro('Usuário ou senha incorretos.')
        return
      }
      onLogin(account, dificuldade)
    } finally {
      setLoading(false)
    }
  }

  if (!showForm) {
    return (
      <div className="quiz-splash">
        <motion.div
          className="quiz-splash__hero"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          🌍
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          Detetives da Poluição
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
          Escolha um caso, investigue, use o laboratório e proteja o meio ambiente com Química.
        </motion.p>
        <motion.button
          type="button"
          className="quiz-slide-cta"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          onClick={() => {
            playClick()
            setShowForm(true)
          }}
        >
          <span className="quiz-slide-track">
            <span className="quiz-slide-knob">→</span>
            <span className="quiz-slide-text">Deslize para entrar</span>
          </span>
        </motion.button>
        <button type="button" className="quiz-btn-ghost" style={{ marginTop: '1rem' }} onClick={onTeacherAccess}>
          Acesso da professora
        </button>
        <p style={{ fontSize: '0.75rem', color: 'var(--quiz-text-muted)', marginTop: '1.5rem' }}>
          {SCHOOL.nome}
        </p>
      </div>
    )
  }

  return (
    <div className="quiz-shell quiz-shell--no-nav">
      <div className="quiz-back-row">
        <button type="button" className="quiz-back-btn" onClick={() => setShowForm(false)} aria-label="Voltar">
          ←
        </button>
        <h2 className="quiz-page-title" style={{ margin: 0 }}>
          Entrar
        </h2>
      </div>

      <div className="quiz-card">
        <p className="quiz-page-lead" style={{ marginBottom: '1rem' }}>
          Usuário e senha entregues pela Profª Maria.
        </p>
        <form onSubmit={submit} className="grid">
          <label style={{ display: 'block', marginBottom: '0.85rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Usuário</span>
            <input
              className="quiz-search"
              style={{ marginTop: '0.35rem', width: '100%' }}
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              autoComplete="username"
              placeholder="maria.silva"
            />
          </label>
          <label style={{ display: 'block', marginBottom: '0.85rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Senha</span>
            <input
              className="quiz-search"
              style={{ marginTop: '0.35rem', width: '100%' }}
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              autoComplete="current-password"
              placeholder="••••••••"
            />
          </label>
          <p style={{ fontSize: '0.85rem', fontWeight: 600, margin: '0 0 0.4rem' }}>Nível</p>
          <div className="quiz-tabs" style={{ marginBottom: '1rem' }}>
            {(['facil', 'medio', 'dificil'] as const).map((d) => (
              <button
                key={d}
                type="button"
                className={`quiz-tab${dificuldade === d ? ' quiz-tab--active' : ''}`}
                onClick={() => {
                  playClick()
                  setDificuldade(d)
                }}
              >
                {DIFF_LABELS[d]}
              </button>
            ))}
          </div>
          {erro && <p className="erro quiz-erro">{erro}</p>}
          <button type="submit" className="quiz-btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Verificando…' : 'Iniciar missão'}
          </button>
        </form>
      </div>
      <CreditsFooter />
    </div>
  )
}
