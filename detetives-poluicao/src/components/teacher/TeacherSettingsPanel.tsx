import { useState } from 'react'
import { TOPIC_LABELS } from '../../data/config'
import { playClick } from '../../lib/audio'
import { loadTeacherSettings, saveTeacherSettings } from '../../lib/storage'
import type { Difficulty, Topic } from '../../types'

const ALL_TOPICS = Object.keys(TOPIC_LABELS) as Topic[]

export function TeacherSettingsPanel() {
  const [settings, setSettings] = useState(() => loadTeacherSettings())
  const [msg, setMsg] = useState('')

  function toggleTopic(t: Topic) {
    playClick()
    const next = settings.temasAtivos.includes(t)
      ? settings.temasAtivos.filter((x) => x !== t)
      : [...settings.temasAtivos, t]
    const updated = { ...settings, temasAtivos: next.length ? next : ALL_TOPICS }
    setSettings(updated)
  }

  function save() {
    playClick()
    saveTeacherSettings(settings)
    setMsg('Configuracoes salvas para esta turma.')
    setTimeout(() => setMsg(''), 3000)
  }

  return (
    <div className="saas-accounts bit-box" style={{ margin: '0 1rem 1rem' }}>
      <h3 className="retro">CONFIG DA TURMA</h3>
      <p style={{ fontSize: '0.95rem', color: 'var(--8bit-muted)', margin: '0 0 0.75rem' }}>
        Temas ativos no sorteio de casos e dificuldade padrao no login.
      </p>

      <label className="saas-accounts-form" style={{ display: 'block', marginBottom: '0.75rem' }}>
        <span className="retro">Dificuldade padrao</span>
        <select
          value={settings.dificuldadePadrao}
          onChange={(e) => {
            playClick()
            setSettings({ ...settings, dificuldadePadrao: e.target.value as Difficulty })
          }}
        >
          <option value="facil">Facil</option>
          <option value="medio">Medio</option>
          <option value="dificil">Dificil</option>
        </select>
      </label>

      <p className="retro" style={{ fontSize: '0.42rem', margin: '0 0 0.5rem' }}>
        TEMAS ATIVOS
      </p>
      <div className="teacher-topics-grid">
        {ALL_TOPICS.map((t) => (
          <label key={t} className="teacher-topic-chip">
            <input
              type="checkbox"
              checked={settings.temasAtivos.includes(t)}
              onChange={() => toggleTopic(t)}
            />
            {TOPIC_LABELS[t]}
          </label>
        ))}
      </div>

      <button type="button" className="btn-tech-primary" style={{ marginTop: '0.75rem' }} onClick={save}>
        Salvar configuracao
      </button>
      {msg && <p className="ok-msg" style={{ marginTop: '0.5rem' }}>{msg}</p>}
    </div>
  )
}
