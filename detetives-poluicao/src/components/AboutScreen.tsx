import { AUTHORS, SCHOOL } from '../data/config'
import { CASES } from '../data/cases'

type Props = {
  onBack: () => void
}

export function AboutScreen({ onBack }: Props) {
  return (
    <section className="card">
      <h2>Sobre o projeto</h2>
      <p>
        <strong>Detetives da Poluição</strong> é um jogo educativo de Química e educação ambiental
        desenvolvido para o {SCHOOL.serie} do {SCHOOL.nome} ({SCHOOL.cidade}),
        sob orientação da {SCHOOL.professora}.
      </p>
      <h3>Equipe</h3>
      <ul>
        {AUTHORS.map((a) => (
          <li key={a.nome}>
            <strong>{a.nome}</strong>
            {' — '}{a.papel}
          </li>
        ))}
      </ul>
      <h3>Casos investigáveis ({CASES.length})</h3>
      <ul>
        {CASES.map((c) => (
          <li key={c.id}>
            {c.emoji} {c.nome}
          </li>
        ))}
      </ul>
      <h3>Conteúdos</h3>
      <p>
        pH, metais pesados, polímeros/microplásticos, reações ambientais, contaminação da água e do
        solo, reciclagem e sustentabilidade — alinhados à BNCC do Ensino Médio.
      </p>
      <p className="creditos-mini">
        Versão digital · PWA offline · Deploy Vercel · {new Date().getFullYear()}
      </p>
      <button type="button" className="btn-primary btn-block" onClick={onBack}>
        Voltar
      </button>
    </section>
  )
}
