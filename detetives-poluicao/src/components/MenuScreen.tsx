import { AUTHORS } from '../data/config'
import type { StudentProfile } from '../types'
import { playClick } from '../lib/audio'

type Props = {
  profile: StudentProfile
  soundOn: boolean
  fontSize: 'p' | 'm' | 'g'
  onPlay: (treino: boolean) => void
  onTeacher: () => void
  onAbout: () => void
  onHistory: () => void
  onTutorial: () => void
  onToggleSound: () => void
  onFontSize: (s: 'p' | 'm' | 'g') => void
  onLogout: () => void
}

export function MenuScreen({
  profile,
  soundOn,
  fontSize,
  onPlay,
  onTeacher,
  onAbout,
  onHistory,
  onTutorial,
  onToggleSound,
  onFontSize,
  onLogout,
}: Props) {
  return (
    <section className="card">
      <p className="speech-bubble">
        <span className="avatar">🕵️</span>
        <strong>Detetive Lucas:</strong> Olá, {profile.nome}! Pronto para investigar a poluição?
      </p>
      <div className="menu-grid">
        <button type="button" className="menu-tile primary" onClick={() => { playClick(); onPlay(false) }}>
          <span className="tile-icon">🎯</span>
          Nova investigação
          <small>Caso sorteado · valendo nota</small>
        </button>
        <button type="button" className="menu-tile" onClick={() => { playClick(); onPlay(true) }}>
          <span className="tile-icon">📚</span>
          Modo treino
          <small>Sem pressão · revisar conteúdo</small>
        </button>
        <button type="button" className="menu-tile" onClick={() => { playClick(); onHistory() }}>
          <span className="tile-icon">📊</span>
          Meu histórico
        </button>
        <button type="button" className="menu-tile" onClick={() => { playClick(); onTutorial() }}>
          <span className="tile-icon">❓</span>
          Como jogar
        </button>
        <button type="button" className="menu-tile" onClick={() => { playClick(); onAbout() }}>
          <span className="tile-icon">ℹ️</span>
          Sobre o projeto
        </button>
        <button type="button" className="menu-tile" onClick={() => { playClick(); onTeacher() }}>
          <span className="tile-icon">👩‍🏫</span>
          Área da professora
        </button>
      </div>
      <div className="prefs">
        <label className="toggle">
          <input type="checkbox" checked={soundOn} onChange={onToggleSound} />
          Som {soundOn ? 'ligado' : 'desligado'}
        </label>
        <div className="font-btns">
          Fonte:
          {(['p', 'm', 'g'] as const).map((s) => (
            <button
              key={s}
              type="button"
              className={fontSize === s ? 'active' : ''}
              onClick={() => { playClick(); onFontSize(s) }}
            >
              {s.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
      <p className="creditos-mini">
        Idealizado por {AUTHORS.find((a) => a.destaque)?.nome} e equipe · Turma {profile.turma}
      </p>
      <button type="button" className="btn-link" onClick={onLogout}>
        Sair
      </button>
    </section>
  )
}
