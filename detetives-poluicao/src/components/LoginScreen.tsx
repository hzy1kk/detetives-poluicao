import { useState } from 'react'
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
  facil: 'Fácil',
  medio: 'Médio',
  dificil: 'Difícil',
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
      setErro('Informe seu usuário.')
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
    <div className="quiz-shell quiz-shell--no-nav">
      <h1 className="quiz-page-title">Detetives da Poluição</h1>
      <p className="quiz-page-lead" style={{ marginBottom: '0.9rem' }}>
        Acesso rápido sem senha.
      </p>

      <div className="quiz-card">
        <p className="quiz-page-lead" style={{ marginBottom: '1rem' }}>
          Digite apenas seu usuário para iniciar.
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
          <button type="submit" className="quiz-btn-primary" style={{ width: '100%' }}>
            Iniciar missão
          </button>
        </form>
      </div>
      <button type="button" className="quiz-btn-ghost" style={{ marginTop: '0.25rem' }} onClick={onTeacherAccess}>
        Acesso da professora
      </button>
      <p style={{ fontSize: '0.75rem', color: 'var(--quiz-text-muted)', marginTop: '0.5rem' }}>
        {SCHOOL.nome}
      </p>
      <CreditsFooter />
    </div>
  )
}
