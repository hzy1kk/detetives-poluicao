import type { GameCase } from '../types'

export const CASES: GameCase[] = [
  {
    id: 'oleo-rio',
    nome: 'Mancha no Rio Sereno',
    emoji: '🛢️',
    cenario: 'agua',
    topics: ['ph', 'agua_solo', 'reciclagem', 'sustentabilidade'],
    bncc: ['EM13CNT306', 'EF08CI10'],
    bnccTexto: 'Impactos da ação humana sobre corpos d’água e uso sustentável de recursos.',
    contexto:
      'Peixes aparecem com escamas brilhantes e há cheiro forte perto de uma ponte com oficinas nas margens.',
    intro:
      'Lucas: "Gota Gi ligou — o rio está estranho." · Gota Gi: "Tem brilho na água perto da ponte." · Dra. Ana: "pH quase neutro afasta ácido forte; foquem no aspecto oleoso."',
    mapaLocais: [
      { id: 'ponte', label: 'Ponte', emoji: '🌉' },
      { id: 'margem', label: 'Margem', emoji: '🌿' },
      { id: 'oficina', label: 'Oficinas', emoji: '🔧' },
    ],
    pistas: [
      {
        id: 'a1',
        texto: 'pH medido: 7,1 — quase neutro.',
        miniPergunta: {
          tipo: 'escolha',
          pergunta: 'pH 7,1 sugere principalmente:',
          opcoes: ['Água fortemente ácida', 'Água próxima da neutralidade', 'Água muito básica'],
          correta: 1,
        },
      },
      {
        id: 'a2',
        texto: 'Filme iridescente na superfície da água.',
        miniPergunta: {
          tipo: 'parear',
          pergunta: 'Associe o sinal à hipótese mais provável:',
          pares: [
            { esquerda: 'Filme iridescente', direita: 'Hidrocarbonetos (óleo)' },
            { esquerda: 'Plantas murchas', direita: 'Metais pesados' },
            { esquerda: 'pH 3,5', direita: 'Efluente ácido' },
          ],
        },
      },
      { id: 'a3', texto: 'Plantas na margem com resíduo viscoso escuro.' },
      {
        id: 'a4',
        texto: 'Teste rápido de metais pesados: negativo.',
        miniPergunta: {
          tipo: 'escolha',
          pergunta: 'Metal pesado negativo afasta qual hipótese?',
          opcoes: ['Descarte de pilhas', 'Descarte de óleo', 'Microplásticos'],
          correta: 0,
        },
      },
      { id: 'a5', texto: 'Moradores relatam descarte de líquido na área de oficinas.' },
      { id: 'a6', texto: 'Aves aquáticas com penas engorduradas.' },
      { id: 'a7', texto: 'Turbidez baixa, mas odor de hidrocarboneto detectado.' },
    ],
    suspeitos: [
      'Descarte de óleo lubrificante de oficina',
      'Fertilizante agrícola',
      'Efluente ácido industrial',
      'Microplásticos de embalagens',
    ],
    descartes: [
      'Levar óleo para ecoponto/coleta especializada',
      'Jogar no ralo com água quente',
      'Misturar no lixo comum',
      'Queimar ao ar livre',
    ],
    testes: [
      {
        id: 'ph',
        nome: 'Teste de pH',
        personagem: 'Dra. Ana',
        resultado: 'pH ≈ 7. Não indica efluente fortemente ácido.',
        eliminaSuspeitos: ['Efluente ácido industrial'],
      },
      {
        id: 'metais',
        nome: 'Teste de metais',
        personagem: 'André',
        resultado: 'Sem Pb/Hg relevantes. Fonte provável não é bateria.',
        eliminaSuspeitos: ['Microplásticos de embalagens'],
      },
      {
        id: 'oleo',
        nome: 'Teste de filme superficial',
        personagem: 'André',
        resultado: 'Positivo para camada oleosa (hidrocarbonetos).',
        eliminaSuspeitos: [
          'Fertilizante agrícola',
          'Efluente ácido industrial',
          'Microplásticos de embalagens',
        ],
        destacaSuspeitos: ['Descarte de óleo lubrificante de oficina'],
        testeChave: true,
      },
    ],
    testeChaveId: 'oleo',
    gabarito: {
      suspeito: 'Descarte de óleo lubrificante de oficina',
      descarte: 'Levar óleo para ecoponto/coleta especializada',
    },
    explicacao:
      'Filme iridescente e resíduo viscoso indicam hidrocarbonetos (óleo). pH neutro afasta efluente ácido. Descarte correto: coleta especializada — nunca ralo ou queima.',
    aprendizados: [
      'Filme iridescente na água sugere óleo/hidrocarbonetos, não necessariamente pH ácido.',
      'Óleo usado deve ir ao ecoponto — nunca ralo, queima ou lixo comum.',
      'Oficinas mecânicas precisam de coleta especializada de lubrificantes.',
    ],
    dicas: [
      'Revise o que pH neutro diz sobre acidez extrema.',
      'Cruze filme iridescente com área de oficinas.',
      'Elimine suspeito: Efluente ácido industrial.',
    ],
    suspeitoEliminarDica3: 'Efluente ácido industrial',
  },
  {
    id: 'pilhas-solo',
    nome: 'Solo envenenado no Bairro Verde',
    emoji: '🔋',
    cenario: 'solo',
    topics: ['metais', 'agua_solo', 'reciclagem', 'sustentabilidade'],
    bncc: ['EM13CNT101', 'EF09CI03'],
    bnccTexto: 'Impacto de resíduos tecnológicos e metais pesados no solo.',
    contexto:
      'Plantas murcham em um terreno perto de lixeira comum onde aparecem pilhas e baterias.',
    intro:
      'Dra. Ana: "Chumbo no solo não some com chuva — vamos ao teste de metais." · Lucas: "A lixeira do bairro é nossa primeira pista." · Gabriel: "Plantas murchando é sinal de contaminação."',
    mapaLocais: [
      { id: 'lixeira', label: 'Lixeira', emoji: '🗑️' },
      { id: 'terreno', label: 'Terreno', emoji: '🌱' },
      { id: 'bairro', label: 'Bairro', emoji: '🏘️' },
    ],
    pistas: [
      {
        id: 'b1',
        texto: 'Análise indica presença de chumbo (Pb) no solo.',
        miniPergunta: {
          tipo: 'escolha',
          pergunta: 'Chumbo no solo costuma estar ligado a:',
          opcoes: ['Pilhas e baterias', 'Apenas plástico PET', 'Somente CO₂'],
          correta: 0,
        },
      },
      { id: 'b2', texto: 'pH local levemente ácido (5,8).' },
      {
        id: 'b3',
        texto: 'Crianças relatam pilhas no lixo comum.',
        miniPergunta: {
          tipo: 'parear',
          pergunta: 'Relacione resíduo ao risco ambiental:',
          pares: [
            { esquerda: 'Pilhas no lixo comum', direita: 'Metais pesados no solo' },
            { esquerda: 'Garrafa PET', direita: 'Microplástico (outro foco)' },
            { esquerda: 'Tinta seca', direita: 'Solventes (menos Pb)' },
          ],
        },
      },
      { id: 'b4', texto: 'Sem odor de hidrocarboneto forte.' },
      { id: 'b5', texto: 'Raízes das plantas com coloração escura anormal.' },
      { id: 'b6', texto: 'Lixeira sem coleta seletiva de eletrônicos.' },
      { id: 'b7', texto: 'Resíduo não biodegradável acumulado há meses.' },
    ],
    suspeitos: [
      'Descarte irregular de pilhas e baterias',
      'Fábrica de tintas',
      'Pesticida agrícola',
      'Garrafas PET',
    ],
    descartes: [
      'Ponto de coleta de eletrônicos / logística reversa',
      'Enterrar no quintal',
      'Queimar pilhas',
      'Jogar no lixo orgânico',
    ],
    testes: [
      {
        id: 'metais',
        nome: 'Teste de metais pesados',
        personagem: 'André',
        resultado: 'Pb detectado. Compatível com pilhas/baterias.',
        eliminaSuspeitos: ['Fábrica de tintas', 'Pesticida agrícola', 'Garrafas PET'],
        destacaSuspeitos: ['Descarte irregular de pilhas e baterias'],
        testeChave: true,
      },
      {
        id: 'ph',
        nome: 'Teste de pH do solo',
        personagem: 'Dra. Ana',
        resultado: 'pH ácido leve. Pode agravar mobilidade de metais.',
        eliminaSuspeitos: [],
      },
      {
        id: 'plastico',
        nome: 'Teste de polímero',
        personagem: 'André',
        resultado: 'PET presente, mas não explica Pb elevado sozinho.',
        eliminaSuspeitos: ['Garrafas PET'],
      },
    ],
    testeChaveId: 'metais',
    gabarito: {
      suspeito: 'Descarte irregular de pilhas e baterias',
      descarte: 'Ponto de coleta de eletrônicos / logística reversa',
    },
    explicacao:
      'Metais pesados como Pb vêm de pilhas e baterias. O descarte correto é coleta especializada (logística reversa), nunca lixo comum ou queima.',
    aprendizados: [
      'Metais pesados (Pb, Hg) vêm de pilhas e baterias descartadas incorretamente.',
      'Logística reversa e pontos de coleta evitam contaminação do solo e lençol.',
      'Lixo comum e queima liberam toxinas — nunca são solução.',
    ],
    dicas: [
      'Qual teste de laboratório apontou metal tóxico?',
      'Pb + lixeira sem seletiva sugere qual resíduo?',
      'Elimine suspeito: Garrafas PET.',
    ],
    suspeitoEliminarDica3: 'Garrafas PET',
  },
  {
    id: 'microplasticos',
    nome: 'Lagoa Espelho e os grãos invisíveis',
    emoji: '🧴',
    cenario: 'lago',
    topics: ['plasticos', 'agua_solo', 'reciclagem', 'sustentabilidade'],
    bncc: ['EM13CNT205', 'EF08CI09'],
    bnccTexto: 'Materiais sintéticos, microplásticos e impacto em ecossistemas aquáticos.',
    contexto:
      'Após festa na margem, peixes apresentam micropartículas no trato digestivo.',
    intro:
      'Gabriel: "Depois da festa, a lagoa ganhou grãos invisíveis." · Lucas: "Microplástico é pista séria." · Dra. Ana: "Vamos identificar o polímero — PET é suspeito."',
    mapaLocais: [
      { id: 'margem', label: 'Margem', emoji: '🏖️' },
      { id: 'festa', label: 'Área da festa', emoji: '🎉' },
      { id: 'rede', label: 'Rede de pesca', emoji: '🎣' },
    ],
    pistas: [
      {
        id: 'c1',
        texto: 'Microscópio: partículas sintéticas < 5 mm.',
        miniPergunta: {
          tipo: 'escolha',
          pergunta: 'Partículas plásticas menores que 5 mm são chamadas de:',
          opcoes: ['Microplásticos', 'Íons metálicos', 'Gases nobres'],
          correta: 0,
        },
      },
      {
        id: 'c2',
        texto: 'Identificação de polímero PET nas margens.',
        miniPergunta: {
          tipo: 'parear',
          pergunta: 'Associe material ao impacto:',
          pares: [
            { esquerda: 'PET fragmentado', direita: 'Microplásticos na água' },
            { esquerda: 'pH 3,5', direita: 'Efluente ácido' },
            { esquerda: 'Óleo de cozinha', direita: 'Camada oleosa' },
          ],
        },
      },
      { id: 'c3', texto: 'pH da lagoa: 7,0 (neutro).' },
      { id: 'c4', texto: 'Muitos copos e garrafas descartáveis na área.' },
      { id: 'c5', texto: 'Sem sinais de efluente ácido.' },
      { id: 'c6', texto: 'Rede de pesca com fibras plásticas antigas.' },
      { id: 'c7', texto: 'Detergente encontrado, mas concentração baixa.' },
    ],
    suspeitos: [
      'Descarte irregular de plásticos (PET)',
      'Efluente ácido de indústria',
      'Óleo de cozinha',
      'Fertilizante nitrogenado',
    ],
    descartes: [
      'Reduzir descartáveis + reciclar PET',
      'Enterrar plástico no jardim',
      'Queimar embalagens',
      'Jogar na lagoa para “diluir”',
    ],
    testes: [
      {
        id: 'micro',
        nome: 'Microscópio de plástico',
        personagem: 'André',
        resultado: 'Microplásticos confirmados. Origem: degradação de plástico.',
        eliminaSuspeitos: ['Efluente ácido de indústria', 'Óleo de cozinha', 'Fertilizante nitrogenado'],
        destacaSuspeitos: ['Descarte irregular de plásticos (PET)'],
        testeChave: true,
      },
      {
        id: 'ph',
        nome: 'Teste de pH',
        personagem: 'Dra. Ana',
        resultado: 'Neutro. Pouco compatível com ácido industrial forte.',
        eliminaSuspeitos: ['Efluente ácido de indústria'],
      },
      {
        id: 'polimero',
        nome: 'Teste de polímero',
        personagem: 'André',
        resultado: 'PET identificado nas amostras da margem.',
        eliminaSuspeitos: ['Óleo de cozinha', 'Fertilizante nitrogenado'],
        destacaSuspeitos: ['Descarte irregular de plásticos (PET)'],
      },
    ],
    testeChaveId: 'micro',
    gabarito: {
      suspeito: 'Descarte irregular de plásticos (PET)',
      descarte: 'Reduzir descartáveis + reciclar PET',
    },
    explicacao:
      'Microplásticos formam-se pela fragmentação do plástico. PET nas margens indica descarte inadequado. Solução: reduzir uso e reciclar corretamente.',
    aprendizados: [
      'Microplásticos são fragmentos plásticos menores que 5 mm.',
      'PET de copos e garrafas acumula nas margens se o descarte for irregular.',
      'Reduzir descartáveis e reciclar PET protege a vida aquática.',
    ],
    dicas: [
      'O que significa partícula sintética < 5 mm?',
      'PET aparece em qual tipo de lixo comum em festas?',
      'Elimine suspeito: Efluente ácido de indústria.',
    ],
    suspeitoEliminarDica3: 'Efluente ácido de indústria',
  },
  {
    id: 'efluente-acido',
    nome: 'Efluente na Foz do Córrego',
    emoji: '⚗️',
    cenario: 'agua',
    topics: ['ph', 'reacoes', 'agua_solo', 'sustentabilidade'],
    bncc: ['EM13CNT307', 'EF09CI02'],
    bnccTexto: 'Reações químicas, equilíbrio e alteração de pH em ecossistemas.',
    contexto:
      'Algas morrem em trecho próximo a tubulação; moradores culpam “chuva ácida” sem evidência.',
    intro:
      'Dra. Ana: "pH 3,5 mata algas — isso não é chuva comum." · Lucas: "Tubulação a montante merece inspeção." · André: "Sulfatos reforçam hipótese industrial."',
    mapaLocais: [
      { id: 'foz', label: 'Foz do córrego', emoji: '💧' },
      { id: 'tubo', label: 'Tubulação', emoji: '🔩' },
      { id: 'fabrica', label: 'Fábrica', emoji: '🏭' },
    ],
    pistas: [
      {
        id: 'd1',
        texto: 'pH medido: 3,5 — fortemente ácido.',
        miniPergunta: {
          tipo: 'escolha',
          pergunta: 'pH 3,5 indica meio:',
          opcoes: ['Ácido', 'Neutro', 'Básico'],
          correta: 0,
        },
      },
      { id: 'd2', texto: 'Mortandade de algas e peixes pequenos.' },
      {
        id: 'd3',
        texto: 'Sulfatos detectados na amostra.',
        miniPergunta: {
          tipo: 'parear',
          pergunta: 'Associe evidência à origem provável:',
          pares: [
            { esquerda: 'Sulfatos elevados', direita: 'Efluente industrial' },
            { esquerda: 'Chuva isolada', direita: 'pH variável regional' },
            { esquerda: 'Sal de cozinha', direita: 'Contaminação salina' },
          ],
        },
      },
      { id: 'd4', texto: 'Tubulação industrial a montante.' },
      { id: 'd5', texto: 'Chuva recente não alterou pH em áreas vizinhas.' },
      { id: 'd6', texto: 'Cheiro de produtos químicos de limpeza industrial.' },
      { id: 'd7', texto: 'Neutralização parcial relatada pela fábrica vizinha.' },
    ],
    suspeitos: [
      'Efluente ácido industrial sem tratamento',
      'Chuva ácida isolada',
      'Suinocultura',
      'Descarte de sal de cozinha',
    ],
    descartes: [
      'Tratamento/neutralização do efluente + fiscalização',
      'Despejar cal no rio sem controle',
      'Ignorar e aguardar diluição',
      'Canalizar para rua',
    ],
    testes: [
      {
        id: 'ph',
        nome: 'Teste de pH',
        personagem: 'Dra. Ana',
        resultado: 'pH 3,5. Fortemente ácido — incompatível com vida aquática.',
        eliminaSuspeitos: ['Chuva ácida isolada', 'Suinocultura', 'Descarte de sal de cozinha'],
        destacaSuspeitos: ['Efluente ácido industrial sem tratamento'],
        testeChave: true,
      },
      {
        id: 'sulfato',
        nome: 'Teste de sulfatos',
        personagem: 'André',
        resultado: 'Sulfatos elevados. Comum em efluentes industriais.',
        eliminaSuspeitos: ['Chuva ácida isolada', 'Suinocultura', 'Descarte de sal de cozinha'],
      },
      {
        id: 'metais',
        nome: 'Teste de metais',
        personagem: 'André',
        resultado: 'Metais detectáveis, mas pH é o dano principal aqui.',
        eliminaSuspeitos: ['Descarte de sal de cozinha'],
      },
    ],
    testeChaveId: 'ph',
    gabarito: {
      suspeito: 'Efluente ácido industrial sem tratamento',
      descarte: 'Tratamento/neutralização do efluente + fiscalização',
    },
    explicacao:
      'pH muito baixo (3,5) indica ácido forte, típico de efluente industrial mal tratado. Chuva ácida sozinha não explica pH tão extremo localizado. Tratamento e neutralização são obrigatórios.',
    aprendizados: [
      'pH abaixo de 7 indica meio ácido; valores muito baixos são letais para a vida aquática.',
      'Efluente industrial precisa de tratamento e neutralização antes do despejo.',
      'Chuva ácida isolada raramente explica pH extremo em um único ponto.',
    ],
    dicas: [
      'Interprete a escala de pH: abaixo de 7 é ácido.',
      'Compare chuva recente com pH local extremo.',
      'Elimine suspeito: Chuva ácida isolada.',
    ],
    suspeitoEliminarDica3: 'Chuva ácida isolada',
  },
]

export function getCaseById(id: string): GameCase | undefined {
  return CASES.find((c) => c.id === id)
}
