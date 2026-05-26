import { useState } from 'react'
import { CASES } from '../data/cases'
import { TOPIC_LABELS, SCHOOL } from '../data/config'
import {
  clearReports,
  decodeReportCode,
  downloadCsv,
  downloadJson,
  importReports,
  loadReports,
  loadTeacherSettings,
  saveTeacherSettings,
} from '../lib/storage'
import { formatTime } from '../lib/gameEngine'
import type { Difficulty, TeacherSettings, Topic } from '../types'
import { playClick } from '../lib/audio'

type Props = {
  onBack: () => void
}

const ALL_TOPICS: Topic[] = [
  'ph',
  'metais',
  'plasticos',
  'reacoes',
  'agua_solo',
  'reciclagem',
  'sustentabilidade',
]

export function TeacherScreen({ onBack }: Props) {
  const [pin, setPin] = useState('')
  const [authed, setAuthed] = useState(false)
  const [settings, setSettings] = useState<TeacherSettings>(loadTeacherSettings())
  const [importCode, setImportCode] = useState('')
  const [msg, setMsg] = useState('')
  const [reports, setReports] = useState(loadReports())

  function login(e: React.FormEvent) {
    e.preventDefault()
    if (pin === settings.pin) {
      setAuthed(true)
      setMsg('')
    } else {
      setMsg('PIN incorreto.')
    }
  }

  function refresh() {
    setReports(loadReports())
  }

  function toggleTopic(t: Topic) {
    const has = settings.temasAtivos.includes(t)
    const temasAtivos = has
      ? settings.temasAtivos.filter((x) => x !== t)
      : [...settings.temasAtivos, t]
    const next = { ...settings, temasAtivos }
    setSettings(next)
    saveTeacherSettings(next)
  }

  function saveDiff(d: Difficulty) {
    const next = { ...settings, dificuldadePadrao: d }
    setSettings(next)
    saveTeacherSettings(next)
  }

  function importar() {
    try {
      const decoded = decodeReportCode(importCode)
      if (decoded) {
        importReports(JSON.stringify(decoded))
        setMsg('Relatório importado.')
      } else {
        importReports(importCode)
        setMsg('JSON importado.')
      }
      setImportCode('')
      refresh()
    } catch {
      setMsg('Código/JSON inválido.')
    }
  }

  function exportarCsv() {
    const rows = [
      [
        'Aluno',
        'Turma',
        'Caso',
        'Dificuldade',
        'Tempo',
        'Pontos',
        'Estrelas',
        'Correto',
        'Dicas',
        'Data',
      ],
      ...reports.map((r) => [
        r.aluno,
        r.turma,
        r.casoNome,
        r.dificuldade,
        formatTime(r.tempoSegundos),
        String(r.pontuacao),
        String(r.estrelas),
        r.correto ? 'Sim' : 'Não',
        String(r.dicasUsadas),
        new Date(r.dataISO).toLocaleString('pt-BR'),
      ]),
    ]
    downloadCsv(rows, 'relatorios-turma-tt.csv')
  }

  if (!authed) {
    return (
      <section className="card">
        <h2>Área da {SCHOOL.professora}</h2>
        <form onSubmit={login} className="grid">
          <label>
            PIN
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="detetive"
            />
          </label>
          {msg && <p className="erro">{msg}</p>}
          <button type="submit">Entrar</button>
        </form>
        <button type="button" className="btn-link" onClick={onBack}>
          Voltar
        </button>
      </section>
    )
  }

  const media =
    reports.length > 0
      ? Math.round(reports.reduce((a, r) => a + r.pontuacao, 0) / reports.length)
      : 0

  return (
    <section className="card teacher-card">
      <h2>Painel da Profª Maria</h2>
      <p>
        Turma {SCHOOL.turma} · {reports.length} relatório(s) · Média {media} pts
      </p>

      <h3>Configuração da aula</h3>
      <label>
        Dificuldade padrão
        <select
          value={settings.dificuldadePadrao}
          onChange={(e) => saveDiff(e.target.value as Difficulty)}
        >
          <option value="facil">Fácil</option>
          <option value="medio">Médio</option>
          <option value="dificil">Difícil</option>
        </select>
      </label>
      <div className="topic-grid">
        {ALL_TOPICS.map((t) => (
          <label key={t} className="chip">
            <input
              type="checkbox"
              checked={settings.temasAtivos.includes(t)}
              onChange={() => toggleTopic(t)}
            />
            {TOPIC_LABELS[t]}
          </label>
        ))}
      </div>

      <h3>Importar relatório do aluno</h3>
      <textarea
        value={importCode}
        onChange={(e) => setImportCode(e.target.value)}
        placeholder="Cole o código ou JSON aqui"
        rows={4}
      />
      <div className="acoes">
        <button type="button" onClick={importar}>
          Importar
        </button>
        <button type="button" onClick={exportarCsv}>
          Exportar CSV da turma
        </button>
        <button type="button" onClick={() => downloadJson(reports, 'todos-relatorios.json')}>
          Baixar todos JSON
        </button>
        <button
          type="button"
          className="danger"
          onClick={() => {
            if (confirm('Apagar todos os relatórios deste navegador?')) {
              clearReports()
              refresh()
            }
          }}
        >
          Limpar dados
        </button>
      </div>
      {msg && <p className="ok-msg">{msg}</p>}

      <h3>Gabaritos dos {CASES.length} casos</h3>
      <ul className="gabaritos">
        {CASES.map((c) => (
          <li key={c.id}>
            <strong>{c.emoji} {c.nome}</strong> — {c.gabarito.suspeito} / {c.gabarito.descarte}
          </li>
        ))}
      </ul>

      <h3>Relatórios</h3>
      {reports.length === 0 ? (
        <p>Nenhum relatório ainda. Peça aos alunos para exportar após jogar.</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Aluno</th>
                <th>Caso</th>
                <th>Pontos</th>
                <th>Tempo</th>
                <th>OK</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r) => (
                <tr key={r.id}>
                  <td>{r.aluno}</td>
                  <td>{r.casoNome}</td>
                  <td>{r.pontuacao}</td>
                  <td>{formatTime(r.tempoSegundos)}</td>
                  <td>{r.correto ? '✓' : '✗'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p>
        <a href="/manual-professor.html" target="_blank" rel="noreferrer">
          Abrir manual da professora (PDF via impressão)
        </a>
      </p>
      <button type="button" className="btn-link" onClick={() => { playClick(); onBack() }}>
        Voltar ao menu
      </button>
    </section>
  )
}
