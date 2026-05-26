import { playClick } from '../lib/audio'

type Props = {
  onDone: () => void
}

export function TutorialScreen({ onDone }: Props) {
  return (
    <section className="card">
      <h2>Como jogar</h2>
      <ol className="tutorial-list">
        <li>Faça login com a senha da turma.</li>
        <li>Receba um caso sorteado (rio, solo ou lagoa).</li>
        <li>Desbloqueie pistas uma a uma — algumas têm mini-pergunta de Química.</li>
        <li>Use o laboratório virtual (André) — testes limitados por partida.</li>
        <li>Peça até 3 dicas (perdem pontos, exceto no treino).</li>
        <li>Acuse o poluente e escolha o descarte correto — 3 tentativas.</li>
        <li>Exporte o relatório JSON para a Profª Maria.</li>
      </ol>
      <div className="personagens">
        <p>🕵️ Lucas — investigação</p>
        <p>👩‍🔬 Ana — química</p>
        <p>🧪 André — laboratório</p>
        <p>🌿 Gabriel — meio ambiente</p>
        <p>💧 Gota Gi — rios e lagos</p>
      </div>
      <button type="button" className="btn-primary btn-block" onClick={() => { playClick(); onDone() }}>
        Entendi, vamos lá!
      </button>
    </section>
  )
}
