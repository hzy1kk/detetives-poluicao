import { QUESTION_BANK, type BankQuestion, type QuestionTier } from '../data/questionBank'

const RECENT_KEY = 'detetives-perguntas-recentes'
const RECENT_KEEP = 24

type RecentStore = Record<string, string[]>

function loadRecent(): RecentStore {
  try {
    const raw = localStorage.getItem(RECENT_KEY)
    return raw ? (JSON.parse(raw) as RecentStore) : {}
  } catch {
    return {}
  }
}

function saveRecent(store: RecentStore): void {
  localStorage.setItem(RECENT_KEY, JSON.stringify(store))
}

function pickOne(pool: BankQuestion[], avoid: Set<string>): BankQuestion | null {
  const available = pool.filter((q) => !avoid.has(q.id))
  const list = available.length > 0 ? available : pool
  if (list.length === 0) return null
  return list[Math.floor(Math.random() * list.length)]
}

/** Sorteia 5 perguntas (tier 1..5) para o caso, evitando repetição recente. */
export function pickQuestionsForCase(casoId: string): string[] {
  const recent = loadRecent()[casoId] ?? []
  const avoid = new Set(recent)
  const ids: string[] = []

  for (let tier = 1; tier <= 5; tier++) {
    const pool = QUESTION_BANK.filter((q) => q.casoId === casoId && q.tier === tier)
    const chosen = pickOne(pool, avoid)
    if (chosen) {
      ids.push(chosen.id)
      avoid.add(chosen.id)
    }
  }

  const nextRecent = [...ids, ...recent].slice(0, RECENT_KEEP)
  const store = loadRecent()
  store[casoId] = nextRecent
  saveRecent(store)

  return ids
}

export function getQuestionById(id: string): BankQuestion | undefined {
  return QUESTION_BANK.find((q) => q.id === id)
}

export function getTierForIndex(index: number): QuestionTier {
  return Math.min(5, Math.max(1, index + 1)) as QuestionTier
}
