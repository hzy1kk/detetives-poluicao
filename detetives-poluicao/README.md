# Detetives da Poluição

Jogo educativo de Química ambiental — **2º EM Técnico, Turma AALG** — Colégio Paulo de Tarso.

Interface **3D premium** (React Three Fiber) · Nota **50/50** · Ranking · QR code · Celebração por desempenho.

**Equipe:** Lucas Lohan · Dra. Ana Flávia · André Soares · Gabriel Rosa — **Profª Maria**

---

## Jogar online

**https://detetives-poluicao.vercel.app**

| Item | Valor |
|------|--------|
| Senha da turma | `detetive01` |
| PIN professor | `detetive01` |
| Turma | AALG |

![QR Code](./public/qr-jogo.png)

---

## Aula sugerida

- **15 min** — jogo individual (celular ou computador)
- **10 min** — explicação com os 3 aprendizados na tela final
- **Nota mensal** até o fim do ano: 50% poluente + 50% descarte

---

## Documentação (PDF)

| # | Documento | PDF |
|---|-----------|-----|
| 00 | Índice | [docs/pdf/00-indice-documentacao.pdf](docs/pdf/00-indice-documentacao.pdf) |
| 01 | Documentação do jogo | `docs/pdf/01-...` |
| 02 | Manual da professora | `docs/pdf/02-...` |
| 03 | Manual do aluno | `docs/pdf/03-...` |
| 04 | Relatório do projeto | `docs/pdf/04-...` |
| 05 | Gabaritos | `docs/pdf/05-...` |
| 06 | BNCC | `docs/pdf/06-...` |
| 07 | Ficha de avaliação | `docs/pdf/07-...` |
| 08 | Roteiro de aula | `docs/pdf/08-...` |
| 09 | Documentação técnica | `docs/pdf/09-...` |
| 10 | Pôster + QR | `docs/pdf/10-...` |

**Online:** `/docs/index.html` · **No menu do jogo:** Documentação PDF

### Regenerar PDFs e QR

```bash
cd detetives-poluicao
npm install
npm run qr          # public/qr-jogo.png + docs/assets/
npm run docs:pdf    # docs/pdf/*.pdf
```

---

## Desenvolvimento

```bash
npm install
npm run dev
npm run build
```

Deploy: repositório na raiz com `vercel.json` → `detetives-poluicao/dist`

---

## Funcionalidades

- 4 casos investigativos · Dra. Ana · falas fixas
- Cenário 3D + celebração (excelente / bom / parcial / reforço)
- Dica automática ao errar
- Ranking turma AALG
- Painel simples da professora (Excel)
- PWA offline
