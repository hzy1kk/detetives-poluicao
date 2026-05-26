import type { Report } from '../types'
import { loadReports } from './storage'

export type RankingRow = {
  posicao: number
  aluno: string
  turma: string
  notaTotal: number
  pontuacao: number
  correto: boolean
  casoNome: string
  dataISO: string
}

/** Melhor nota por aluno (para ranking da turma neste aparelho) */
export function buildRanking(turma?: string, limit = 25): RankingRow[] {
  const reports = loadReports().filter((r) => !r.modoTreino && (!turma || r.turma === turma))

  const bestByAluno = new Map<string, Report>()
  for (const r of reports) {
    const prev = bestByAluno.get(r.aluno)
    if (!prev || r.notaTotal > prev.notaTotal || (r.notaTotal === prev.notaTotal && r.pontuacao > prev.pontuacao)) {
      bestByAluno.set(r.aluno, r)
    }
  }

  const sorted = [...bestByAluno.values()].sort((a, b) => {
    if (b.notaTotal !== a.notaTotal) return b.notaTotal - a.notaTotal
    return b.pontuacao - a.pontuacao
  })

  return sorted.slice(0, limit).map((r, i) => ({
    posicao: i + 1,
    aluno: r.aluno,
    turma: r.turma,
    notaTotal: r.notaTotal ?? (r.poluenteCorreto ? 50 : 0) + (r.descarteCorreto ? 50 : 0),
    pontuacao: r.pontuacao,
    correto: r.correto,
    casoNome: r.casoNome,
    dataISO: r.dataISO,
  }))
}

export function getPlayerRank(aluno: string, turma: string): RankingRow | null {
  const all = buildRanking(turma, 200)
  return all.find((r) => r.aluno === aluno) ?? null
}
