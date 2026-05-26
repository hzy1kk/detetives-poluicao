/** Fundo institucional: azul, verde e branco */
export function FusionBackground() {
  return (
    <div className="inst-bg" aria-hidden>
      <div className="inst-bg__layer inst-bg__layer--blue" />
      <div className="inst-bg__layer inst-bg__layer--green" />
      <div className="inst-bg__layer inst-bg__layer--white" />
    </div>
  )
}
