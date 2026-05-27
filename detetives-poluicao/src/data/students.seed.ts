import type { StudentAccount } from '../types'

/** Contas de demonstração (senha: demo01) — substitua pelo cadastro real da turma. */
export const SEED_STUDENTS: StudentAccount[] = [
  {
    id: 'seed-1',
    login: 'aluno.demo1',
    nome: 'Aluno Demonstração 1',
    turma: 'AALG',
    passwordHash: 'a2fe121620c72cf2ceb0780753168023e0f7d856e59b395f185cbff477a88afa',
    ativo: true,
    criadoEm: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'seed-2',
    login: 'aluno.demo2',
    nome: 'Aluno Demonstração 2',
    turma: 'AALG',
    passwordHash: 'a2fe121620c72cf2ceb0780753168023e0f7d856e59b395f185cbff477a88afa',
    ativo: true,
    criadoEm: '2026-01-01T00:00:00.000Z',
  },
]
