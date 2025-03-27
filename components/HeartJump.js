'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import GameCompletion from '@/components/GameCompletion';

export default function HeartJump() {
  const router = useRouter();
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  
  // Game state - stored in ref to avoid re-renders during game loop
  const gameStateRef = useRef({
    heart: {
      x: 50,
      y: 200,
      width: 40,
      height: 40,
      jumping: false,
      ducking: false,
      jumpHeight: 0,
      jumpVelocity: 0,
      jumpSpeed: 15,
      gravity: 0.8
    },
    obstacles: [],
    ground: {
      y: 240,
      height: 20
    },
    speed: 5,
    baseSpeed: 5,
    maxSpeed: 12,
    speedIncrement: 0.001,
    obstacleTimer: 0,
    minObstacleInterval: 60,
    maxObstacleInterval: 150,
    score: 0,
    targetScore: 2000,
    running: false,
    lastFrame: 0,
    debugMode: false
  });
  
  // Set up game and canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Reset game state when component mounts
    gameStateRef.current = {
      ...gameStateRef.current,
      heart: {
        ...gameStateRef.current.heart,
        y: 200
      },
      obstacles: [],
      speed: gameStateRef.current.baseSpeed,
      score: 0,
      running: false
    };
    
    // Set up event listeners for keyboard controls
    const handleKeyDown = (e) => {
      if (!gameStateRef.current.running) return;
      
      if (e.key === 'ArrowUp' || e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        if (!gameStateRef.current.heart.jumping && !gameStateRef.current.heart.ducking) {
          gameStateRef.current.heart.jumping = true;
          gameStateRef.current.heart.jumpVelocity = gameStateRef.current.heart.jumpSpeed;
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (!gameStateRef.current.heart.jumping) {
          gameStateRef.current.heart.ducking = true;
          gameStateRef.current.heart.height = 20; // Smaller height when ducking
        }
      }
    };
    
    const handleKeyUp = (e) => {
      if (!gameStateRef.current.running) return;
      
      if (e.key === 'ArrowDown') {
        gameStateRef.current.heart.ducking = false;
        gameStateRef.current.heart.height = 40; // Restore normal height
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    // Canvas touch/click handler for mobile or mouse controls
    const handleCanvasClick = (e) => {
      if (!gameStateRef.current.running) return;
      
      // Determine if click is in top half (jump) or bottom half (duck)
      const rect = canvas.getBoundingClientRect();
      const y = e.clientY - rect.top;
      const canvasHeight = rect.height;
      
      if (y < canvasHeight / 2) {
        // Upper half - jump
        if (!gameStateRef.current.heart.jumping && !gameStateRef.current.heart.ducking) {
          gameStateRef.current.heart.jumping = true;
          gameStateRef.current.heart.jumpVelocity = gameStateRef.current.heart.jumpSpeed;
        }
      } else {
        // Lower half - duck
        if (!gameStateRef.current.heart.jumping) {
          gameStateRef.current.heart.ducking = true;
          gameStateRef.current.heart.height = 20;
          
          // Auto-release duck after short period for mobile
          setTimeout(() => {
            if (gameStateRef.current.heart.ducking) {
              gameStateRef.current.heart.ducking = false;
              gameStateRef.current.heart.height = 40;
            }
          }, 500);
        }
      }
    };
    
    canvas.addEventListener('click', handleCanvasClick);
    canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        handleCanvasClick({
          clientX: touch.clientX,
          clientY: touch.clientY
        });
      }
    });
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      canvas.removeEventListener('click', handleCanvasClick);
      canvas.removeEventListener('touchstart', handleCanvasClick);
    };
  }, []);
  
  // Main game loop
  useEffect(() => {
    if (!gameStarted) return;
    
    let animationId;
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const state = gameStateRef.current;
    state.running = true;
    state.lastFrame = performance.now();
    
    // Reset game state for new game
    state.heart.y = 200;
    state.obstacles = [];
    state.speed = state.baseSpeed;
    state.score = 0;
    state.obstacleTimer = 0;
    
    // Game loop function
    const gameLoop = (timestamp) => {
      if (!state.running) return;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Calculate time passed
      const deltaTime = timestamp - state.lastFrame;
      state.lastFrame = timestamp;
      
      // Update game state
      updateGameState(deltaTime);
      
      // Render game
      drawGame(ctx);
      
      // Check win condition
      if (state.score >= state.targetScore) {
        state.running = false;
        setGameWon(true);
        setScore(state.score);
        return;
      }
      
      // Continue loop
      animationId = requestAnimationFrame(gameLoop);
    };
    
    // Start game loop
    animationId = requestAnimationFrame(gameLoop);
    
    // Cleanup function
    return () => {
      cancelAnimationFrame(animationId);
      state.running = false;
    };
  }, [gameStarted]);
  
  const updateGameState = (deltaTime) => {
    const state = gameStateRef.current;
    
    // Update heart position (jumping or falling)
    if (state.heart.jumping) {
      state.heart.y -= state.heart.jumpVelocity;
      state.heart.jumpVelocity -= state.heart.gravity;
      
      // Check if heart has landed
      if (state.heart.y >= state.ground.y - state.heart.height) {
        state.heart.y = state.ground.y - state.heart.height;
        state.heart.jumping = false;
        state.heart.jumpVelocity = 0;
      }
    } else if (state.heart.y < state.ground.y - state.heart.height) {
      // Apply gravity if heart is above ground (for falling)
      state.heart.y += state.heart.gravity * 5;
      if (state.heart.y > state.ground.y - state.heart.height) {
        state.heart.y = state.ground.y - state.heart.height;
      }
    }
    
    // Update obstacle timer and spawn new obstacles
    state.obstacleTimer--;
    if (state.obstacleTimer <= 0) {
      // Generate a random interval before next obstacle
      state.obstacleTimer = Math.floor(
        Math.random() * (state.maxObstacleInterval - state.minObstacleInterval) 
        + state.minObstacleInterval
      );
      
      // Create a new obstacle
      const type = Math.random() < 0.3 ? 'flying' : 'ground';
      const height = type === 'flying' ? 30 : 30 + Math.random() * 20;
      const width = 30 + Math.random() * 20;
      
      // Flying obstacles appear higher up
      const y = type === 'flying' 
        ? state.ground.y - state.heart.height - height - 30 - Math.random() * 20 
        : state.ground.y - height;
      
      state.obstacles.push({
        x: canvas.width,
        y,
        width,
        height,
        type,
        passed: false
      });
    }
    
    // Increment speed gradually
    state.speed = Math.min(state.baseSpeed + (state.score / 100) * 0.5, state.maxSpeed);
    
    // Move obstacles and remove ones that have gone off screen
    for (let i = state.obstacles.length - 1; i >= 0; i--) {
      const obstacle = state.obstacles[i];
      
      // Move obstacle
      obstacle.x -= state.speed;
      
      // Check if heart has passed this obstacle
      if (!obstacle.passed && obstacle.x + obstacle.width < state.heart.x) {
        obstacle.passed = true;
        state.score += 10;
        setScore(state.score);
      }
      
      // Check collision with heart
      if (checkCollision(state.heart, obstacle)) {
        // Game over
        state.running = false;
        setGameOver(true);
        setScore(state.score);
        return;
      }
      
      // Remove obstacles that have gone off screen
      if (obstacle.x + obstacle.width < 0) {
        state.obstacles.splice(i, 1);
      }
    }
  };
  
  const drawGame = (ctx) => {
    const state = gameStateRef.current;
    
    // Draw sky background
    ctx.fillStyle = '#d3f0ff';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    // Draw ground
    ctx.fillStyle = '#c988d9';
    ctx.fillRect(0, state.ground.y, ctx.canvas.width, state.ground.height);
    
    // Draw dashes on the ground
    ctx.fillStyle = '#b86bc9';
    for (let i = 0; i < ctx.canvas.width; i += 30) {
      ctx.fillRect(i, state.ground.y, 15, 2);
    }
    
    // Draw heart character
    drawHeart(ctx, state.heart);
    
    // Draw obstacles
    for (const obstacle of state.obstacles) {
      drawObstacle(ctx, obstacle);
    }
    
    // Draw score
    ctx.fillStyle = '#ff6b8d';
    ctx.font = '16px "Press Start 2P", monospace';
    ctx.fillText(`Score: ${state.score}`, 10, 30);
    
    // Draw target score
    ctx.fillStyle = '#5F27CD';
    ctx.font = '12px "Press Start 2P", monospace';
    ctx.fillText(`Target: ${state.targetScore}`, 10, 50);
  };
  
  const drawHeart = (ctx, heart) => {
    if (heart.ducking) {
      // Draw ducking heart (flatter)
      ctx.fillStyle = '#ff6b8d';
      
      // Draw a simple heart shape that's flatter
      ctx.beginPath();
      ctx.moveTo(heart.x + heart.width / 2, heart.y + heart.height);
      
      // Left side
      ctx.bezierCurveTo(
        heart.x, heart.y + heart.height * 0.8,
        heart.x, heart.y,
        heart.x + heart.width / 2, heart.y + heart.height * 0.5
      );
      
      // Right side
      ctx.bezierCurveTo(
        heart.x + heart.width, heart.y,
        heart.x + heart.width, heart.y + heart.height * 0.8,
        heart.x + heart.width / 2, heart.y + heart.height
      );
      
      ctx.fill();
      
      // Add pixel-like details
      ctx.fillStyle = '#ff8da8';
      ctx.fillRect(heart.x + 10, heart.y + 5, 4, 4);
    } else {
      // Draw normal heart
      ctx.fillStyle = '#ff6b8d';
      
      // Draw a simple heart shape
      ctx.beginPath();
      ctx.moveTo(heart.x + heart.width / 2, heart.y + heart.height);
      
      // Left side
      ctx.bezierCurveTo(
        heart.x, heart.y + heart.height * 0.8,
        heart.x, heart.y,
        heart.x + heart.width / 2, heart.y + heart.height * 0.3
      );
      
      // Right side
      ctx.bezierCurveTo(
        heart.x + heart.width, heart.y,
        heart.x + heart.width, heart.y + heart.height * 0.8,
        heart.x + heart.width / 2, heart.y + heart.height
      );
      
      ctx.fill();
      
      // Add pixel-like details
      ctx.fillStyle = '#ff8da8';
      ctx.fillRect(heart.x + 10, heart.y + 10, 5, 5);
    }
  };
  
  const drawObstacle = (ctx, obstacle) => {
    // Draw a cute monster
    if (obstacle.type === 'flying') {
      // Flying monster
      ctx.fillStyle = '#54A0FF'; // Blue for flying monsters
      
      // Body
      ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
      
      // Wings
      ctx.fillRect(obstacle.x - 10, obstacle.y + obstacle.height / 3, 10, obstacle.height / 3);
      ctx.fillRect(obstacle.x + obstacle.width, obstacle.y + obstacle.height / 3, 10, obstacle.height / 3);
      
      // Eyes
      ctx.fillStyle = 'white';
      ctx.fillRect(obstacle.x + obstacle.width * 0.2, obstacle.y + obstacle.height * 0.2, 5, 5);
      ctx.fillRect(obstacle.x + obstacle.width * 0.6, obstacle.y + obstacle.height * 0.2, 5, 5);
      
      // Pupils
      ctx.fillStyle = 'black';
      ctx.fillRect(obstacle.x + obstacle.width * 0.2 + 2, obstacle.y + obstacle.height * 0.2 + 2, 2, 2);
      ctx.fillRect(obstacle.x + obstacle.width * 0.6 + 2, obstacle.y + obstacle.height * 0.2 + 2, 2, 2);
      
      // Mouth
      ctx.fillRect(obstacle.x + obstacle.width * 0.3, obstacle.y + obstacle.height * 0.6, obstacle.width * 0.4, 2);
    } else {
      // Ground monster
      ctx.fillStyle = '#1DD1A1'; // Green for ground monsters
      
      // Body
      ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
      
      // Spikes
      const spikeHeight = obstacle.height * 0.3;
      const spikeWidth = obstacle.width / 4;
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(obstacle.x + spikeWidth * i, obstacle.y);
        ctx.lineTo(obstacle.x + spikeWidth * (i + 0.5), obstacle.y - spikeHeight);
        ctx.lineTo(obstacle.x + spikeWidth * (i + 1), obstacle.y);
        ctx.fill();
      }
      
      // Eyes
      ctx.fillStyle = 'white';
      ctx.fillRect(obstacle.x + obstacle.width * 0.2, obstacle.y + obstacle.height * 0.2, 5, 5);
      ctx.fillRect(obstacle.x + obstacle.width * 0.6, obstacle.y + obstacle.height * 0.2, 5, 5);
      
      // Pupils
      ctx.fillStyle = 'black';
      ctx.fillRect(obstacle.x + obstacle.width * 0.2 + 2, obstacle.y + obstacle.height * 0.2 + 2, 2, 2);
      ctx.fillRect(obstacle.x + obstacle.width * 0.6 + 2, obstacle.y + obstacle.height * 0.2 + 2, 2, 2);
      
      // Mouth - angry
      ctx.beginPath();
      ctx.moveTo(obstacle.x + obstacle.width * 0.3, obstacle.y + obstacle.height * 0.6);
      ctx.lineTo(obstacle.x + obstacle.width * 0.5, obstacle.y + obstacle.height * 0.7);
      ctx.lineTo(obstacle.x + obstacle.width * 0.7, obstacle.y + obstacle.height * 0.6);
      ctx.stroke();
    }
  };
  
  const checkCollision = (heart, obstacle) => {
    // Adjust collision box for the heart (smaller than visual size)
    const heartBox = {
      x: heart.x + 10,
      y: heart.y + 10,
      width: heart.width - 20,
      height: heart.height - 20
    };
    
    // Check for collision using simple box collision
    return (
      heartBox.x < obstacle.x + obstacle.width &&
      heartBox.x + heartBox.width > obstacle.x &&
      heartBox.y < obstacle.y + obstacle.height &&
      heartBox.y + heartBox.height > obstacle.y
    );
  };
  
  const startGame = () => {
    setShowInstructions(false);
    setGameOver(false);
    setGameWon(false);
    setScore(0);
    setGameStarted(true);
  };
  
  const restartGame = () => {
    setGameOver(false);
    setGameWon(false);
    startGame();
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-pink-200 to-purple-200 p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold text-purple-600 mb-2 font-pixel">Heart Runner</h1>
          {!gameStarted && !gameOver && !gameWon && (
            <p className="text-purple-500 mb-2">Run, jump and duck to avoid monsters!</p>
          )}
          {(gameStarted || gameOver || gameWon) && (
            <p className="text-purple-500 mb-2">Score: {score} / {gameStateRef.current.targetScore}</p>
          )}
        </div>
        
        {showInstructions ? (
          <div className="text-center bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-pink-600 font-pixel">How to Play</h2>
            <div className="mb-4 flex flex-col items-start text-left space-y-3">
              <p className="flex items-center">
                <span className="inline-block w-8 h-8 mr-3 bg-pink-100 text-pink-600 font-bold rounded-full flex items-center justify-center">↑</span>
                <span>Press <b>UP ARROW</b> or tap top half of screen to jump</span>
              </p>
              <p className="flex items-center">
                <span className="inline-block w-8 h-8 mr-3 bg-pink-100 text-pink-600 font-bold rounded-full flex items-center justify-center">↓</span>
                <span>Press <b>DOWN ARROW</b> or tap bottom half to duck</span>
              </p>
              <p className="flex items-center">
                <span className="inline-block w-8 h-8 mr-3 bg-pink-100 text-pink-600 font-bold rounded-full flex items-center justify-center">🎯</span>
                <span>Reach <b>{gameStateRef.current.targetScore} points</b> to win!</span>
              </p>
              <p className="flex items-center">
                <span className="inline-block w-8 h-8 mr-3 bg-pink-100 text-pink-600 font-bold rounded-full flex items-center justify-center">⚠️</span>
                <span>Watch out for ground and flying monsters!</span>
              </p>
            </div>
            <button
              onClick={startGame}
              className="px-6 py-3 bg-pink-500 text-white rounded-xl
                        border-b-4 border-r-4 border-opacity-50 border-pink-800
                        hover:translate-y-1 hover:border-b-2 active:translate-y-2 active:border-b-0
                        font-pixel text-sm transition-all duration-200"
            >
              Start Game
            </button>
          </div>
        ) : gameOver ? (
          <div className="text-center bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-red-500 font-pixel">Game Over</h2>
            <p className="mb-4">You scored {score} points!</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={restartGame}
                className="px-6 py-3 bg-pink-500 text-white rounded-xl
                          border-b-4 border-r-4 border-opacity-50 border-pink-800
                          hover:translate-y-1 hover:border-b-2 active:translate-y-2 active:border-b-0
                          font-pixel text-sm transition-all duration-200"
              >
                Try Again
              </button>
              <button
                onClick={() => router.push('/hub')}
                className="px-6 py-3 bg-purple-500 text-white rounded-xl
                          border-b-4 border-r-4 border-opacity-50 border-purple-800
                          hover:translate-y-1 hover:border-b-2 active:translate-y-2 active:border-b-0
                          font-pixel text-sm transition-all duration-200"
              >
                Back to Hub
              </button>
            </div>
          </div>
        ) : gameWon ? (
          <GameCompletion
            gameId="heartJump"
            score={score}
            scoreLabel="Score"
            customMessage="Amazing! You reached the target score!"
            onRestart={restartGame}
          />
        ) : (
          <div className="relative bg-white p-1 rounded-lg shadow-lg border-4 border-purple-300">
            <canvas
              ref={canvasRef}
              width={640}
              height={320}
              className="w-full h-auto rounded-lg"
            />
            <div className="mt-4 flex justify-center space-x-4">
              <button
                onClick={() => router.push('/hub')}
                className="px-4 py-2 bg-purple-400 text-white rounded-lg
                          hover:bg-purple-500 transition-colors duration-200
                          font-pixel text-xs"
              >
                Back to Hub
              </button>
              <button
                onClick={restartGame}
                className="px-4 py-2 bg-pink-400 text-white rounded-lg
                          hover:bg-pink-500 transition-colors duration-200
                          font-pixel text-xs"
              >
                Restart
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}