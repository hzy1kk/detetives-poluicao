import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import './App.css'
import './styles/tokens.css'
import './styles/quiz-theme-reset.css'
import './styles/premium.css'
import './styles/quiz-ui.css'
import './styles/8bit-theme.css'
import './styles/teacher-saas.css'
import './styles/max-polish.css'
import { ensureStudentAccountsSeeded } from './lib/accounts'
import { LoginScreen } from './components/LoginScreen'
import { MenuScreen } from './components/MenuScreen'
import { TutorialScreen } from './components/TutorialScreen'
import { GameScreen } from './components/GameScreen'
import { ResultScreen } from './components/ResultScreen'
import { TeacherScreen } from './components/TeacherScreen'
import { AboutScreen } from './components/AboutScreen'
import { HistoryScreen } from './components/HistoryScreen'
import { RankingScreen } from './components/RankingScreen'
import { BootSplash } from './components/effects/BootSplash'
import { PageTransition } from './components/effects/PageTransition'
import { SoundFAB } from './components/effects/SoundFAB'
import { PixelBackground } from './components/scene/PixelBackground'
import { ParticleCanvas } from './components/effects/ParticleCanvas'

import { getCaseById } from './data/cases'
import { SCHOOL } from './data/config'
import { buildReport, createSession, pickCase } from './lib/gameEngine'
import {
  loadAmbientEnabled,
  loadFontSize,
  loadProfile,
  loadSoundEnabled,
  loadTeacherSettings,
  markBootShown,
  markTutorialSeen,
  saveAmbientEnabled,
  saveFontSize,
  saveProfile,
  clearProfile,
  saveReport,
  saveSoundEnabled,
  setLastCaseId,
  getLastCaseId,
  wasBootShownThisSession,
  wasTutorialSeen,
  type FontSize,
} from './lib/storage'
import {
  playWhoosh,
  resumeAudio,
  setSoundEnabled,
  startAmbient,
  stopAmbient,
} from './lib/audio'
import type { Difficulty, GameSession, Report, Screen, StudentAccount, StudentProfile } from './types'

function App() {
  const [booting, setBooting] = useState(() => !wasBootShownThisSession())
  const [screen, setScreen] = useState<Screen>(() => {
    const p = loadProfile()
    if (!p?.login) return 'login'
    return wasTutorialSeen() ? 'menu' : 'tutorial'
  })
  const [profile, setProfile] = useState<StudentProfile | null>(() => loadProfile())
  const [difficulty, setDifficulty] = useState<Difficulty>(
    () => loadTeacherSettings().dificuldadePadrao,
  )
  const [session, setSession] = useState<GameSession | null>(null)
  const [report, setReport] = useState<Report | null>(null)
  const [elapsedSec, setElapsedSec] = useState(0)
  const [soundOn, setSoundOn] = useState(loadSoundEnabled)
  const [ambientOn, setAmbientOn] = useState(loadAmbientEnabled)
  const [fontSize, setFontSize] = useState<FontSize>(loadFontSize)
  const prevScreen = useRef<Screen>(screen)

  const isTeacher = screen === 'teacher'
  const isQuiz = !isTeacher && !booting

  useEffect(() => {
    ensureStudentAccountsSeeded()
  }, [])

  useEffect(() => {
    document.documentElement.dataset.theme = isTeacher ? 'teacher' : 'quiz'
    document.documentElement.dataset.screen = screen
  }, [isTeacher, screen])

  function goTo(next: Screen) {
    if (next !== prevScreen.current) {
      playWhoosh()
      prevScreen.current = next
    }
    setScreen(next)
  }

  function finishBoot() {
    markBootShown()
    setBooting(false)
  }

  useEffect(() => {
    setSoundEnabled(soundOn)
    saveSoundEnabled(soundOn)
    if (!soundOn) stopAmbient()
  }, [soundOn])

  useEffect(() => {
    saveAmbientEnabled(ambientOn)
    if (isQuiz && soundOn && ambientOn && screen !== 'game') {
      startAmbient()
    } else {
      stopAmbient()
    }
    return () => stopAmbient()
  }, [isQuiz, soundOn, ambientOn, screen])

  useEffect(() => {
    document.documentElement.dataset.font = fontSize
    saveFontSize(fontSize)
  }, [fontSize])

  useEffect(() => {
    if (screen !== 'game' || !session || session.finalizado) {
      setElapsedSec(0)
      return
    }
    const tick = () =>
      setElapsedSec(Math.max(0, Math.floor((Date.now() - session.startedAt) / 1000)))
    tick()
    const id = window.setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [screen, session])

  const tempoSegundos = elapsedSec

  const startGame = useCallback(
    (treino: boolean) => {
      void resumeAudio()
      const settings = loadTeacherSettings()
      const picked = pickCase(difficulty, settings.temasAtivos, getLastCaseId())
      setLastCaseId(picked.id)
      setSession(createSession(picked.id, difficulty, treino))
      setReport(null)
      goTo('game')
    },
    [difficulty],
  )

  function handleLogin(account: StudentAccount, diff: Difficulty) {
    void resumeAudio()
    const p: StudentProfile = {
      id: account.id,
      login: account.login,
      nome: account.nome,
      turma: account.turma,
      serie: SCHOOL.serie,
      criadoEm: new Date().toISOString(),
    }
    saveProfile(p)
    setProfile(p)
    setDifficulty(diff)
    if (!wasTutorialSeen()) {
      goTo('tutorial')
    } else {
      goTo('menu')
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
    goTo('result')
  }

  function logout() {
    clearProfile()
    setProfile(null)
    setSession(null)
    setReport(null)
    goTo('login')
  }

  const gameCase = session ? getCaseById(session.caseId) : null

  if (booting) {
    return (
      <>
        <PixelBackground />
        <BootSplash onDone={finishBoot} />
      </>
    )
  }

  const showParticles =
    isQuiz && (screen === 'menu' || screen === 'result')

  return (
    <main className={`app app--${screen}`}>
      {isQuiz && <PixelBackground />}
      {showParticles && <ParticleCanvas density={32} />}

      {isQuiz && screen !== 'game' && (
        <SoundFAB
          soundOn={soundOn}
          ambientOn={ambientOn}
          onToggleSound={() => setSoundOn((v) => !v)}
          onToggleAmbient={() => setAmbientOn((v) => !v)}
        />
      )}

      <div className="app-content">
        <AnimatePresence mode="wait">
          {screen === 'login' && (
            <PageTransition screenKey="login">
              <LoginScreen
                defaultDifficulty={loadTeacherSettings().dificuldadePadrao}
                onLogin={handleLogin}
                onTeacherAccess={() => goTo('teacher')}
              />
            </PageTransition>
          )}

          {screen === 'tutorial' && profile && (
            <PageTransition screenKey="tutorial">
              <TutorialScreen
                profile={profile}
                onDone={() => {
                  markTutorialSeen()
                  goTo('menu')
                }}
                onNavigate={goTo}
              />
            </PageTransition>
          )}

          {screen === 'menu' && profile && (
            <PageTransition screenKey="menu">
              <MenuScreen
                profile={profile}
                fontSize={fontSize}
                onPlay={startGame}
                onTeacher={() => goTo('teacher')}
                onHistory={() => goTo('history')}
                onNavigate={goTo}
                onFontSize={setFontSize}
                onLogout={logout}
              />
            </PageTransition>
          )}

          {screen === 'game' && session && gameCase && (
            <PageTransition screenKey="game">
              <GameScreen
                gameCase={gameCase}
                session={session}
                tempoSegundos={tempoSegundos}
                onUpdateSession={setSession}
                onFinish={handleFinish}
                onQuit={() => goTo('menu')}
              />
            </PageTransition>
          )}

          {screen === 'result' && report && getCaseById(report.casoId) && (
            <PageTransition screenKey="result">
              <ResultScreen
                report={report}
                gameCase={getCaseById(report.casoId)!}
                onMenu={() => goTo('menu')}
                onPlayAgain={() => startGame(report.modoTreino)}
              />
            </PageTransition>
          )}

          {screen === 'teacher' && (
            <PageTransition screenKey="teacher">
              <TeacherScreen onBack={() => goTo(profile ? 'menu' : 'login')} />
            </PageTransition>
          )}

          {screen === 'about' && profile && (
            <PageTransition screenKey="about">
              <AboutScreen profile={profile} onNavigate={goTo} />
            </PageTransition>
          )}

          {screen === 'history' && profile && (
            <PageTransition screenKey="history">
              <HistoryScreen profile={profile} onNavigate={goTo} />
            </PageTransition>
          )}

          {screen === 'ranking' && profile && (
            <PageTransition screenKey="ranking">
              <RankingScreen profile={profile} onNavigate={goTo} />
            </PageTransition>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}

export default App
