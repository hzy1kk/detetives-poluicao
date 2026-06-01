import { CASES } from '../data/cases'
import { loadReports, normalizeReport } from './storage'

/** Casos concluídos com acerto (nota >= 50) em modo avaliativo */
export function getCompletedCaseIds(alunoNome: string): string[] {
  const ids = new Set<string>()
  for (const r of loadReports().map(normalizeReport)) {
    if (r.aluno !== alunoNome || r.modoTreino || r.notaTotal < 50) continue
    ids.add(r.casoId)
  }
  return [...ids]
}

export function getCaseProgressLabel(alunoNome: string): string {
  const done = getCompletedCaseIds(alunoNome).length
  return `${done}/${CASES.length}`
}

export function getCaseBadges(alunoNome: string): { id: string; nome: string; emoji: string; done: boolean }[] {
  const done = new Set(getCompletedCaseIds(alunoNome))
  return CASES.map((c) => ({
    id: c.id,
    nome: c.nome,
    emoji: c.emoji,
    done: done.has(c.id),
  }))
}
