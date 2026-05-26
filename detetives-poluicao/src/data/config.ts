export const SCHOOL = {
  nome: 'Colégio Paulo de Tarso',
  cidade: 'São Paulo – SP',
  disciplina: 'Química',
  serie: '2º EM Técnico',
  turma: 'AALG',
  professora: 'Profª Maria',
}

export const AUTHORS = [
  { nome: 'Lucas Lohan', destaque: false, papel: 'Detetive ambiental (guia)' },
  { nome: 'Ana Flávia', destaque: false, papel: 'Dra. em Química ambiental' },
  { nome: 'André Soares', destaque: false, papel: 'Técnico de laboratório' },
  { nome: 'Gabriel Rosa', destaque: false, papel: 'Guarda ambiental' },
]

/** Senha da turma (alunos) e PIN padrão da professora */
export const TEAM_PASSWORD = 'detetive01'
export const TEACHER_PIN_DEFAULT = 'detetive01'
export const TURMA_PADRAO = 'AALG'

/** Link do jogo (QR code e pôster) */
export const GAME_URL = 'https://detetives-poluicao.vercel.app'

/**
 * Backup: cole aqui o link do Google Forms da Profª Maria.
 * Enquanto vazio, o botão orienta a professora a criar o formulário.
 */
export const GOOGLE_FORMS_URL = ''

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
