import { useCallback, useEffect, useState } from 'react';
import StartScreen from './components/StartScreen';
import Hud from './components/Hud';
import GameCanvas from './components/GameCanvas';
import GameOver from './components/GameOver';
import Ranking from './components/Ranking';
import { getGameConfig, saveScore } from './services/api';
import './App.css';

const initialStats = {
  score: 0,
  lives: 3,
  wave: 1,
  paused: false
};

function App() {
  const [screen, setScreen] = useState('start');
  const [playerName, setPlayerName] = useState('');
  const [stats, setStats] = useState(initialStats);
  const [result, setResult] = useState({ score: 0, wave: 1 });
  const [gameKey, setGameKey] = useState(0);
  const [config, setConfig] = useState(null);
  const [saving, setSaving] = useState(false);
  const [alreadySaved, setAlreadySaved] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [saveError, setSaveError] = useState('');
  const [startedAt, setStartedAt] = useState(null);

  useEffect(() => {
    async function loadConfig() {
      try {
        const data = await getGameConfig();
        setConfig(data);
      } catch (error) {
        console.warn(error.message);
      }
    }

    loadConfig();
  }, []);

  function startGame(name) {
    setPlayerName(name);
    setStats(initialStats);
    setResult({ score: 0, wave: 1, duration: 0 });
    setAlreadySaved(false);
    setSaveMessage('');
    setSaveError('');
    setStartedAt(Date.now());
    setGameKey((currentKey) => currentKey + 1);
    setScreen('playing');
  }

  function restartGame() {
    setStats(initialStats);
    setResult({ score: 0, wave: 1, duration: 0 });
    setAlreadySaved(false);
    setSaveMessage('');
    setSaveError('');
    setStartedAt(Date.now());
    setGameKey((currentKey) => currentKey + 1);
    setScreen('playing');
  }

  function backToStart() {
    setStats(initialStats);
    setResult({ score: 0, wave: 1 });
    setAlreadySaved(false);
    setSaveMessage('');
    setSaveError('');
    setScreen('start');
  }

  function showRanking() {
    setScreen('ranking');
  }

  function backFromRanking() {
    setScreen(playerName ? 'gameover' : 'start');
  }

  async function handleSaveScore() {
    try {
      setSaving(true);
      setSaveError('');
      setSaveMessage('');

      const data = await saveScore({
        playerName,
        score: result.score,
        wave: result.wave,
        duration: result.duration
      });

      setAlreadySaved(true);
      setSaveMessage(data.message);
    } catch (error) {
      setSaveError(error.message);
    } finally {
      setSaving(false);
    }
  }

  const handleStatsChange = useCallback((newStats) => {
    setStats(newStats);
  }, []);

  const handlePauseChange = useCallback((paused) => {
    setStats((currentStats) => ({
      ...currentStats,
      paused
    }));
  }, []);

  const handleGameOver = useCallback((finalResult) => {
    const duration = startedAt ? Math.round((Date.now() - startedAt) / 1000) : 0;

    setResult({
      ...finalResult,
      duration
    });
    setScreen('gameover');
  }, [startedAt]);

  return (
    <main className="app">
      {screen === 'start' && (
        <StartScreen
          config={config}
          onStart={startGame}
          onShowRanking={showRanking}
        />
      )}

      {screen === 'playing' && (
        <section className="game-screen">
          <Hud
            playerName={playerName}
            score={stats.score}
            lives={stats.lives}
            wave={stats.wave}
            paused={stats.paused}
          />

          <GameCanvas
            key={gameKey}
            onStatsChange={handleStatsChange}
            onPauseChange={handlePauseChange}
            onGameOver={handleGameOver}
          />
        </section>
      )}

      {screen === 'gameover' && (
        <GameOver
          playerName={playerName}
          result={result}
          saving={saving}
          alreadySaved={alreadySaved}
          saveMessage={saveMessage}
          saveError={saveError}
          onSaveScore={handleSaveScore}
          onRestart={restartGame}
          onBackToStart={backToStart}
          onShowRanking={showRanking}
        />
      )}

      {screen === 'ranking' && <Ranking onBack={backFromRanking} />}
    </main>
  );
}

export default App;