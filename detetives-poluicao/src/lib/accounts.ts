import { TURMA_PADRAO } from '../data/config'
import { SEED_STUDENTS } from '../data/students.seed'
import type { StudentAccount } from '../types'

const KEY = 'detetives-alunos-v1'

export function slugLogin(nome: string): string {
  return nome
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '.')
    .replace(/^\.+|\.+$/g, '')
}

export async function hashPassword(password: string): Promise<string> {
  const data = new TextEncoder().encode(password)
  const buf = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export function loadStudentAccounts(): StudentAccount[] {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as StudentAccount[]) : []
  } catch {
    return []
  }
}

function saveStudentAccounts(list: StudentAccount[]): void {
  localStorage.setItem(KEY, JSON.stringify(list))
}

export function ensureStudentAccountsSeeded(): void {
  if (loadStudentAccounts().length > 0) return
  saveStudentAccounts(SEED_STUDENTS)
}

export async function authenticateStudent(
  login: string,
  password: string,
): Promise<StudentAccount | null> {
  const user = login.trim().toLowerCase()
  const acc = loadStudentAccounts().find(
    (a) => a.ativo && a.login.toLowerCase() === user,
  )
  if (!acc) return null
  const hash = await hashPassword(password)
  return hash === acc.passwordHash ? acc : null
}

export async function addStudentAccount(input: {
  nome: string
  login?: string
  senha: string
  turma?: string
}): Promise<{ ok: true; account: StudentAccount } | { ok: false; error: string }> {
  const nome = input.nome.trim()
  const login = (input.login?.trim() || slugLogin(nome)).toLowerCase()
  const senha = input.senha.trim()

  if (!nome) return { ok: false, error: 'Informe o nome do aluno.' }
  if (!login) return { ok: false, error: 'Login inválido.' }
  if (senha.length < 4) return { ok: false, error: 'Senha deve ter pelo menos 4 caracteres.' }

  const list = loadStudentAccounts()
  if (list.some((a) => a.login.toLowerCase() === login)) {
    return { ok: false, error: 'Este login já está em uso.' }
  }

  const account: StudentAccount = {
    id: crypto.randomUUID(),
    login,
    nome,
    turma: input.turma?.trim() || TURMA_PADRAO,
    passwordHash: await hashPassword(senha),
    ativo: true,
    criadoEm: new Date().toISOString(),
  }
  list.push(account)
  saveStudentAccounts(list)
  return { ok: true, account }
}

export async function updateStudentPassword(
  id: string,
  senha: string,
): Promise<boolean> {
  const list = loadStudentAccounts()
  const idx = list.findIndex((a) => a.id === id)
  if (idx < 0) return false
  if (senha.trim().length < 4) return false
  list[idx] = { ...list[idx], passwordHash: await hashPassword(senha.trim()) }
  saveStudentAccounts(list)
  return true
}

export function removeStudentAccount(id: string): void {
  saveStudentAccounts(loadStudentAccounts().filter((a) => a.id !== id))
}

export function exportAccountsJson(): string {
  return JSON.stringify(loadStudentAccounts(), null, 2)
}

export async function importAccountsJson(json: string): Promise<number> {
  const incoming = JSON.parse(json) as StudentAccount[]
  if (!Array.isArray(incoming)) throw new Error('Formato inválido')
  const list = loadStudentAccounts()
  let added = 0
  for (const row of incoming) {
    if (!row.login || !row.nome || !row.passwordHash) continue
    if (list.some((a) => a.login.toLowerCase() === row.login.toLowerCase())) continue
    list.push({
      id: row.id || crypto.randomUUID(),
      login: row.login.toLowerCase(),
      nome: row.nome,
      turma: row.turma || TURMA_PADRAO,
      passwordHash: row.passwordHash,
      ativo: row.ativo !== false,
      criadoEm: row.criadoEm || new Date().toISOString(),
    })
    added++
  }
  saveStudentAccounts(list)
  return added
}

/** CSV: nome,login,senha (cabeçalho opcional) */
export async function importAccountsCsv(csv: string): Promise<number> {
  const lines = csv
    .trim()
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
  let start = 0
  if (lines[0]?.toLowerCase().includes('nome')) start = 1

  let added = 0
  for (let i = start; i < lines.length; i++) {
    const parts = lines[i].split(/[,;]/).map((p) => p.trim().replace(/^"|"$/g, ''))
    if (parts.length < 2) continue
    const nome = parts[0]
    if (!nome) continue
    let login: string
    let senha: string
    if (parts.length >= 3) {
      login = parts[1].toLowerCase()
      senha = parts[2]
    } else {
      login = slugLogin(nome)
      senha = parts[1]
    }
    if (!senha) continue
    const res = await addStudentAccount({ nome, login, senha })
    if (res.ok) added++
  }
  return added
}

export function downloadAccountsCsv(): void {
  const rows = [['nome', 'login', 'observacao'], ...loadStudentAccounts().map((a) => [a.nome, a.login, '(senha definida no cadastro)'])]
  const csv = rows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\n')
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'alunos-logins-detetives.csv'
  a.click()
  URL.revokeObjectURL(url)
}
