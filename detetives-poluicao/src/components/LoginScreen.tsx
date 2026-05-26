import { useState } from 'react'
import { AUTHORS, SCHOOL, TEAM_PASSWORD, TURMA_PADRAO } from '../data/config'
import type { Difficulty } from '../types'
import { playClick } from '../lib/audio'

type Props = {
  onLogin: (nome: string, turma: string, dificuldade: Difficulty) => void
  onTeacherAccess: () => void
  defaultDifficulty: Difficulty
}

export function LoginScreen({ onLogin, onTeacherAccess, defaultDifficulty }: Props) {
  const [nome, setNome] = useState('')
  const [turma, setTurma] = useState(TURMA_PADRAO)
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
    onLogin(nome.trim(), turma.toUpperCase(), dificuldade)
  }

  return (
    <section className="card">
      <div className="mascote-banner">🔍🌊🧪</div>
      <h2>Entrar na investigação</h2>
      <p className="lead">
        Você é detetive ambiental da turma {SCHOOL.turma}. Resolva o caso em cerca de 10 minutos.
      </p>
      <form onSubmit={submit} className="grid">
        <label>
          Nome completo
          <input value={nome} onChange={(e) => setNome(e.target.value)} autoComplete="name" />
        </label>
        <label>
          Turma
          <input value={turma} onChange={(e) => setTurma(e.target.value)} />
        </label>
        <label>
          Dificuldade
          <select value={dificuldade} onChange={(e) => setDificuldade(e.target.value as Difficulty)}>
            <option value="facil">Fácil — 4 pistas</option>
            <option value="medio">Médio — 5 pistas</option>
            <option value="dificil">Difícil — 6 pistas</option>
          </select>
        </label>
        <label>
          Senha da turma
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="detetive"
          />
        </label>
        {erro && <p className="erro">{erro}</p>}
        <button type="submit" className="btn-primary">
          Iniciar missão
        </button>
      </form>
      <button type="button" className="btn-link" onClick={() => { playClick(); onTeacherAccess() }}>
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
    </section>
  )
}
