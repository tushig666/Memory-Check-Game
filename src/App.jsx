import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import './App.css'

const EASY_EMOJIS = [
  '🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼'
];
const HARD_EMOJIS = [
  '🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯','🦁','🐮',
  '🐷','🐸','🐵','🐔','🐧','🐦','🐤','🦆','🦅','🦉','🦇','🐺','🐗'
]; // 25 unique emojis

function shuffle(array) {
  let arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const App = () => {
  const [mode, setMode] = useState(null); // null by default
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [attempts, setAttempts] = useState(0);
  const [won, setWon] = useState(false);
  const [timer, setTimer] = useState(60);
  const [isActive, setIsActive] = useState(false);
  const [timeUp, setTimeUp] = useState(false);
  const [started, setStarted] = useState(false);
  const [dark, setDark] = useState(false);

  const getEmojis = () => (mode === 'easy' ? EASY_EMOJIS : HARD_EMOJIS.slice(0, 13));
  const gridSize = mode === 'easy' ? 4 : 5;
  const totalCells = gridSize * gridSize;

  useEffect(() => {
    if (mode === null) return;
    const symbols = shuffle([...getEmojis(), ...getEmojis()]).slice(0, totalCells);
    setCards(symbols.map((symbol, i) => ({ id: i, symbol, flipped: false, matched: false })));
    setFlipped([]);
    setMatched([]);
    setAttempts(0);
    setWon(false);
    setTimer(mode === 'easy' ? 60 : 90);
    setIsActive(false);
    setTimeUp(false);
    setStarted(false);
  }, [mode]);

  useEffect(() => {
    if (!started) return;
    if (!isActive || won) return;
    if (timer === 0) {
      setIsActive(false);
      setTimeUp(true);
      setWon(false);
      return;
    }
    const interval = setInterval(() => setTimer(t => t - 1), 1000);
    return () => clearInterval(interval);
  }, [isActive, timer, won, started]);

  useEffect(() => {
    if (matched.length === totalCells) {
      setWon(true);
      setIsActive(false);
      setTimeUp(false);
    }
  }, [matched, totalCells]);

  const playMatchSound = () => {
    const audio = new window.Audio('/match.mp3');
    audio.volume = 0.7;
    audio.play();
  };

  const handleCardClick = (idx) => {
    if (flipped.length === 2 || cards[idx].flipped || cards[idx].matched) return;
    const newFlipped = [...flipped, idx];
    const newCards = cards.map((card, i) => i === idx ? { ...card, flipped: true } : card);
    setCards(newCards);
    setFlipped(newFlipped);
    if (newFlipped.length === 2) {
      setAttempts(a => a + 1);
      const [first, second] = newFlipped;
      if (newCards[first].symbol === newCards[second].symbol) {
        setTimeout(() => {
          setCards(cards => cards.map((card, i) =>
            i === first || i === second ? { ...card, matched: true } : card
          ));
          setMatched(m => [...m, first, second]);
          setFlipped([]);
          playMatchSound();
        }, 600);
      } else {
        setTimeout(() => {
          setCards(cards => cards.map((card, i) =>
            i === first || i === second ? { ...card, flipped: false } : card
          ));
          setFlipped([]);
        }, 900);
      }
    }
  };

  const handleStart = () => {
    setStarted(true);
    setIsActive(true);
  };
  const handleMode = (selected) => {
    setMode(selected);
  };
  const handleReplay = () => {
    setMode(null);
    setCards([]);
    setFlipped([]);
    setMatched([]);
    setAttempts(0);
    setWon(false);
    setTimer(0);
    setIsActive(false);
    setTimeUp(false);
    setStarted(false);
  };
  const handleToggleDark = () => {
    setDark((d) => !d);
    if (!dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <div className={`min-h-screen w-full flex flex-col items-center justify-center p-2 ${dark ? 'dark' : ''}`}
      style={{
        minHeight: '100vh',
        width: '100%',
        overflowX: 'hidden',
      }}
    >
      <div
        className="fixed inset-0 -z-10"
        style={{
          background: dark
            ? 'linear-gradient(120deg, #181a1b 0%, #23272e 50%, #334155 100%)'
            : 'linear-gradient(120deg, #f9fafb 0%, #c7d2fe 50%, #fbcfe8 100%)',
          minHeight: '100vh',
          width: '100vw',
        }}
      />
      <button
        className={`fixed top-6 right-6 z-50 bg-transparent border-none outline-none text-4xl md:text-5xl transition-transform hover:scale-110 flex items-center gap-2 font-pixel ${dark ? 'text-[#60a5fa]' : 'text-[#a21caf]'}`}
        style={{right: '1.5rem', top: '1.5rem', left: 'auto', position: 'fixed', filter: dark ? 'drop-shadow(0 0 8px #60a5fa)' : 'drop-shadow(0 0 8px #a21caf)'}}
        aria-label="Toggle dark mode"
        onClick={handleToggleDark}
      >
        {dark ? <><span role="img" aria-label="moon"></span> <span className="font-pixel text-lg md:text-xl">Blue</span></> : <><span role="img" aria-label="sun"></span> <span className="font-pixel text-lg md:text-xl">Pink</span></>}
      </button>
      {mode === null && (
        <>
          <h1 className="game-title font-pixel text-4xl md:text-5xl lg:text-6xl mb-8 mt-4 text-center">MEMORY MATCH GAME</h1>
          <div className="flex flex-col items-center gap-8 mb-8">
            <button
              className="font-pixel px-12 py-5 rounded-2xl shadow-xl border-4 border-yellow-300 bg-gradient-to-r from-yellow-100 via-pink-100 to-purple-100 text-4xl md:text-5xl tracking-widest text-[#a21caf] game-title hover:scale-105 transition-all duration-200 drop-shadow-lg"
              onClick={() => handleMode('easy')}
            >
              PLAY EASY
            </button>
            <button
              className="font-pixel px-12 py-5 rounded-2xl shadow-xl border-4 border-yellow-300 bg-gradient-to-r from-yellow-100 via-pink-100 to-purple-100 text-4xl md:text-5xl tracking-widest text-[#a21caf] game-title hover:scale-105 transition-all duration-200 drop-shadow-lg"
              onClick={() => handleMode('hard')}
            >
              PLAY HARD
            </button>
          </div>
        </>
      )}
      {mode !== null && (
        <>
          <h1 className="game-title font-pixel text-4xl md:text-5xl lg:text-6xl mb-8 mt-4 text-center">MEMORY MATCH GAME</h1>
          {!started && (
            <button
              className="font-pixel px-12 py-5 mb-8 rounded-2xl shadow-xl border-4 border-yellow-300 bg-gradient-to-r from-yellow-100 via-pink-100 to-purple-100 text-4xl md:text-5xl tracking-widest text-[#a21caf] game-title hover:scale-105 transition-all duration-200 drop-shadow-lg"
              onClick={handleStart}
            >
              START
            </button>
          )}
          <div className="flex flex-col md:flex-row gap-4 items-center mb-4">
            <div className="attempts-badge game-title font-pixel text-2xl md:text-3xl lg:text-4xl">Attempts: {attempts}</div>
            <div className="timer-badge game-title font-pixel text-2xl md:text-3xl lg:text-4xl px-6 py-2 rounded-xl shadow-lg bg-gradient-to-r from-yellow-200 via-pink-200 to-purple-200 text-[#a21caf] border-4 border-yellow-300 tracking-widest drop-shadow-lg flex items-center justify-center">
              TIME:{timer}s
            </div>
          </div>
          <div className={`grid gap-3 w-full ${gridSize === 4 ? 'grid-cols-4 max-w-md' : 'grid-cols-5 max-w-xl'}`}
            style={{ pointerEvents: started ? 'auto' : 'none', opacity: started ? 1 : 0.5, maxWidth: '100vw' }}>
            {cards.map((card, idx) => (
              <button
                key={card.id}
                className={`relative aspect-square w-full flex items-center justify-center text-3xl md:text-4xl lg:text-5xl font-pixel bg-white/80 hover:scale-110 transition-transform duration-300`}
                style={{ perspective: 600 }}
                onClick={() => handleCardClick(idx)}
                disabled={card.flipped || card.matched || !isActive}
              >
                {card.flipped || card.matched ? (
                  <span className="absolute inset-0 flex items-center justify-center">{card.symbol}</span>
                ) : (
                  <span className="absolute inset-0 flex items-center justify-center">❓</span>
                )}
              </button>
            ))}
          </div>
          <Modal show={won || timeUp} onReplay={handleReplay} attempts={attempts} won={won} timeUp={timeUp} />
        </>
      )}
    </div>
  );
}

export default App;
