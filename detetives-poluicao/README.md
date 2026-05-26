# Detetives da Poluição

Jogo educativo de Química ambiental — **2º EM Técnico, Turma AALG** — Colégio Paulo de Tarso.

Interface premium com **cenário 3D**, animações e paleta de cores em fusão (React Three Fiber + Framer Motion).

**Equipe:** Lucas Lohan · Ana Flávia · André Soares · Gabriel Rosa — **Profª Maria**

---

## Jogar online

Após publicar na Vercel, acesse o link do projeto (ex.: `https://seu-projeto.vercel.app`).

- Senha da turma: `detetive01`
- PIN professor: `detetive01`
- QR code: `public/qr-jogo.png` (gerar com `npm run qr`)

---

## Documentação completa (PDF)

Toda a documentação escolar está em **`docs/`**:

| Documento | Arquivo HTML | PDF (após gerar) |
|-----------|--------------|------------------|
| Índice | [docs/index.html](docs/index.html) | `docs/pdf/00-indice-documentacao.pdf` |
| Documentação do jogo | `docs/01-documentacao-do-jogo.html` | `.pdf` |
| Manual da professora | `docs/02-manual-professor.html` | `.pdf` |
| Manual do aluno | `docs/03-manual-aluno.html` | `.pdf` |
| Relatório do projeto | `docs/04-relatorio-projeto.html` | `.pdf` |
| Gabaritos | `docs/05-gabaritos-casos.html` | `.pdf` |
| BNCC | `docs/06-bncc.html` | `.pdf` |
| Ficha de avaliação | `docs/07-ficha-avaliacao.html` | `.pdf` |
| Roteiro de aula | `docs/08-roteiro-aula.html` | `.pdf` |
| Documentação técnica | `docs/09-documentacao-tecnica.html` | `.pdf` |
| Pôster feira | `docs/10-poster-apresentacao.html` | `.pdf` |

### Gerar todos os PDFs automaticamente

```bash
cd detetives-poluicao
npm install
npm run docs:pdf
```

Os PDFs ficam em **`docs/pdf/`** — capa azul, tipografia profissional, pronto para imprimir ou entregar.

### Gerar PDF manualmente (sem script)

1. Abra qualquer `docs/*.html` no Chrome  
2. `Ctrl+P` (ou `Cmd+P`) → **Salvar como PDF**  
3. Marque **Gráficos de segundo plano**

Online (após deploy): `https://seu-link.vercel.app/docs/index.html`

---

## Desenvolvimento

```bash
cd detetives-poluicao
npm install
npm run dev
```

## Build e deploy

```bash
npm run build
```

Deploy na **Vercel** com repositório na raiz (`vercel.json` na raiz do repo aponta para `detetives-poluicao/dist`).

---

## Funcionalidades do jogo

- 4 casos investigativos com sorteio
- Dificuldade fácil / médio / difícil
- Laboratório virtual, dicas, pontuação
- Modo professor + exportação CSV
- PWA offline (celular)
