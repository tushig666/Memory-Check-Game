import React from 'react';

const Modal = ({ show, onReplay, attempts, won, timeUp }) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="modal-win game-title font-pixel text-xl md:text-2xl lg:text-3xl">
        <h2 className="game-title font-pixel text-2xl md:text-3xl mb-2">
          {won ? 'You won! 🏆' : timeUp ? 'Time is up! ⏰' : ''}
        </h2>
        <div className="mb-4 game-title font-pixel text-lg md:text-xl">
          Attempts: {attempts}
        </div>
        <button
          className="font-pixel game-title text-lg md:text-xl px-8 py-3 rounded-2xl shadow-xl border-4 border-yellow-300 bg-gradient-to-r from-yellow-100 via-pink-100 to-purple-100 text-[#a21caf] tracking-widest hover:scale-105 transition-all duration-200 drop-shadow-lg"
          onClick={onReplay}
        >
          Play Again
        </button>
      </div>
    </div>
  );
};

export default Modal;
