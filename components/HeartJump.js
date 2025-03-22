'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import GameCompletion from '@/components/GameCompletion';
import '../app/globals.css';

export default function HeartJump() {
  const router = useRouter();
  const gameRef = useRef(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [heartsCollected, setHeartsCollected] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [playerPosition, setPlayerPosition] = useState(50); // 0-100 percentage
  
  // Game initialization
  function startGame() {
    setGameStarted(true);
    setHeartsCollected(0);
    setPlayerPosition(50);
    setGameCompleted(false);
  }
  
  // Handle keyboard input for demo
  useEffect(() => {
    if (!gameStarted) return;
    
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        setPlayerPosition(prev => Math.max(prev - 10, 0));
      } else if (e.key === 'ArrowRight') {
        setPlayerPosition(prev => Math.min(prev + 10, 100));
      } else if (e.key === ' ' || e.key === 'ArrowUp') {
        // Jump - for demo just collect a heart
        setHeartsCollected(prev => prev + 1);
        
        // Auto-complete if player collects 10 hearts
        if (heartsCollected + 1 >= 10) {
          setGameCompleted(true);
          setGameStarted(false);
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameStarted, heartsCollected]);
  
  // Game placeholder UI
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-red-100 to-pink-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold text-red-600 mb-2 font-pixel">Heart Jump</h1>
          <p className="text-red-500 mb-2">Jump to collect hearts!</p>
          
          {gameStarted && !gameCompleted && (
            <div className="flex justify-between mb-4">
              <p className="text-red-500">Hearts: {heartsCollected}/10</p>
            </div>
          )}
        </div>
        
        {gameCompleted ? (
          <GameCompletion
            gameId="heartJump"
            score={heartsCollected}
            scoreLabel="Hearts Collected"
            customMessage="Amazing! You collected all the hearts!"
            onRestart={startGame}
          />
        ) : gameStarted ? (
          // Game area
          <div 
            ref={gameRef}
            className="h-96 bg-red-50 rounded-lg border-4 border-red-300 relative overflow-hidden"
          >
            <div className="p-4 text-center text-red-400 font-pixel">
              Use arrows to move, space to jump
            </div>
            
            {/* Player character */}
            <div 
              className="absolute bottom-8 w-8 h-12 transition-all duration-150"
              style={{ left: `calc(${playerPosition}% - 16px)` }}
            >
              <div className="bg-red-400 w-full h-full rounded-lg"></div>
            </div>
            
            {/* Placeholder heart */}
            <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-8 h-8">
              <div className="pixel-heart w-full h-full"></div>
            </div>
          </div>
        ) : (
          // Start game button
          <div className="text-center bg-white p-6 rounded-lg shadow-lg">
            <p className="text-red-500 mb-6">
              Collect 10 hearts to complete the game!
            </p>
            <button
              onClick={startGame}
              className="px-6 py-3 bg-red-500 text-white rounded-xl
                        border-b-4 border-r-4 border-opacity-50 border-black
                        hover:translate-y-1 hover:border-b-2 active:translate-y-2 active:border-b-0
                        font-pixel text-sm transition-all duration-200"
            >
              Start Game
            </button>
          </div>
        )}
      </div>
    </div>
  );
}