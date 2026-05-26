export type Difficulty = 'facil' | 'medio' | 'dificil'

export type Topic =
  | 'ph'
  | 'metais'
  | 'plasticos'
  | 'reacoes'
  | 'agua_solo'
  | 'reciclagem'
  | 'sustentabilidade'

export type Screen =
  | 'login'
  | 'menu'
  | 'tutorial'
  | 'game'
  | 'result'
  | 'teacher'
  | 'about'
  | 'history'

export type LabTest = {
  id: string
  nome: string
  resultado: string
  personagem: string
}

export type Clue = {
  id: string
  texto: string
  miniPergunta?: {
    pergunta: string
    opcoes: string[]
    correta: number
  }
}

export type GameCase = {
  id: string
  nome: string
  emoji: string
  cenario: 'agua' | 'solo' | 'lago'
  topics: Topic[]
  bncc: string[]
  bnccTexto: string
  contexto: string
  intro: string
  pistas: Clue[]
  suspeitos: string[]
  descartes: string[]
  testes: LabTest[]
  gabarito: { suspeito: string; descarte: string }
  explicacao: string
  dicas: [string, string, string]
  suspeitoEliminarDica3: string
}

export type Report = {
  id: string
  aluno: string
  turma: string
  casoId: string
  casoNome: string
  dificuldade: Difficulty
  modoTreino: boolean
  tempoSegundos: number
  pontuacao: number
  estrelas: 1 | 2 | 3
  suspeitoEscolhido: string
  descarteEscolhido: string
  poluenteCorreto: boolean
  descarteCorreto: boolean
  correto: boolean
  dicasUsadas: number
  tentativas: number
  pistasVistas: number
  dataISO: string
  codigoExport: string
}

export type StudentProfile = {
  nome: string
  turma: string
  serie: string
  criadoEm: string
}

export type TeacherSettings = {
  pin: string
  dificuldadePadrao: Difficulty
  temasAtivos: Topic[]
}

export type GameSession = {
  caseId: string
  difficulty: Difficulty
  modoTreino: boolean
  clueOrder: string[]
  cluesRevealed: number
  dicasUsadas: number
  tentativas: number
  testesFeitos: string[]
  labCharges: number
  startedAt: number
  miniRespostas: Record<string, boolean>
  finalizado: boolean
}
