/** Embaralha opções de múltipla escolha para a resposta correta não ficar sempre na letra A. */

export function shuffleIndices(length: number): number[] {
  const order = Array.from({ length }, (_, i) => i)
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[order[i], order[j]] = [order[j], order[i]]
  }
  return order
}

type Opcoes3 = readonly [string, string, string] | [string, string, string] | string[]

export function shuffleQuestionOptions<
  Q extends { opcoes: Opcoes3; correta: number },
>(question: Q): Q {
  const order = shuffleIndices(3)
  const opcoes = order.map((i) => question.opcoes[i]) as Q['opcoes']
  const correta = order.indexOf(question.correta)
  return { ...question, opcoes, correta }
}
