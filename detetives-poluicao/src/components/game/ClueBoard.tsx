type Props = {
  clues: string[]
  total: number
}

export function ClueBoard({ clues, total }: Props) {
  if (clues.length === 0) return null

  return (
    <div className="evidence-board bit-box">
      <p className="retro evidence-board__title">
        PISTAS COLETADAS ({clues.length}/{total})
      </p>
      {clues.map((texto, i) => (
        <div key={i} className="evidence-board__clue">
          <p className="evidence-board__clue-text">
            <span className="retro" style={{ color: 'var(--8bit-green)', marginRight: '0.35rem' }}>
              {String(i + 1).padStart(2, '0')}
            </span>
            {texto}
          </p>
        </div>
      ))}
    </div>
  )
}
