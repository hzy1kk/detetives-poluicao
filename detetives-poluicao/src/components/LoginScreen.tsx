import { useState } from 'react'
import { motion } from 'framer-motion'
import { SCHOOL, TEAM_PASSWORD, TURMA_PADRAO } from '../data/config'
import type { Difficulty } from '../types'
import { playClick } from '../lib/audio'
import { CreditsFooter } from './CreditsFooter'

type Props = {
  onLogin: (nome: string, turma: string, dificuldade: Difficulty) => void
  onTeacherAccess: () => void
  defaultDifficulty: Difficulty
}

const DIFF_LABELS: Record<Difficulty, string> = {
  facil: 'Fácil',
  medio: 'Médio',
  dificil: 'Difícil',
}

export function LoginScreen({ onLogin, onTeacherAccess, defaultDifficulty }: Props) {
  const [nome, setNome] = useState('')
  const [senha, setSenha] = useState('')
  const [dificuldade, setDificuldade] = useState<Difficulty>(defaultDifficulty)
  const [erro, setErro] = useState('')

  function submit(e: React.FormEvent) {
    e.preventDefault()
    playClick()
    if (!nome.trim()) {
      setErro('Informe seu nome completo.')
      return
    }
    if (senha !== TEAM_PASSWORD) {
      setErro('Senha incorreta.')
      return
    }
    setErro('')
    onLogin(nome.trim(), TURMA_PADRAO, dificuldade)
  }

  return (
    <motion.div
      className="login-shell"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
    >
      <aside className="login-brand">
        <img src="/logo-escola.png" alt="" className="login-brand__logo" />
        <span className="login-brand__badge">Lab 3D · Investigação</span>
        <h2>Detetives da Poluição</h2>
        <p>
          Investigue casos reais de contaminação, use o laboratório virtual e descubra a solução
          correta para proteger o meio ambiente.
        </p>
        <p style={{ fontSize: '0.82rem', opacity: 0.85 }}>
          {SCHOOL.nome} · {SCHOOL.disciplina}
        </p>
      </aside>

      <div className="login-form-panel">
        <h3>Entrar</h3>
        <p className="lead">Preencha seus dados para iniciar a missão (~15 min).</p>

        <form onSubmit={submit} className="grid">
          <label>
            Nome completo
            <input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              autoComplete="name"
              placeholder="Ex.: Maria Silva"
            />
          </label>

          <div>
            <span className="sr-only">Nível</span>
            <p style={{ margin: '0 0 0.4rem', fontWeight: 600, fontSize: '0.85rem' }}>Nível do caso</p>
            <div className="difficulty-pills difficulty-pills--inst" role="group" aria-label="Dificuldade">
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
          </div>

          <label>
            Senha de acesso
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Senha fornecida em sala"
            />
          </label>

          {erro && <p className="erro">{erro}</p>}

          <motion.button
            type="submit"
            className="btn-tech-primary"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            Iniciar missão
          </motion.button>
        </form>

        <button
          type="button"
          className="btn-link"
          onClick={() => {
            playClick()
            onTeacherAccess()
          }}
        >
          Acesso da professora
        </button>

        <CreditsFooter />
      </div>
    </motion.div>
  )
}
