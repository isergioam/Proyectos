import { useCallback, useEffect, useState } from 'react';
import StartScreen from './components/StartScreen';
import Hud from './components/Hud';
import RunnerCanvas from './components/RunnerCanvas';
import GameOver from './components/GameOver';
import Ranking from './components/Ranking';
import LoadingScreen from './components/LoadingScreen';
import { getGameConfig, saveScore } from './services/api';
import { playSound, preloadSounds } from './game/sounds';
import { preloadImages } from './game/assets';
import './App.css';

const initialStats = {
  score: 0,
  distance: 0,
  speed: 1,
  paused: false
};

const initialResult = {
  score: 0,
  distance: 0,
  speed: 1
};

function App() {
  const [screen, setScreen] = useState('start');
  const [playerName, setPlayerName] = useState('');
  const [stats, setStats] = useState(initialStats);
  const [result, setResult] = useState(initialResult);
  const [gameKey, setGameKey] = useState(0);
  const [config, setConfig] = useState(null);
  const [saving, setSaving] = useState(false);
  const [alreadySaved, setAlreadySaved] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [saveError, setSaveError] = useState('');
  const [assetsReady, setAssetsReady] = useState(false);

  useEffect(() => {
    preloadSounds();

    async function loadAssets() {
      try {
        await preloadImages();
      } finally {
        setAssetsReady(true);
      }
    }

    loadAssets();

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
    setResult(initialResult);
    setAlreadySaved(false);
    setSaveMessage('');
    setSaveError('');
    setGameKey((currentKey) => currentKey + 1);
    setScreen('playing');
  }

  function restartGame() {
    setStats(initialStats);
    setResult(initialResult);
    setAlreadySaved(false);
    setSaveMessage('');
    setSaveError('');
    setGameKey((currentKey) => currentKey + 1);
    setScreen('playing');
  }

  function backToStart() {
    setStats(initialStats);
    setResult(initialResult);
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
        distance: result.distance,
        speed: result.speed
      });

      setAlreadySaved(true);
      setSaveMessage(data.message);
      playSound('save');
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
    setResult(finalResult);
    setScreen('gameover');
  }, []);

  if (!assetsReady) {
    return <LoadingScreen />;
  }

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
            distance={stats.distance}
            speed={stats.speed}
            paused={stats.paused}
          />

          <RunnerCanvas
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