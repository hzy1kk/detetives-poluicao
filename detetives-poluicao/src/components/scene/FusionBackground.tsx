/** Fundo tech escuro — verde, azul e branco */
export function FusionBackground() {
  return (
    <div className="tech-bg" aria-hidden>
      <div className="tech-bg__gradient" />
      <div className="tech-bg__orb tech-bg__orb--blue" />
      <div className="tech-bg__orb tech-bg__orb--green" />
      <div className="tech-bg__grid" />
      <div className="tech-bg__scan" />
    </div>
  )
}
