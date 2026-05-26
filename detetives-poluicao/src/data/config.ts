export const SCHOOL = {
  nome: 'Colégio Paulo de Tarso',
  cidade: 'São Paulo – SP',
  disciplina: 'Química',
  serie: '2º EM Técnico',
  turma: 'TT',
  professora: 'Profª Maria',
}

export const AUTHORS = [
  { nome: 'Lucas Lohan', destaque: true, papel: 'Detetive ambiental (guia)' },
  { nome: 'Ana Flávia', destaque: false, papel: 'Química ambiental' },
  { nome: 'André Soares', destaque: false, papel: 'Técnico de laboratório' },
  { nome: 'Gabriel Rosa', destaque: false, papel: 'Guarda ambiental' },
]

export const TEAM_PASSWORD = 'detetive'
export const TEACHER_PIN_DEFAULT = 'detetive'
export const TURMA_PADRAO = '2TT'

export const CLUE_COUNT: Record<'facil' | 'medio' | 'dificil', number> = {
  facil: 4,
  medio: 5,
  dificil: 6,
}

export const LAB_CHARGES: Record<'facil' | 'medio' | 'dificil', number> = {
  facil: 2,
  medio: 2,
  dificil: 3,
}

export const TOPIC_LABELS: Record<string, string> = {
  ph: 'pH (acidez/basicidade)',
  metais: 'Metais pesados',
  plasticos: 'Polímeros e microplásticos',
  reacoes: 'Reações no ambiente',
  agua_solo: 'Contaminação água/solo',
  reciclagem: 'Reciclagem e tratamento',
  sustentabilidade: 'Sustentabilidade',
}
