'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import GameCompletion from '@/components/GameCompletion';
import '../app/globals.css';

export default function CupcakeCatch() {
  const router = useRouter();
  const gameRef = useRef(null);
  const basketRef = useRef(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30); // 30 second game
  const [fallingItems, setFallingItems] = useState([]);
  const [basketPosition, setBasketPosition] = useState(50); // 0-100%
  
  // Game initialization
  function startGame() {
    setGameStarted(true);
    setScore(0);
    setTimeLeft(30);
    setGameCompleted(false);
    setFallingItems([]);
    setBasketPosition(50);
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
  
  // Generate falling items (cupcakes and bombs)
  useEffect(() => {
    if (!gameStarted || gameCompleted) return;
    
    const generateInterval = setInterval(() => {
      // Generate a new falling item
      const newItem = {
        id: Date.now(),
        type: Math.random() > 0.2 ? 'cupcake' : 'bomb', // 80% cupcakes, 20% bombs
        position: Math.random() * 100, // Random horizontal position (0-100%)
        speed: 3 + Math.random() * 2, // Random speed
        topPosition: 0, // Start at the top
      };
      
      setFallingItems(prevItems => [...prevItems, newItem]);
    }, 1000); // Generate new item every second
    
    return () => clearInterval(generateInterval);
  }, [gameStarted, gameCompleted]);
  
  // Move falling items and detect collisions
  useEffect(() => {
    if (!gameStarted || gameCompleted || fallingItems.length === 0) return;
    
    const moveInterval = setInterval(() => {
      setFallingItems(prevItems => {
        const updatedItems = prevItems.map(item => ({
          ...item,
          topPosition: item.topPosition + item.speed,
        })).filter(item => item.topPosition < 100); // Remove items past the bottom
        
        // Check for collisions with the basket
        const basketLeft = basketPosition - 10; // Basket width is 20%
        const basketRight = basketPosition + 10;
        const basketTop = 90; // Fixed vertical position near bottom
        
        // Get only the newly collected items to avoid duplicate scoring
        const collectedItems = updatedItems.filter(item => {
          const withinBasketHorizontally = item.position >= basketLeft && item.position <= basketRight;
          const withinBasketVertically = item.topPosition >= basketTop && item.topPosition < 100;
          return withinBasketHorizontally && withinBasketVertically;
        });
        
        // Update score and filter out collected items
        if (collectedItems.length > 0) {
          collectedItems.forEach(item => {
            if (item.type === 'cupcake') {
              setScore(prevScore => prevScore + 1);
              // Check for win condition
              if (score + 1 >= 15) {
                setGameCompleted(true);
              }
            } else {
              // Bomb reduces score
              setScore(prevScore => Math.max(0, prevScore - 2));
            }
          });
          
          // Remove collected items
          return updatedItems.filter(item => !collectedItems.includes(item));
        }
        
        return updatedItems;
      });
    }, 100); // Move items every 100ms
    
    return () => clearInterval(moveInterval);
  }, [gameStarted, gameCompleted, fallingItems, basketPosition, score]);
  
  // Handle keyboard and touch controls for basket
  useEffect(() => {
    if (!gameStarted || gameCompleted) return;
    
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        setBasketPosition(prev => Math.max(10, prev - 5));
      } else if (e.key === 'ArrowRight') {
        setBasketPosition(prev => Math.min(90, prev + 5));
      }
    };
    
    // Handle mouse/touch movement
    const handleMouseMove = (e) => {
      if (!gameRef.current) return;
      
      const rect = gameRef.current.getBoundingClientRect();
      const relativeX = e.clientX - rect.left;
      const newPosition = (relativeX / rect.width) * 100;
      setBasketPosition(Math.min(90, Math.max(10, newPosition)));
    };
    
    window.addEventListener('keydown', handleKeyDown);
    if (gameRef.current) {
      gameRef.current.addEventListener('mousemove', handleMouseMove);
      gameRef.current.addEventListener('touchmove', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        handleMouseMove({ clientX: touch.clientX });
      });
    }
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (gameRef.current) {
        gameRef.current.removeEventListener('mousemove', handleMouseMove);
        gameRef.current.removeEventListener('touchmove', handleMouseMove);
      }
    };
  }, [gameStarted, gameCompleted]);
  
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
          >
            {/* Instructions */}
            <div className="absolute top-2 left-0 right-0 text-center text-purple-400 font-pixel text-xs">
              Use arrow keys or mouse to move basket
            </div>
            
            {/* Render falling items */}
            {fallingItems.map(item => (
              <div
                key={item.id}
                className={`absolute w-8 h-8 ${item.type === 'cupcake' ? 'text-pink-500' : 'text-gray-800'}`}
                style={{
                  left: `${item.position}%`,
                  top: `${item.topPosition}%`,
                  transform: 'translateX(-50%)',
                }}
              >
                {item.type === 'cupcake' ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-6 h-6 bg-pink-400 rounded-t-lg relative">
                      {/* Cupcake icing */}
                      <div className="absolute -top-2 left-0 right-0 h-3 bg-pink-300 rounded-t-lg"></div>
                      {/* Cupcake frosting */}
                      <div className="absolute -top-4 left-1 right-1 h-4 bg-pink-200 rounded-full"></div>
                      {/* Cherry on top */}
                      <div className="absolute -top-5 left-2 w-2 h-2 bg-red-500 rounded-full"></div>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-6 h-6 bg-gray-800 rounded-full relative">
                      {/* Bomb fuse */}
                      <div className="absolute -top-3 left-2 w-2 h-3 bg-gray-600 transform -rotate-15"></div>
                      {/* Bomb sparkle */}
                      <div className="absolute -top-4 left-2 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {/* Basket */}
            <div 
              ref={basketRef}
              className="absolute bottom-2 w-16 h-10"
              style={{ left: `${basketPosition}%`, transform: 'translateX(-50%)' }}
            >
              <div className="w-full h-full rounded-lg bg-yellow-800 relative">
                {/* Basket handle */}
                <div className="absolute -top-4 left-1/4 right-1/4 h-4 w-8 border-t-4 border-yellow-800 rounded-t-full"></div>
                {/* Basket decoration */}
                <div className="absolute top-1 left-1 right-1 h-2 bg-yellow-700 rounded"></div>
              </div>
            </div>
          </div>
        ) : (
          // Start game button
          <div className="text-center bg-white p-6 rounded-lg shadow-lg">
            <p className="text-purple-500 mb-6">
              Catch at least 15 cupcakes in 30 seconds to win!<br/>
              Be careful - bombs will reduce your score!
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