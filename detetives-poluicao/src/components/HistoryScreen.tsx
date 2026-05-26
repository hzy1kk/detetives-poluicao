import { loadProfile, loadReports } from '../lib/storage'
import { formatTime } from '../lib/gameEngine'

type Props = {
  onBack: () => void
}

export function HistoryScreen({ onBack }: Props) {
  const profile = loadProfile()
  const all = loadReports()
  const mine = profile ? all.filter((r) => r.aluno === profile.nome) : all

  return (
    <section className="card">
      <h2>Meu histórico</h2>
      {mine.length === 0 ? (
        <p>Você ainda não concluiu nenhuma investigação.</p>
      ) : (
        <ul className="history-list">
          {mine
            .slice()
            .reverse()
            .map((r) => (
              <li key={r.id}>
                <strong>{r.casoNome}</strong>
                <span>
                  Nota {(r.notaTotal ?? (r.poluenteCorreto ? 50 : 0) + (r.descarteCorreto ? 50 : 0))}/100 ·{' '}
                  {formatTime(r.tempoSegundos)} · {'★'.repeat(r.estrelas)}
                  {r.modoTreino ? ' · treino' : ''}
                </span>
              </li>
            ))}
        </ul>
      )}
      <button type="button" className="btn-primary btn-block" onClick={onBack}>
        Voltar
      </button>
    </section>
  )
}
