import { useCallback, useEffect, useState } from 'react'
import './App.css'
import { Header } from './components/Header'
import { LoginScreen } from './components/LoginScreen'
import { MenuScreen } from './components/MenuScreen'
import { TutorialScreen } from './components/TutorialScreen'
import { GameScreen } from './components/GameScreen'
import { ResultScreen } from './components/ResultScreen'
import { TeacherScreen } from './components/TeacherScreen'
import { AboutScreen } from './components/AboutScreen'
import { HistoryScreen } from './components/HistoryScreen'
import { getCaseById } from './data/cases'
import { SCHOOL } from './data/config'
import { buildReport, createSession, pickCase } from './lib/gameEngine'
import {
  loadFontSize,
  loadProfile,
  loadSoundEnabled,
  loadTeacherSettings,
  markTutorialSeen,
  saveFontSize,
  saveProfile,
  saveReport,
  saveSoundEnabled,
  setLastCaseId,
  getLastCaseId,
  wasTutorialSeen,
  type FontSize,
} from './lib/storage'
import { setSoundEnabled } from './lib/audio'
import type { Difficulty, GameSession, Report, Screen, StudentProfile } from './types'

function App() {
  const [screen, setScreen] = useState<Screen>('login')
  const [profile, setProfile] = useState<StudentProfile | null>(loadProfile)
  const [difficulty, setDifficulty] = useState<Difficulty>(
    () => loadTeacherSettings().dificuldadePadrao,
  )
  const [session, setSession] = useState<GameSession | null>(null)
  const [report, setReport] = useState<Report | null>(null)
  const [, setTick] = useState(0)
  const [soundOn, setSoundOn] = useState(loadSoundEnabled)
  const [fontSize, setFontSize] = useState<FontSize>(loadFontSize)

  useEffect(() => {
    setSoundEnabled(soundOn)
    saveSoundEnabled(soundOn)
  }, [soundOn])

  useEffect(() => {
    document.documentElement.dataset.font = fontSize
    saveFontSize(fontSize)
  }, [fontSize])

  useEffect(() => {
    if (screen !== 'game' || !session || session.finalizado) return
    const id = window.setInterval(() => setTick((t) => t + 1), 1000)
    return () => clearInterval(id)
  }, [screen, session])

  const tempoSegundos = session
    ? Math.floor((Date.now() - session.startedAt) / 1000)
    : 0

  const startGame = useCallback(
    (treino: boolean) => {
      const settings = loadTeacherSettings()
      const picked = pickCase(difficulty, settings.temasAtivos, getLastCaseId())
      setLastCaseId(picked.id)
      setSession(createSession(picked.id, difficulty, treino))
      setReport(null)
      setScreen('game')
    },
    [difficulty],
  )

  function handleLogin(nome: string, turma: string, diff: Difficulty) {
    const p: StudentProfile = {
      nome,
      turma,
      serie: SCHOOL.serie,
      criadoEm: new Date().toISOString(),
    }
    saveProfile(p)
    setProfile(p)
    setDifficulty(diff)
    if (!wasTutorialSeen()) {
      setScreen('tutorial')
    } else {
      setScreen('menu')
    }
  }

  function handleFinish(suspeito: string, descarte: string) {
    if (!session || !profile) return
    const gameCase = getCaseById(session.caseId)
    if (!gameCase) return
    const r = buildReport({
      aluno: profile.nome,
      turma: profile.turma,
      gameCase,
      session: { ...session, finalizado: true },
      suspeito,
      descarte,
      tempoSegundos,
    })
    if (!r.modoTreino) saveReport(r)
    setReport(r)
    setSession({ ...session, finalizado: true })
    setScreen('result')
  }

  function logout() {
    setProfile(null)
    setSession(null)
    setReport(null)
    setScreen('login')
  }

  const gameCase = session ? getCaseById(session.caseId) : null

  return (
    <main className="app">
      <Header compact={screen === 'game'} />

      {screen === 'login' && (
        <LoginScreen
          defaultDifficulty={loadTeacherSettings().dificuldadePadrao}
          onLogin={handleLogin}
          onTeacherAccess={() => setScreen('teacher')}
        />
      )}

      {screen === 'tutorial' && (
        <TutorialScreen
          onDone={() => {
            markTutorialSeen()
            setScreen('menu')
          }}
        />
      )}

      {screen === 'menu' && profile && (
        <MenuScreen
          profile={profile}
          soundOn={soundOn}
          fontSize={fontSize}
          onPlay={startGame}
          onTeacher={() => setScreen('teacher')}
          onAbout={() => setScreen('about')}
          onHistory={() => setScreen('history')}
          onTutorial={() => setScreen('tutorial')}
          onToggleSound={() => setSoundOn((v) => !v)}
          onFontSize={setFontSize}
          onLogout={logout}
        />
      )}

      {screen === 'game' && session && gameCase && (
        <GameScreen
          gameCase={gameCase}
          session={session}
          tempoSegundos={tempoSegundos}
          onUpdateSession={setSession}
          onFinish={handleFinish}
          onQuit={() => setScreen('menu')}
        />
      )}

      {screen === 'result' && report && getCaseById(report.casoId) && (
        <ResultScreen
          report={report}
          gameCase={getCaseById(report.casoId)!}
          onMenu={() => setScreen('menu')}
          onPlayAgain={() => startGame(report.modoTreino)}
        />
      )}

      {screen === 'teacher' && (
        <TeacherScreen onBack={() => setScreen(profile ? 'menu' : 'login')} />
      )}

      {screen === 'about' && <AboutScreen onBack={() => setScreen('menu')} />}

      {screen === 'history' && <HistoryScreen onBack={() => setScreen('menu')} />}
    </main>
  )
}

export default App
