import { useState } from 'react'
import {
  addStudentAccount,
  downloadAccountsCsv,
  exportAccountsJson,
  importAccountsCsv,
  importAccountsJson,
  loadStudentAccounts,
  removeStudentAccount,
  slugLogin,
  updateStudentPassword,
} from '../../lib/accounts'
import { playClick } from '../../lib/audio'
import { downloadJson } from '../../lib/storage'

export function StudentAccountsPanel() {
  const [accounts, setAccounts] = useState(() => loadStudentAccounts())
  const [nome, setNome] = useState('')
  const [login, setLogin] = useState('')
  const [senha, setSenha] = useState('')
  const [csv, setCsv] = useState('')
  const [msg, setMsg] = useState('')

  function refresh() {
    setAccounts(loadStudentAccounts())
  }

  async function cadastrar(e: React.FormEvent) {
    e.preventDefault()
    playClick()
    const res = await addStudentAccount({
      nome,
      login: login || undefined,
      senha,
    })
    if (!res.ok) {
      setMsg(res.error)
      return
    }
    setMsg(`Aluno cadastrado: ${res.account.nome} · login: ${res.account.login}`)
    setNome('')
    setLogin('')
    setSenha('')
    refresh()
  }

  async function importarCsv() {
    playClick()
    try {
      const n = await importAccountsCsv(csv)
      setCsv('')
      setMsg(`${n} aluno(s) importado(s).`)
      refresh()
    } catch {
      setMsg('CSV inválido. Use: nome,login,senha')
    }
  }

  async function importarJson() {
    playClick()
    try {
      const n = await importAccountsJson(csv)
      setCsv('')
      setMsg(`${n} conta(s) importada(s).`)
      refresh()
    } catch {
      setMsg('JSON inválido.')
    }
  }

  return (
    <section className="saas-accounts">
      <h3>Cadastro de alunos (login individual)</h3>
      <p className="saas-accounts-lead">
        Cada aluno entra apenas com <strong>usuário</strong> próprio. Cadastre aqui e distribua os
        logins em sala (lista impressa ou mensagem).
      </p>

      <form onSubmit={cadastrar} className="saas-accounts-form grid">
        <label>
          Nome completo
          <input
            value={nome}
            onChange={(e) => {
              setNome(e.target.value)
              if (!login) setLogin(slugLogin(e.target.value))
            }}
            placeholder="Maria Silva"
          />
        </label>
        <label>
          Usuário (login)
          <input
            value={login}
            onChange={(e) => setLogin(e.target.value.toLowerCase())}
            placeholder="maria.silva"
          />
        </label>
        <label>
          Senha inicial
          <input
            type="text"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="Mín. 4 caracteres"
          />
        </label>
        <button type="submit" className="btn-tech-primary">
          Cadastrar aluno
        </button>
      </form>

      {msg && <p className="ok-msg saas-accounts-msg">{msg}</p>}

      <div className="saas-accounts-actions">
        <button type="button" onClick={() => { playClick(); downloadAccountsCsv() }}>
          Baixar lista de logins
        </button>
        <button
          type="button"
          onClick={() => {
            playClick()
            downloadJson(JSON.parse(exportAccountsJson()), 'contas-alunos-backup.json')
          }}
        >
          Backup JSON
        </button>
      </div>

      <details className="saas-import">
        <summary>Importar turma (CSV ou JSON)</summary>
        <p className="saas-accounts-hint">
          CSV — uma linha por aluno: <code>nome,login,senha</code> ou <code>nome,senha</code> (login
          automático).
        </p>
        <textarea
          value={csv}
          onChange={(e) => setCsv(e.target.value)}
          placeholder={'Maria Silva,maria.silva,abc123\nJoão Souza,,joao2026'}
          rows={4}
        />
        <div className="saas-accounts-actions">
          <button type="button" className="btn-inst-secondary" onClick={importarCsv}>
            Importar CSV
          </button>
          <button type="button" className="btn-inst-secondary" onClick={importarJson}>
            Importar JSON (backup)
          </button>
        </div>
      </details>

      <div className="saas-table-wrap saas-accounts-table">
        <table className="saas-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Login</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {accounts.length === 0 ? (
              <tr>
                <td colSpan={3}>Nenhum aluno cadastrado neste navegador.</td>
              </tr>
            ) : (
              accounts.map((a) => (
                <tr key={a.id}>
                  <td>{a.nome}</td>
                  <td>
                    <code>{a.login}</code>
                  </td>
                  <td className="saas-accounts-row-actions">
                    <button
                      type="button"
                      onClick={async () => {
                        const nova = prompt(`Nova senha para ${a.nome}:`, '')
                        if (!nova) return
                        const ok = await updateStudentPassword(a.id, nova)
                        setMsg(ok ? `Senha de ${a.nome} atualizada.` : 'Senha muito curta (mín. 4).')
                      }}
                    >
                      Nova senha
                    </button>
                    <button
                      type="button"
                      className="danger"
                      onClick={() => {
                        if (confirm(`Remover ${a.nome}?`)) {
                          removeStudentAccount(a.id)
                          refresh()
                        }
                      }}
                    >
                      Remover
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <p className="saas-footer-hint">
        Contas ficam salvas neste navegador. No laboratório, cadastre uma vez no PC da sala. Em celulares,
        use &quot;Backup JSON&quot; no PC da professora e &quot;Importar JSON&quot; em cada aparelho (opcional).
      </p>
    </section>
  )
}
