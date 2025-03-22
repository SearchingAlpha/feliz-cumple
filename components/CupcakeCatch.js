'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import GameCompletion from '@/components/GameCompletion';
import '../app/globals.css';

export default function CupcakeCatch() {
  const router = useRouter();
  const gameRef = useRef(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30); // 30 second game
  
  // Game initialization
  function startGame() {
    setGameStarted(true);
    setScore(0);
    setTimeLeft(30);
    setGameCompleted(false);
  }
  
  // Timer effect
  useEffect(() => {
    if (!gameStarted) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timer);
          // Game over - player wins if they scored at least 15 points
          if (score >= 15) {
            setGameCompleted(true);
          }
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [gameStarted, score]);
  
  // Game placeholder UI
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-purple-100 to-pink-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold text-purple-600 mb-2 font-pixel">Cupcake Catch</h1>
          <p className="text-purple-500 mb-2">Catch falling cupcakes, avoid bombs!</p>
          
          {gameStarted && !gameCompleted && (
            <div className="flex justify-between mb-4">
              <p className="text-purple-500">Score: {score}</p>
              <p className="text-purple-500">Time: {timeLeft}s</p>
            </div>
          )}
        </div>
        
        {gameCompleted ? (
          <GameCompletion
            gameId="cupcakeCatch"
            score={score}
            scoreLabel="Score"
            customMessage="Sweet! You caught enough cupcakes!"
            onRestart={startGame}
          />
        ) : gameStarted ? (
          // Game area
          <div 
            ref={gameRef}
            className="h-96 bg-purple-50 rounded-lg border-4 border-purple-300 relative overflow-hidden"
            onClick={() => {
              // For demo purposes, clicking increases score
              setScore(prev => prev + 1);
              // Auto-complete if score reaches 20
              if (score + 1 >= 20) {
                setGameCompleted(true);
                setGameStarted(false);
              }
            }}
          >
            <div className="p-4 text-center text-purple-400 font-pixel">
              Click to catch cupcakes (demo)
            </div>
            
            {/* Placeholder cupcake */}
            <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-12 h-12">
              <div className="pixel-cupcake w-full h-full"></div>
            </div>
          </div>
        ) : (
          // Start game button
          <div className="text-center bg-white p-6 rounded-lg shadow-lg">
            <p className="text-purple-500 mb-6">
              Catch at least 15 cupcakes in 30 seconds to win!
            </p>
            <button
              onClick={startGame}
              className="px-6 py-3 bg-purple-500 text-white rounded-xl
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