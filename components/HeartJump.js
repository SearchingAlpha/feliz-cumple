'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function HeartJump() {
  const router = useRouter();
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState('notStarted'); // notStarted, playing, gameOver, completed
  const [score, setScore] = useState(0);
  const gameLoopRef = useRef(null);
  
  // Simple game variables - kept in one place for easier management
  const heartX = 100;
  const groundY = 350;
  const targetScore = 10;
  
  // Game state
  const gameData = useRef({
    heartY: 300,
    jumping: false,
    jumpVelocity: 0,
    obstacles: [],
    score: 0
  });

  // Start game function
  const startGame = () => {
    setGameState('playing');
    setScore(0);
    
    // Reset game data
    gameData.current = {
      heartY: 300,
      jumping: false,
      jumpVelocity: 0,
      obstacles: [],
      score: 0
    };
    
    // Get canvas context
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set up jump handler
    const jumpHandler = () => {
      if (!gameData.current.jumping) {
        gameData.current.jumping = true;
        gameData.current.jumpVelocity = 15;
      }
    };
    
    // Add event listeners
    window.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'ArrowUp') jumpHandler();
    });
    canvas.addEventListener('click', jumpHandler);
    
    // Game loop
    let frameCount = 0;
    
    function gameLoop() {
      if (gameState !== 'playing') return;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw background
      ctx.fillStyle = '#d3f0ff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw ground
      ctx.fillStyle = '#c988d9';
      ctx.fillRect(0, groundY, canvas.width, canvas.height - groundY);
      
      // Update heart position (jumping)
      if (gameData.current.jumping) {
        gameData.current.heartY -= gameData.current.jumpVelocity;
        gameData.current.jumpVelocity -= 0.8;
        
        if (gameData.current.heartY >= 300) {
          gameData.current.heartY = 300;
          gameData.current.jumping = false;
        }
      }
      
      // Draw heart
      ctx.fillStyle = '#ff6b8d';
      ctx.beginPath();
      ctx.arc(heartX, gameData.current.heartY, 20, 0, Math.PI * 2);
      ctx.fill();
      
      // Generate obstacle
      frameCount++;
      if (frameCount % 100 === 0) {
        gameData.current.obstacles.push({
          x: canvas.width,
          width: 30,
          height: 30,
          counted: false
        });
      }
      
      // Update obstacles
      for (let i = gameData.current.obstacles.length - 1; i >= 0; i--) {
        const obstacle = gameData.current.obstacles[i];
        
        // Move obstacle
        obstacle.x -= 5;
        
        // Draw obstacle
        ctx.fillStyle = 'green';
        ctx.fillRect(obstacle.x, groundY - obstacle.height, obstacle.width, obstacle.height);
        
        // Check collision
        if (
          heartX + 20 > obstacle.x && 
          heartX - 20 < obstacle.x + obstacle.width &&
          gameData.current.heartY + 20 > groundY - obstacle.height
        ) {
          // Game over
          setGameState('gameOver');
          return;
        }
        
        // Check if passed obstacle
        if (!obstacle.counted && obstacle.x < heartX - 20) {
          obstacle.counted = true;
          gameData.current.score++;
          setScore(gameData.current.score);
          
          // Check win condition
          if (gameData.current.score >= targetScore) {
            // Save completion to localStorage
            try {
              const gameState = JSON.parse(localStorage.getItem('gameState') || '{}');
              gameState.heartJump = true;
              localStorage.setItem('gameState', JSON.stringify(gameState));
            } catch (error) {
              console.error("Error saving game state:", error);
            }
            
            setGameState('completed');
            return;
          }
        }
        
        // Remove off-screen obstacles
        if (obstacle.x + obstacle.width < 0) {
          gameData.current.obstacles.splice(i, 1);
        }
      }
      
      // Draw score
      ctx.fillStyle = 'black';
      ctx.font = '20px Arial';
      ctx.fillText(`Score: ${gameData.current.score} / ${targetScore}`, 20, 30);
      
      // Continue loop
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }
    
    // Start game loop
    gameLoopRef.current = requestAnimationFrame(gameLoop);
  };
  
  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-pink-200 to-purple-200 p-4">
      <h1 className="text-3xl font-bold text-purple-600 mb-6 font-pixel">Heart Jump</h1>
      
      {/* Game Canvas - always render it but hide when not playing */}
      <div className={`w-full max-w-2xl ${gameState === 'playing' ? 'block' : 'hidden'}`}>
        <canvas 
          ref={canvasRef} 
          width={800} 
          height={400} 
          className="border-4 border-purple-300 rounded-lg w-full bg-white"
        />
      </div>
      
      {/* Start Screen */}
      {gameState === 'notStarted' && (
        <div className="text-center bg-white p-6 rounded-lg shadow-lg">
          <p className="text-purple-500 mb-6">
            Press any key or tap to jump over obstacles!
          </p>
          <button
            onClick={startGame}
            className="px-6 py-3 bg-pink-500 text-white rounded-xl font-pixel"
          >
            Start Game
          </button>
        </div>
      )}
      
      {/* Game Over Screen */}
      {gameState === 'gameOver' && (
        <div className="text-center bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-red-500">Game Over</h2>
          <p className="mb-4">You scored {score} points</p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={startGame}
              className="px-6 py-3 bg-pink-500 text-white rounded-xl font-pixel"
            >
              Play Again
            </button>
            <button
              onClick={() => router.push('/hub')}
              className="px-6 py-3 bg-purple-500 text-white rounded-xl font-pixel"
            >
              Back to Hub
            </button>
          </div>
        </div>
      )}
      
      {/* Win Screen */}
      {gameState === 'completed' && (
        <div className="text-center bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-green-500">You Win!</h2>
          <p className="mb-4">Congratulations! You completed the game!</p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={startGame}
              className="px-6 py-3 bg-pink-500 text-white rounded-xl font-pixel"
            >
              Play Again
            </button>
            <button
              onClick={() => router.push('/hub')}
              className="px-6 py-3 bg-purple-500 text-white rounded-xl font-pixel"
            >
              Back to Hub
            </button>
          </div>
        </div>
      )}
    </div>
  );
}