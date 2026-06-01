import { useState } from 'react'
import { motion } from 'framer-motion'
import { SCHOOL } from '../data/config'
import { ensureStudentAccountsSeeded } from '../lib/accounts'
import type { Difficulty, StudentAccount } from '../types'
import { playClick } from '../lib/audio'
import { CreditsFooter } from './CreditsFooter'

type Props = {
  onLogin: (account: StudentAccount, dificuldade: Difficulty) => void
  onTeacherAccess: () => void
  defaultDifficulty: Difficulty
}

const DIFF_LABELS: Record<Difficulty, string> = {
  facil: 'EASY',
  medio: 'NORMAL',
  dificil: 'HARD',
}

export function LoginScreen({ onLogin, onTeacherAccess, defaultDifficulty }: Props) {
  const [usuario, setUsuario] = useState('')
  const [dificuldade, setDificuldade] = useState<Difficulty>(defaultDifficulty)
  const [erro, setErro] = useState('')

  ensureStudentAccountsSeeded()

  function submit(e: React.FormEvent) {
    e.preventDefault()
    playClick()
    setErro('')
    if (!usuario.trim()) {
      setErro('DIGITE SEU USUARIO.')
      return
    }
    const login = usuario.trim().toLowerCase()
    const nome = usuario.trim()
    const account: StudentAccount = {
      id: login,
      login,
      nome,
      turma: 'AALG',
      passwordHash: '',
      ativo: true,
      criadoEm: new Date().toISOString(),
    }
    onLogin(account, dificuldade)
  }

  return (
    <div className="quiz-shell quiz-shell--no-nav bit-menu-screen">
      <div className="bit-menu-card bit-box bit-box--blue" style={{ width: '100%' }}>
        <p className="bit-subtitle retro">Press Start</p>
        <h1 className="bit-title retro">DETETIVES</h1>
        <h1 className="bit-title retro" style={{ fontSize: '0.65rem', marginTop: '0.35rem' }}>
          DA POLUICAO
        </h1>
        <p className="bit-tagline">Digite seu usuario para comecar.</p>

        <form onSubmit={submit} className="grid" style={{ textAlign: 'left' }}>
          <label style={{ display: 'block', marginBottom: '1rem' }}>
            <span className="retro" style={{ fontSize: '0.45rem', display: 'block', marginBottom: '0.5rem' }}>
              PLAYER NAME
            </span>
            <input
              className="quiz-input retro"
              style={{ fontSize: '1.25rem' }}
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              autoComplete="username"
              placeholder="maria.silva"
            />
          </label>

          <p className="retro" style={{ fontSize: '0.45rem', margin: '0 0 0.5rem' }}>
            DIFFICULTY
          </p>
          <div className="bit-menu-list" style={{ marginBottom: '1rem' }}>
            {(['facil', 'medio', 'dificil'] as const).map((d) => (
              <button
                key={d}
                type="button"
                className={`bit-menu-item retro${dificuldade === d ? ' bit-menu-item--active' : ''}`}
                onClick={() => {
                  playClick()
                  setDificuldade(d)
                }}
              >
                {DIFF_LABELS[d]}
              </button>
            ))}
          </div>

          {erro && <p className="erro quiz-erro retro" style={{ fontSize: '0.5rem' }}>{erro}</p>}

          <motion.button type="submit" className="quiz-btn-primary bit-btn bit-btn--green retro" style={{ width: '100%' }} whileTap={{ scale: 0.98 }}>
            ▶ START
          </motion.button>
        </form>
      </div>

      <button type="button" className="quiz-btn-ghost retro" onClick={onTeacherAccess}>
        TEACHER LOGIN
      </button>
      <p className="bit-tagline" style={{ marginTop: '0.5rem', fontSize: '1rem' }}>
        {SCHOOL.nome}
      </p>
      <CreditsFooter />
    </div>
  )
}
