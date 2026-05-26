import type { Report, StudentProfile, TeacherSettings } from '../types'
import { TEACHER_PIN_DEFAULT } from '../data/config'

const KEYS = {
  reports: 'detetives-relatorios-v2',
  profile: 'detetives-perfil',
  teacher: 'detetives-professor-config',
  tutorial: 'detetives-tutorial-visto',
  lastCase: 'detetives-ultimo-caso',
  fontSize: 'detetives-fonte',
  sound: 'detetives-som',
}

export function loadReports(): Report[] {
  try {
    const raw = localStorage.getItem(KEYS.reports)
    return raw ? (JSON.parse(raw) as Report[]) : []
  } catch {
    return []
  }
}

export function saveReport(report: Report): void {
  const list = loadReports()
  list.push(report)
  if (list.length > 500) list.splice(0, list.length - 500)
  localStorage.setItem(KEYS.reports, JSON.stringify(list))
}

/** Compatível com relatórios antigos sem notaTotal */
export function normalizeReport(r: Report): Report {
  const notaPoluente = r.notaPoluente ?? (r.poluenteCorreto ? 50 : 0)
  const notaDescarte = r.notaDescarte ?? (r.descarteCorreto ? 50 : 0)
  const notaTotal = r.notaTotal ?? notaPoluente + notaDescarte
  return {
    ...r,
    notaPoluente,
    notaDescarte,
    notaTotal,
    performanceTier:
      r.performanceTier ??
      (r.correto ? 'bom' : notaTotal >= 50 ? 'parcial' : 'reforco'),
  }
}

export function importReports(json: string): number {
  const incoming = JSON.parse(json) as Report | Report[]
  const arr = Array.isArray(incoming) ? incoming : [incoming]
  const existing = loadReports()
  const merged = [...existing, ...arr]
  localStorage.setItem(KEYS.reports, JSON.stringify(merged))
  return arr.length
}

export function clearReports(): void {
  localStorage.removeItem(KEYS.reports)
}

export function loadProfile(): StudentProfile | null {
  try {
    const raw = localStorage.getItem(KEYS.profile)
    return raw ? (JSON.parse(raw) as StudentProfile) : null
  } catch {
    return null
  }
}

export function saveProfile(profile: StudentProfile): void {
  localStorage.setItem(KEYS.profile, JSON.stringify(profile))
}

export function loadTeacherSettings(): TeacherSettings {
  try {
    const raw = localStorage.getItem(KEYS.teacher)
    if (raw) return JSON.parse(raw) as TeacherSettings
  } catch {
    /* ignore */
  }
  return {
    pin: TEACHER_PIN_DEFAULT,
    dificuldadePadrao: 'medio',
    temasAtivos: ['ph', 'metais', 'plasticos', 'reacoes', 'agua_solo', 'reciclagem', 'sustentabilidade'],
  }
}

export function saveTeacherSettings(settings: TeacherSettings): void {
  localStorage.setItem(KEYS.teacher, JSON.stringify(settings))
}

export function wasTutorialSeen(): boolean {
  return localStorage.getItem(KEYS.tutorial) === '1'
}

export function markTutorialSeen(): void {
  localStorage.setItem(KEYS.tutorial, '1')
}

export function getLastCaseId(): string | null {
  return localStorage.getItem(KEYS.lastCase)
}

export function setLastCaseId(id: string): void {
  localStorage.setItem(KEYS.lastCase, id)
}

export type FontSize = 'p' | 'm' | 'g'

export function loadFontSize(): FontSize {
  const v = localStorage.getItem(KEYS.fontSize)
  return v === 'p' || v === 'g' ? v : 'g'
}

export function saveFontSize(size: FontSize): void {
  localStorage.setItem(KEYS.fontSize, size)
}

export function loadSoundEnabled(): boolean {
  return localStorage.getItem(KEYS.sound) !== '0'
}

export function saveSoundEnabled(on: boolean): void {
  localStorage.setItem(KEYS.sound, on ? '1' : '0')
}

export function encodeReportCode(report: Report): string {
  return btoa(unescape(encodeURIComponent(JSON.stringify(report))))
}

export function decodeReportCode(code: string): Report | null {
  try {
    return JSON.parse(decodeURIComponent(escape(atob(code.trim())))) as Report
  } catch {
    return null
  }
}

export function downloadJson(data: unknown, filename: string): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function downloadCsv(rows: string[][], filename: string): void {
  const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n')
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
