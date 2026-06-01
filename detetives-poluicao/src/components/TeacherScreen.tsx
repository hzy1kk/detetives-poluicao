import { useMemo, useState } from 'react'
import { SCHOOL } from '../data/config'
import {
  clearReports,
  decodeReportCode,
  downloadCsv,
  importReports,
  loadReports,
  loadTeacherSettings,
  normalizeReport,
} from '../lib/storage'
import { formatTime } from '../lib/gameEngine'
import { playClick } from '../lib/audio'
import type { Report } from '../types'
import { QrAccessPanel } from './QrAccessPanel'
import { StudentAccountsPanel } from './teacher/StudentAccountsPanel'
import { TeacherSettingsPanel } from './teacher/TeacherSettingsPanel'

type Props = {
  onBack: () => void
}

function notaOf(r: Report) {
  const n = normalizeReport(r)
  return n.notaTotal
}

export function TeacherScreen({ onBack }: Props) {
  const [pin, setPin] = useState('')
  const [authed, setAuthed] = useState(false)
  const [msg, setMsg] = useState('')
  const [search, setSearch] = useState('')
  const [importCode, setImportCode] = useState('')
  const [reports, setReports] = useState<Report[]>(() =>
    loadReports()
      .filter((r) => !r.modoTreino)
      .map(normalizeReport)
      .sort((a, b) => new Date(b.dataISO).getTime() - new Date(a.dataISO).getTime()),
  )

  const settings = loadTeacherSettings()

  function refresh() {
    setReports(
      loadReports()
        .filter((r) => !r.modoTreino)
        .map(normalizeReport)
        .sort((a, b) => new Date(b.dataISO).getTime() - new Date(a.dataISO).getTime()),
    )
  }

  function login(e: React.FormEvent) {
    e.preventDefault()
    if (pin === settings.pin) {
      setAuthed(true)
      refresh()
      setMsg('')
    } else {
      setMsg('PIN incorreto.')
    }
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return reports
    return reports.filter((r) => r.aluno.toLowerCase().includes(q) || r.casoNome.toLowerCase().includes(q))
  }, [reports, search])

  const stats = useMemo(() => {
    if (reports.length === 0) {
      return { total: 0, media: 0, pctPol: 0, pctDesc: 0 }
    }
    const media = Math.round(reports.reduce((a, r) => a + notaOf(r), 0) / reports.length)
    const pctPol = Math.round((reports.filter((r) => r.poluenteCorreto).length / reports.length) * 100)
    const pctDesc = Math.round((reports.filter((r) => r.descarteCorreto).length / reports.length) * 100)
    return { total: reports.length, media, pctPol, pctDesc }
  }, [reports])

  function exportarCsv() {
    playClick()
    const rows = [
      ['Aluno', 'Poluente (50)', 'Descarte (50)', 'Nota total', 'Caso', 'Tempo', 'Data', 'Completo'],
      ...reports.map((r) => [
        r.aluno,
        r.poluenteCorreto ? '50' : '0',
        r.descarteCorreto ? '50' : '0',
        String(notaOf(r)),
        r.casoNome,
        formatTime(r.tempoSegundos),
        new Date(r.dataISO).toLocaleString('pt-BR'),
        r.correto ? 'Sim' : 'Não',
      ]),
    ]
    downloadCsv(rows, `detetives-notas-${new Date().toISOString().slice(0, 10)}.csv`)
    setMsg('Planilha exportada com sucesso.')
  }

  function importar() {
    try {
      const lines = importCode.split(/\n+/).map((l) => l.trim()).filter(Boolean)
      let count = 0
      for (const line of lines) {
        const decoded = decodeReportCode(line)
        if (decoded) {
          importReports(JSON.stringify(decoded))
          count++
        } else {
          importReports(line)
          count++
        }
      }
      refresh()
      setImportCode('')
      setMsg(`${count} registro(s) importado(s).`)
    } catch {
      setMsg('Código inválido. Cole um relatório por linha.')
    }
  }

  if (!authed) {
    return (
      <div className="saas-login">
        <h2>Painel da {SCHOOL.professora}</h2>
        <p className="lead">Acesso restrito · visualização de notas da turma</p>
        <form onSubmit={login} className="grid">
          <label>
            PIN
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="PIN de acesso"
              autoComplete="current-password"
            />
          </label>
          {msg && <p className="erro">{msg}</p>}
          <button type="submit" className="btn-tech-primary">
            Entrar no painel
          </button>
        </form>
        <button type="button" className="btn-link" onClick={onBack}>
          Voltar
        </button>
      </div>
    )
  }

  return (
    <div className="saas-dashboard">
      <header className="saas-topbar">
        <div>
          <h2>Painel de resultados</h2>
          <p>
            {SCHOOL.professora} · {SCHOOL.disciplina} · Nota 50% poluente + 50% descarte
          </p>
        </div>
        <div className="saas-topbar-actions">
          <button type="button" onClick={refresh}>
            Atualizar
          </button>
          <button type="button" className="saas-btn-export" onClick={exportarCsv}>
            Exportar Excel
          </button>
          <button type="button" onClick={() => { playClick(); onBack() }}>
            Sair
          </button>
        </div>
      </header>

      <div className="saas-kpis">
        <div className="saas-kpi">
          <span>Registros</span>
          <strong>{stats.total}</strong>
        </div>
        <div className="saas-kpi">
          <span>Média da turma</span>
          <strong>{stats.media}/100</strong>
        </div>
        <div className="saas-kpi">
          <span>Acertaram poluente</span>
          <strong className="green">{stats.pctPol}%</strong>
        </div>
        <div className="saas-kpi">
          <span>Acertaram descarte</span>
          <strong className="green">{stats.pctDesc}%</strong>
        </div>
      </div>

      <TeacherSettingsPanel />

      <QrAccessPanel compact />

      <StudentAccountsPanel />

      <div className="saas-toolbar">
        <input
          type="search"
          placeholder="Buscar aluno ou caso…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          type="button"
          className="danger"
          onClick={() => {
            if (confirm('Apagar todos os registros deste navegador?')) {
              clearReports()
              refresh()
              setMsg('Dados apagados.')
            }
          }}
        >
          Limpar tudo
        </button>
      </div>

      {msg && <p className="ok-msg" style={{ padding: '0.5rem 1.25rem', margin: 0 }}>{msg}</p>}

      <details className="saas-import">
        <summary>Importar relatórios dos alunos (colar código)</summary>
        <textarea
          value={importCode}
          onChange={(e) => setImportCode(e.target.value)}
          placeholder="Cole um código por linha — enviado pelo aluno ao final do jogo"
          rows={3}
        />
        <button type="button" className="btn-inst-secondary" style={{ marginTop: '0.5rem' }} onClick={importar}>
          Importar para a tabela
        </button>
      </details>

      <div className="saas-table-wrap">
        {filtered.length === 0 ? (
          <div className="saas-empty">
            <p>Nenhum resultado ainda.</p>
            <p>Os alunos aparecem aqui ao concluir o jogo neste computador ou após importar os códigos.</p>
          </div>
        ) : (
          <table className="saas-table">
            <thead>
              <tr>
                <th>Aluno</th>
                <th>Poluente</th>
                <th>Descarte</th>
                <th>Nota</th>
                <th>Caso</th>
                <th>Tempo</th>
                <th>Data</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => {
                const nota = notaOf(r)
                return (
                  <tr key={r.id}>
                    <td>
                      <strong>{r.aluno}</strong>
                    </td>
                    <td>
                      <span className={`saas-chip ${r.poluenteCorreto ? 'saas-chip--ok' : 'saas-chip--fail'}`}>
                        {r.poluenteCorreto ? '50 pts' : '0 pts'}
                      </span>
                    </td>
                    <td>
                      <span className={`saas-chip ${r.descarteCorreto ? 'saas-chip--ok' : 'saas-chip--fail'}`}>
                        {r.descarteCorreto ? '50 pts' : '0 pts'}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`saas-chip ${
                          nota >= 100 ? 'saas-chip--ok' : nota >= 50 ? 'saas-chip--partial' : 'saas-chip--fail'
                        }`}
                      >
                        {nota}/100
                      </span>
                    </td>
                    <td>{r.casoNome}</td>
                    <td>{formatTime(r.tempoSegundos)}</td>
                    <td>{new Date(r.dataISO).toLocaleDateString('pt-BR')}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      <p className="saas-footer-hint">
        Dica: no laboratório de informática, todos jogam no mesmo PC e a tabela preenche automaticamente. Em
        celulares, peça aos alunos copiarem o código no final e importe acima.
      </p>
    </div>
  )
}
