import { CASES } from '../data/cases'
import { QUESTIONS_PER_RUN } from '../data/config'
import type { Difficulty, GameCase, GameSession, PerformanceTier, Report, Topic } from '../types'
import { pickQuestionsForCase } from './questionPicker'
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
  return {
    caseId,
    difficulty,
    modoTreino,
    perguntaIds: pickQuestionsForCase(caseId),
    cluesRevealed: 0,
    perguntasAcertos: 0,
    dicasUsadas: 0,
    tentativas: 0,
    locaisVisitados: [],
    startedAt: Date.now(),
    finalizado: false,
  }
}

export function getQuestionsPerRun(): number {
  return QUESTIONS_PER_RUN
}

export function getHintText(gameCase: GameCase, level: number): string {
  if (level <= 1) return gameCase.dicas[0]
  return gameCase.dicas[1]
}

export function getErrorHint(
  gameCase: GameCase,
  poluenteOk: boolean,
  descarteOk: boolean,
): string {
  if (!poluenteOk && !descarteOk) return gameCase.dicas[0]
  if (!poluenteOk) return gameCase.dicas[0]
  return gameCase.dicas[1]
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
    const bonusPerguntas = Math.min(10, session.perguntasAcertos * 2)
    notaTotal = Math.min(100, notaTotal + bonusPerguntas)
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
    testesFeitosCount: 0,
    usouTesteChave: false,
    investigouSemTeste: false,
    teoriaAlinhada: true,
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
