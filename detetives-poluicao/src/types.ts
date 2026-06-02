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
  | 'ranking'
  | 'teacher'
  | 'about'
  | 'history'

export type PerformanceTier = 'excelente' | 'bom' | 'parcial' | 'reforco'

export type LabTest = {
  id: string
  nome: string
  resultado: string
  personagem: string
  eliminaSuspeitos?: string[]
  destacaSuspeitos?: string[]
  testeChave?: boolean
}

export type MiniPerguntaEscolha = {
  tipo: 'escolha'
  pergunta: string
  opcoes: string[]
  correta: number
}

export type MiniPerguntaParear = {
  tipo: 'parear'
  pergunta: string
  pares: { esquerda: string; direita: string }[]
}

export type MiniPerguntaOrdenar = {
  tipo: 'ordenar'
  pergunta: string
  itens: string[]
  ordemCorreta: number[]
}

export type MiniPergunta = MiniPerguntaEscolha | MiniPerguntaParear | MiniPerguntaOrdenar

export type Clue = {
  id: string
  texto: string
  miniPergunta?: MiniPergunta
}

export type MapHotspot = {
  id: string
  label: string
  emoji: string
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
  mapaLocais: MapHotspot[]
  pistas: Clue[]
  suspeitos: string[]
  descartes: string[]
  testes: LabTest[]
  testeChaveId: string
  gabarito: { suspeito: string; descarte: string }
  explicacao: string
  aprendizados: [string, string, string]
  dicas: [string, string]
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
  notaPoluente: number
  notaDescarte: number
  notaTotal: number
  performanceTier: PerformanceTier
  dicasUsadas: number
  tentativas: number
  pistasVistas: number
  testesFeitosCount: number
  usouTesteChave: boolean
  investigouSemTeste: boolean
  teoriaAlinhada: boolean
  dataISO: string
  codigoExport: string
}

export type StudentAccount = {
  id: string
  login: string
  nome: string
  turma: string
  passwordHash: string
  ativo: boolean
  criadoEm: string
}

export type StudentProfile = {
  id: string
  login: string
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
  /** IDs das 5 perguntas sorteadas (tier 1..5) */
  perguntaIds: string[]
  /** Perguntas respondidas com sucesso (0–5) */
  cluesRevealed: number
  perguntasAcertos: number
  dicasUsadas: number
  tentativas: number
  locaisVisitados: string[]
  startedAt: number
  finalizado: boolean
}
