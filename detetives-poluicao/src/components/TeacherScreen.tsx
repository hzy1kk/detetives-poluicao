import { useState } from 'react'
import { CASES } from '../data/cases'
import { GOOGLE_FORMS_URL, SCHOOL } from '../data/config'
import { buildRanking } from '../lib/ranking'
import {
  clearReports,
  downloadCsv,
  loadReports,
  loadTeacherSettings,
} from '../lib/storage'
import { formatTime } from '../lib/gameEngine'
import { playClick } from '../lib/audio'
import { QrAccessPanel } from './QrAccessPanel'

type Props = {
  onBack: () => void
}

export function TeacherScreen({ onBack }: Props) {
  const [pin, setPin] = useState('')
  const [authed, setAuthed] = useState(false)
  const [msg, setMsg] = useState('')
  const settings = loadTeacherSettings()
  const reports = loadReports().filter((r) => !r.modoTreino)
  const ranking = buildRanking(SCHOOL.turma, 15)

  function login(e: React.FormEvent) {
    e.preventDefault()
    if (pin === settings.pin) {
      setAuthed(true)
      setMsg('')
    } else {
      setMsg('PIN incorreto. Use: detetive01')
    }
  }

  function exportarPlanilha() {
    playClick()
    const rows = [
      ['Aluno', 'Turma', 'Nota total', 'Poluente 50%', 'Descarte 50%', 'Caso', 'Tempo', 'Data'],
      ...reports.map((r) => [
        r.aluno,
        r.turma,
        String(r.notaTotal ?? (r.poluenteCorreto ? 50 : 0) + (r.descarteCorreto ? 50 : 0)),
        r.poluenteCorreto ? '50' : '0',
        r.descarteCorreto ? '50' : '0',
        r.casoNome,
        formatTime(r.tempoSegundos),
        new Date(r.dataISO).toLocaleString('pt-BR'),
      ]),
    ]
    downloadCsv(rows, `notas-turma-${SCHOOL.turma}.csv`)
    setMsg('Planilha baixada! Abra no Excel ou Google Planilhas.')
  }

  if (!authed) {
    return (
      <section className="card">
        <h2>Área da {SCHOOL.professora}</h2>
        <p className="lead">PIN simples — sem complicação técnica.</p>
        <form onSubmit={login} className="grid">
          <label>
            PIN
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="detetive01"
            />
          </label>
          {msg && <p className="erro">{msg}</p>}
          <button type="submit" className="btn-primary btn-block">
            Entrar
          </button>
        </form>
        <button type="button" className="btn-link" onClick={onBack}>
          Voltar
        </button>
      </section>
    )
  }

  const mediaNota =
    reports.length > 0
      ? Math.round(
          reports.reduce(
            (a, r) => a + (r.notaTotal ?? (r.poluenteCorreto ? 50 : 0) + (r.descarteCorreto ? 50 : 0)),
            0,
          ) / reports.length,
        )
      : 0

  return (
    <section className="card teacher-card teacher-card--simple">
      <h2>Painel simples — {SCHOOL.professora}</h2>
      <p>
        Turma <strong>{SCHOOL.turma}</strong> · {reports.length} partida(s) neste computador · Média{' '}
        {mediaNota}/100
      </p>

      <QrAccessPanel compact />

      <h3>Passo a passo (25 min de aula)</h3>
      <ol className="tutorial-list">
        <li>Projete o QR — alunos entram com senha <strong>detetive01</strong>.</li>
        <li>~15 min de jogo + ~10 min de explicação com os 3 aprendizados no final.</li>
        <li>Nota mensal: <strong>50% poluente + 50% descarte</strong>.</li>
      </ol>

      <div className="acoes acoes-stack">
        <button type="button" className="btn-fusion btn-block" onClick={exportarPlanilha}>
          Baixar planilha de notas (Excel)
        </button>
        {GOOGLE_FORMS_URL ? (
          <a className="btn-secondary btn-block" href={GOOGLE_FORMS_URL} target="_blank" rel="noreferrer">
            Abrir Google Forms (backup)
          </a>
        ) : (
          <p className="dica">
            Backup: peça à equipe do projeto para vincular o link do Google Forms da turma.
          </p>
        )}
        <button
          type="button"
          className="danger btn-block"
          onClick={() => {
            if (confirm('Apagar relatórios só deste navegador?')) {
              clearReports()
              setMsg('Dados apagados.')
            }
          }}
        >
          Limpar dados deste PC
        </button>
      </div>
      {msg && <p className="ok-msg">{msg}</p>}

      <h3>Ranking (top 15 neste PC)</h3>
      {ranking.length === 0 ? (
        <p>Os alunos jogam e as notas aparecem aqui no computador da sala.</p>
      ) : (
        <ul className="ranking-list-simple">
          {ranking.map((r) => (
            <li key={r.aluno}>
              {r.posicao}. {r.aluno} — <strong>{r.notaTotal}/100</strong>
            </li>
          ))}
        </ul>
      )}

      <h3>Gabaritos rápidos</h3>
      <ul className="gabaritos">
        {CASES.map((c) => (
          <li key={c.id}>
            {c.emoji} {c.nome}: {c.gabarito.suspeito.slice(0, 40)}… / {c.gabarito.descarte.slice(0, 35)}…
          </li>
        ))}
      </ul>

      <button type="button" className="btn-link" onClick={() => { playClick(); onBack() }}>
        Voltar
      </button>
    </section>
  )
}
