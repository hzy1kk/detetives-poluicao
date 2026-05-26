import { CASES } from '../data/cases'
import { CLUE_COUNT, LAB_CHARGES } from '../data/config'
import type { Difficulty, GameCase, GameSession, PerformanceTier, Report, Topic } from '../types'
import { encodeReportCode } from './storage'

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function pickCase(
  _difficulty: Difficulty,
  activeTopics: Topic[],
  lastCaseId: string | null,
): GameCase {
  let pool = CASES.filter((c) => c.topics.some((t) => activeTopics.includes(t)))
  if (pool.length === 0) pool = CASES
  if (pool.length > 1 && lastCaseId) {
    const filtered = pool.filter((c) => c.id !== lastCaseId)
    if (filtered.length > 0) pool = filtered
  }
  return pool[Math.floor(Math.random() * pool.length)]
}

export function createSession(
  caseId: string,
  difficulty: Difficulty,
  modoTreino: boolean,
): GameSession {
  const gameCase = CASES.find((c) => c.id === caseId)!
  return {
    caseId,
    difficulty,
    modoTreino,
    clueOrder: shuffle(gameCase.pistas.map((p) => p.id)),
    cluesRevealed: 1,
    dicasUsadas: 0,
    tentativas: 0,
    testesFeitos: [],
    labCharges: LAB_CHARGES[difficulty],
    startedAt: Date.now(),
    miniRespostas: {},
    finalizado: false,
  }
}

export function getClueCount(difficulty: Difficulty): number {
  return CLUE_COUNT[difficulty]
}

export function getVisibleClueIds(session: GameSession, _gameCase: GameCase): string[] {
  const total = CLUE_COUNT[session.difficulty]
  return session.clueOrder.slice(0, Math.min(session.cluesRevealed, total))
}

export function getHintText(gameCase: GameCase, level: number): string {
  if (level <= 3) return gameCase.dicas[level - 1]
  return gameCase.dicas[2]
}

/** Dica automática ao errar (sem consumir dica estratégica) */
export function getErrorHint(
  gameCase: GameCase,
  poluenteOk: boolean,
  descarteOk: boolean,
): string {
  if (!poluenteOk && !descarteOk) {
    return `💡 Dica da investigação: ${gameCase.dicas[0]}`
  }
  if (!poluenteOk) {
    return `💡 Dica — fonte da poluição: ${gameCase.dicas[1]}`
  }
  return `💡 Dica — descarte correto: ${gameCase.dicas[2]}`
}

export function calcPerformanceTier(params: {
  correto: boolean
  poluenteCorreto: boolean
  descarteCorreto: boolean
  tentativas: number
  dicasUsadas: number
}): PerformanceTier {
  const { correto, poluenteCorreto, descarteCorreto, tentativas, dicasUsadas } = params
  if (correto && tentativas <= 1 && dicasUsadas === 0) return 'excelente'
  if (correto) return 'bom'
  if (poluenteCorreto || descarteCorreto) return 'parcial'
  return 'reforco'
}

export function calcStars(notaTotal: number, correto: boolean): 1 | 2 | 3 {
  if (!correto && notaTotal < 50) return 1
  if (notaTotal >= 100) return 3
  if (notaTotal >= 50) return 2
  return 1
}

export function buildReport(params: {
  aluno: string
  turma: string
  gameCase: GameCase
  session: GameSession
  suspeito: string
  descarte: string
  tempoSegundos: number
}): Report {
  const { aluno, turma, gameCase, session, suspeito, descarte, tempoSegundos } = params
  const poluenteCorreto = suspeito === gameCase.gabarito.suspeito
  const descarteCorreto = descarte === gameCase.gabarito.descarte
  const correto = poluenteCorreto && descarteCorreto

  const notaPoluente = poluenteCorreto ? 50 : 0
  const notaDescarte = descarteCorreto ? 50 : 0
  let notaTotal = notaPoluente + notaDescarte

  if (session.modoTreino) {
    notaTotal = correto ? Math.min(notaTotal, 50) : 0
  } else if (correto) {
    if (session.tentativas === 1 && session.dicasUsadas === 0) notaTotal = 100
    else if (session.dicasUsadas > 0) notaTotal = Math.max(85, notaTotal - session.dicasUsadas * 5)
    else if (session.tentativas > 1) notaTotal = Math.max(90, notaTotal - (session.tentativas - 1) * 5)
  }

  const performanceTier = calcPerformanceTier({
    correto,
    poluenteCorreto,
    descarteCorreto,
    tentativas: session.tentativas,
    dicasUsadas: session.dicasUsadas,
  })

  let pontuacao = notaTotal * 10
  if (correto && tempoSegundos <= 900) pontuacao += 50
  pontuacao = Math.min(1000, pontuacao)

  const report: Report = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    aluno,
    turma,
    casoId: gameCase.id,
    casoNome: gameCase.nome,
    dificuldade: session.difficulty,
    modoTreino: session.modoTreino,
    tempoSegundos,
    pontuacao,
    estrelas: calcStars(notaTotal, correto),
    suspeitoEscolhido: suspeito,
    descarteEscolhido: descarte,
    poluenteCorreto,
    descarteCorreto,
    correto,
    notaPoluente,
    notaDescarte,
    notaTotal,
    performanceTier,
    dicasUsadas: session.dicasUsadas,
    tentativas: session.tentativas,
    pistasVistas: session.cluesRevealed,
    dataISO: new Date().toISOString(),
    codigoExport: '',
  }
  report.codigoExport = encodeReportCode(report)
  return report
}

export function formatTime(segundos: number): string {
  const m = Math.floor(segundos / 60)
  const s = segundos % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}
