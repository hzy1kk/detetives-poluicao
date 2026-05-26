import { AUTHORS, SCHOOL } from '../data/config'

type Props = {
  className?: string
}

export function CreditsFooter({ className = '' }: Props) {
  return (
    <footer className={`credits-footer ${className}`.trim()}>
      <p>
        {AUTHORS.map((a) => a.nome).join(' · ')} — {SCHOOL.professora} — {SCHOOL.nome}
      </p>
    </footer>
  )
}
