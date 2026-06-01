import { CASES } from '../data/cases'
import { CLUE_COUNT, LAB_CHARGES } from '../data/config'
import type { Difficulty, GameCase, GameSession, PerformanceTier, Report, Topic } from '../types'
import { encodeReportCode } from './storage'

const CASES_FACIL = new Set(['oleo-rio', 'pilhas-solo'])
const CASES_DIFICIL = new Set(['microplasticos', 'efluente-acido'])

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function pickCase(
  difficulty: Difficulty,
  activeTopics: Topic[],
  lastCaseId: string | null,
  completedCaseIds: string[] = [],
): GameCase {
  let pool = CASES.filter((c) => c.topics.some((t) => activeTopics.includes(t)))
  if (pool.length === 0) pool = CASES

  const incomplete = pool.filter((c) => !completedCaseIds.includes(c.id))
  if (incomplete.length > 0) pool = incomplete

  if (difficulty === 'facil') {
    const easy = pool.filter((c) => CASES_FACIL.has(c.id))
    if (easy.length > 0) pool = easy
  } else if (difficulty === 'dificil') {
    const hard = pool.filter((c) => CASES_DIFICIL.has(c.id))
    if (hard.length > 0) pool = hard
  }

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
    cluesRevealed: 0,
    dicasUsadas: 0,
    tentativas: 0,
    testesFeitos: [],
    labCharges: LAB_CHARGES[difficulty],
    startedAt: Date.now(),
    miniRespostas: {},
    pistaSuspeito: {},
    locaisVisitados: [],
    suspeitosEliminadosLab: [],
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

export function getActiveSuspeitos(gameCase: GameCase, session: GameSession, extraHidden: string[] = []): string[] {
  const hidden = new Set([...session.suspeitosEliminadosLab, ...extraHidden])
  return gameCase.suspeitos.filter((s) => !hidden.has(s))
}

export function applyLabTest(
  gameCase: GameCase,
  session: GameSession,
  testId: string,
): { session: GameSession; eliminados: string[]; destacados: string[] } {
  const test = gameCase.testes.find((t) => t.id === testId)
  if (!test) return { session, eliminados: [], destacados: [] }

  const jaFeito = session.testesFeitos.includes(testId)
  const eliminados = test.eliminaSuspeitos ?? []
  const destacados = test.destacaSuspeitos ?? []

  const nextElim = jaFeito
    ? session.suspeitosEliminadosLab
    : [...new Set([...session.suspeitosEliminadosLab, ...eliminados])]

  const nextSession: GameSession = {
    ...session,
    testesFeitos: jaFeito ? session.testesFeitos : [...session.testesFeitos, testId],
    labCharges: jaFeito ? session.labCharges : session.labCharges - 1,
    suspeitosEliminadosLab: nextElim,
  }

  return { session: nextSession, eliminados, destacados }
}

export function getSuspeitoComMaisPistas(
  gameCase: GameCase,
  session: GameSession,
): string | null {
  const counts = new Map<string, number>()
  for (const clueId of getVisibleClueIds(session, gameCase)) {
    const sus = session.pistaSuspeito[clueId]
    if (!sus) continue
    counts.set(sus, (counts.get(sus) ?? 0) + 1)
  }
  let best: string | null = null
  let max = 0
  for (const [s, n] of counts) {
    if (n > max) {
      max = n
      best = s
    }
  }
  return best
}

export function isTeoriaAlinhada(
  gameCase: GameCase,
  session: GameSession,
  suspeitoEscolhido: string,
): boolean {
  const pins = Object.values(session.pistaSuspeito).filter(Boolean)
  if (pins.length === 0) return true
  const top = getSuspeitoComMaisPistas(gameCase, session)
  if (!top) return true
  return top === suspeitoEscolhido
}

export function requiresLabBeforeVerdict(session: GameSession): boolean {
  return !session.modoTreino && session.testesFeitos.length < 1
}

export function requiresTheoryPins(session: GameSession): boolean {
  return session.difficulty !== 'facil' && !session.modoTreino
}

export function getHintText(gameCase: GameCase, level: number): string {
  if (level <= 3) return gameCase.dicas[level - 1]
  return gameCase.dicas[2]
}

export function getErrorHint(
  gameCase: GameCase,
  poluenteOk: boolean,
  descarteOk: boolean,
): string {
  if (!poluenteOk && !descarteOk) {
    return `Dica da investigacao: ${gameCase.dicas[0]}`
  }
  if (!poluenteOk) {
    return `Dica — fonte da poluicao: ${gameCase.dicas[1]}`
  }
  return `Dica — descarte correto: ${gameCase.dicas[2]}`
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

  const usouTesteChave = session.testesFeitos.includes(gameCase.testeChaveId)
  const investigouSemTeste = session.testesFeitos.length === 0
  const teoriaAlinhada = isTeoriaAlinhada(gameCase, session, suspeito)

  if (session.modoTreino) {
    notaTotal = correto ? Math.min(notaTotal, 50) : 0
  } else if (correto) {
    if (session.tentativas === 1 && session.dicasUsadas === 0) notaTotal = 100
    else if (session.dicasUsadas > 0) notaTotal = Math.max(85, notaTotal - session.dicasUsadas * 5)
    else if (session.tentativas > 1) notaTotal = Math.max(90, notaTotal - (session.tentativas - 1) * 5)
    if (usouTesteChave) notaTotal = Math.min(100, notaTotal + 5)
    if (investigouSemTeste) notaTotal = Math.max(0, notaTotal - 5)
    if (!teoriaAlinhada && requiresTheoryPins(session)) notaTotal = Math.max(0, notaTotal - 5)
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
    testesFeitosCount: session.testesFeitos.length,
    usouTesteChave,
    investigouSemTeste,
    teoriaAlinhada,
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
