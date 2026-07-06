import { useCallback, useState } from 'react';
import StartScreen from './components/StartScreen';
import Hud from './components/Hud';
import GameCanvas from './components/GameCanvas';
import GameOver from './components/GameOver';
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

  function startGame(name) {
    setPlayerName(name);
    setStats(initialStats);
    setResult({ score: 0, wave: 1 });
    setGameKey((currentKey) => currentKey + 1);
    setScreen('playing');
  }

  function restartGame() {
    setStats(initialStats);
    setResult({ score: 0, wave: 1 });
    setGameKey((currentKey) => currentKey + 1);
    setScreen('playing');
  }

  function backToStart() {
    setStats(initialStats);
    setResult({ score: 0, wave: 1 });
    setScreen('start');
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

  return (
    <main className="app">
      {screen === 'start' && <StartScreen onStart={startGame} />}

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
          onRestart={restartGame}
          onBackToStart={backToStart}
        />
      )}
    </main>
  );
}

export default App;