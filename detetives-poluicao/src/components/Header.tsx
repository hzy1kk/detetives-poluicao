import { SCHOOL } from '../data/config'

type Props = {
  compact?: boolean
}

export function Header({ compact }: Props) {
  return (
    <header className="topo">
      <img src="/logo-escola.png" alt={`Logo ${SCHOOL.nome}`} className="logo" />
      <div>
        <p className="kicker">
          {SCHOOL.disciplina} · {SCHOOL.serie} · Turma {SCHOOL.turma}
        </p>
        <h1>Detetives da Poluição</h1>
        {!compact && (
          <p className="sub">
            {SCHOOL.professora} · Colégio Paulo de Tarso · {SCHOOL.cidade}
          </p>
        )}
      </div>
    </header>
  )
}
