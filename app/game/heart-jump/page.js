'use client';
// pages/heart-jump.js
import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/navigation';

export default function HeartJump() {
  const router = useRouter();
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [heartsCollected, setHeartsCollected] = useState(0);
  const scoreRef = useRef(0);
  const heartsCollectedRef = useRef(0);
  const [highScore, setHighScore] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  
  const canvasRef = useRef(null);
  const characterRef = useRef({
    x: 50,
    y: 0,
    width: 32,
    height: 48,
    jumping: false,
    yVelocity: 0,
    frameX: 0, // For animation
    frameCount: 0 // For controlling animation speed
  });
  const obstaclesRef = useRef([]);
  const heartsRef = useRef([]);
  const groundYRef = useRef(0);
  const frameIdRef = useRef(null);
  const lastObstacleTimeRef = useRef(0);
  const lastHeartTimeRef = useRef(0);
  const speedRef = useRef(4);
  const bgPositionRef = useRef(0);
  
  // Pixel art colors
  const colors = {
    pink: '#ffb6c1',
    darkPink: '#ff69b4',
    purple: '#da70d6',
    lightPurple: '#e6e6fa',
    white: '#ffffff',
    black: '#000000'
  };

  // Required hearts to complete the game
  const HEARTS_TO_WIN = 15;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedHighScore = localStorage.getItem('heartJumpHighScore');
      const savedGameCompleted = localStorage.getItem('heartJumpCompleted');
      
      if (savedHighScore) {
        setHighScore(parseInt(savedHighScore));
      }
      
      if (savedGameCompleted === 'true') {
        setGameCompleted(true);
      }
    }
  }, []);

  useEffect(() => {
    if (gameStarted && !gameOver) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      // Set canvas dimensions
      canvas.width = 800;
      canvas.height = 400;
      
      // Set ground Y position
      groundYRef.current = canvas.height - 50;
      
      // Set initial character position
      characterRef.current.y = groundYRef.current - characterRef.current.height;
      
      // Start game loop
      frameIdRef.current = requestAnimationFrame(gameLoop);
      
      // Add event listeners
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('touchstart', handleTouchStart);
      
      return () => {
        cancelAnimationFrame(frameIdRef.current);
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('touchstart', handleTouchStart);
      };
    }
  }, [gameStarted, gameOver]);

  const handleKeyDown = (e) => {
    if ((e.code === 'Space' || e.code === 'ArrowUp') && !characterRef.current.jumping) {
      jump();
    } else if (e.code === 'Enter' && (gameOver || !gameStarted)) {
      resetGame();
    }
  };

  const handleTouchStart = () => {
    if (!characterRef.current.jumping) {
      jump();
    } else if (gameOver || !gameStarted) {
      resetGame();
    }
  };

  const jump = () => {
    characterRef.current.jumping = true;
    characterRef.current.yVelocity = -15;
  };

  const resetGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setHeartsCollected(0);
    scoreRef.current = 0;
    heartsCollectedRef.current = 0;
    characterRef.current.y = groundYRef.current - characterRef.current.height;
    characterRef.current.jumping = false;
    characterRef.current.yVelocity = 0;
    obstaclesRef.current = [];
    heartsRef.current = [];
    speedRef.current = 4;
    frameIdRef.current = requestAnimationFrame(gameLoop);
  };

  // Helper functions for drawing pixel art
  const drawPixelRect = (ctx, x, y, width, height, color) => {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
  };

  const drawPixelHeart = (ctx, x, y, size) => {
    ctx.fillStyle = colors.pink;
    
    // Draw a simple pixel heart
    // Center square
    drawPixelRect(ctx, x, y + size/4, size, size/2, colors.pink);
    
    // Left bump
    drawPixelRect(ctx, x - size/2, y, size, size/2, colors.pink);
    
    // Right bump
    drawPixelRect(ctx, x + size, y, size, size/2, colors.pink);
    
    // Bottom triangle
    ctx.beginPath();
    ctx.moveTo(x - size/2, y + size/2);
    ctx.lineTo(x + size*3/2, y + size/2);
    ctx.lineTo(x + size/2, y + size*3/2);
    ctx.closePath();
    ctx.fill();
    
    // Add sparkle
    ctx.fillStyle = colors.white;
    drawPixelRect(ctx, x, y + size/4, size/4, size/4, colors.white);
  };

  const drawPixelCharacter = (ctx, x, y, width, height, frameX) => {
    // Draw body
    drawPixelRect(ctx, x, y, width, height, colors.purple);
    
    // Draw head
    drawPixelRect(ctx, x + width/4, y - height/4, width/2, height/4, colors.lightPurple);
    
    // Draw eyes
    drawPixelRect(ctx, x + width/3, y - height/5, width/10, height/20, colors.black);
    drawPixelRect(ctx, x + width*2/3 - width/10, y - height/5, width/10, height/20, colors.black);
    
    // Draw legs depending on animation frame
    if (frameX % 2 === 0) {
      // Walking pose 1
      drawPixelRect(ctx, x + width/4, y + height - height/6, width/5, height/6, colors.lightPurple);
      drawPixelRect(ctx, x + width*2/3, y + height - height/3, width/5, height/3, colors.lightPurple);
    } else {
      // Walking pose 2
      drawPixelRect(ctx, x + width/4, y + height - height/3, width/5, height/3, colors.lightPurple);
      drawPixelRect(ctx, x + width*2/3, y + height - height/6, width/5, height/6, colors.lightPurple);
    }
  };

  const drawPixelObstacle = (ctx, x, y, width, height) => {
    // Draw a simple pixel obstacle (spiky rock)
    ctx.fillStyle = colors.purple;
    drawPixelRect(ctx, x, y, width, height, colors.purple);
    
    // Add spikes on top
    ctx.fillStyle = colors.darkPink;
    const spikeWidth = width / 5;
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.moveTo(x + i * spikeWidth, y);
      ctx.lineTo(x + (i + 0.5) * spikeWidth, y - height/3);
      ctx.lineTo(x + (i + 1) * spikeWidth, y);
      ctx.closePath();
      ctx.fill();
    }
  };

  const drawPixelGround = (ctx, groundY, width) => {
    // Draw pixel ground with a pattern
    ctx.fillStyle = colors.darkPink;
    drawPixelRect(ctx, 0, groundY, width, 50, colors.darkPink);
    
    // Add ground details
    ctx.fillStyle = colors.purple;
    for (let i = 0; i < width; i += 32) {
      drawPixelRect(ctx, i, groundY, 16, 8, colors.purple);
    }
  };

  const gameLoop = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw scrolling background
    bgPositionRef.current -= speedRef.current / 2;
    if (bgPositionRef.current < -canvas.width) {
      bgPositionRef.current = 0;
    }
    
    // Draw simple parallax background
    ctx.fillStyle = colors.lightPurple;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw some background elements
    for (let i = 0; i < 5; i++) {
      const x = (bgPositionRef.current % 200) + i * 200;
      const y = 50 + i * 20;
      drawPixelHeart(ctx, x, y, 8);
    }
    
    // Draw ground
    drawPixelGround(ctx, groundYRef.current, canvas.width);
    
    // Update character position
    if (characterRef.current.jumping) {
      characterRef.current.yVelocity += 0.8; // Gravity
      characterRef.current.y += characterRef.current.yVelocity;
      
      // Check if landed
      if (characterRef.current.y >= groundYRef.current - characterRef.current.height) {
        characterRef.current.y = groundYRef.current - characterRef.current.height;
        characterRef.current.jumping = false;
        characterRef.current.yVelocity = 0;
      }
    }
    
    // Animate character
    characterRef.current.frameCount++;
    if (characterRef.current.frameCount >= 10) { // Change frame every 10 game loops
      characterRef.current.frameX = (characterRef.current.frameX + 1) % 2;
      characterRef.current.frameCount = 0;
    }
    
    // Draw character
    drawPixelCharacter(
      ctx,
      characterRef.current.x,
      characterRef.current.y,
      characterRef.current.width,
      characterRef.current.height,
      characterRef.current.frameX
    );
    
    // Generate obstacles
    const now = performance.now();
    if (now - lastObstacleTimeRef.current > (1800 - speedRef.current * 50)) {
      const obstacle = {
        x: canvas.width,
        y: 0,
        width: 30,
        height: 30 + Math.random() * 20,
      };
      obstacle.y = groundYRef.current - obstacle.height;
      
      obstaclesRef.current.push(obstacle);
      lastObstacleTimeRef.current = now;
    }
    
    // Generate hearts
    if (now - lastHeartTimeRef.current > 2000) {
      const heart = {
        x: canvas.width,
        y: groundYRef.current - 100 - Math.random() * 100, // Random height
        size: 16,
        collected: false
      };
      
      heartsRef.current.push(heart);
      lastHeartTimeRef.current = now;
    }
    
    // Update and draw obstacles
    for (let i = 0; i < obstaclesRef.current.length; i++) {
      const obstacle = obstaclesRef.current[i];
      obstacle.x -= speedRef.current;
      
      // Draw obstacle
      drawPixelObstacle(
        ctx,
        obstacle.x,
        obstacle.y,
        obstacle.width,
        obstacle.height
      );
      
      // Check collision
      if (
        characterRef.current.x < obstacle.x + obstacle.width &&
        characterRef.current.x + characterRef.current.width > obstacle.x &&
        characterRef.current.y < obstacle.y + obstacle.height &&
        characterRef.current.y + characterRef.current.height > obstacle.y
      ) {
        endGame();
        return;
      }
      
      // Remove off-screen obstacles
      if (obstacle.x + obstacle.width < 0) {
        obstaclesRef.current.splice(i, 1);
        i--;
      }
    }
    
    // Update and draw hearts
    for (let i = 0; i < heartsRef.current.length; i++) {
      const heart = heartsRef.current[i];
      heart.x -= speedRef.current;
      
      if (!heart.collected) {
        // Draw heart
        drawPixelHeart(ctx, heart.x, heart.y, heart.size);
        
        // Check collection
        if (
          characterRef.current.x < heart.x + heart.size * 2 &&
          characterRef.current.x + characterRef.current.width > heart.x &&
          characterRef.current.y < heart.y + heart.size * 2 &&
          characterRef.current.y + characterRef.current.height > heart.y
        ) {
          heart.collected = true;
          heartsCollectedRef.current += 1;
          setHeartsCollected(heartsCollectedRef.current);
          
          // Check if player won
          if (heartsCollectedRef.current >= HEARTS_TO_WIN) {
            winGame();
            return;
          }
        }
      }
      
      // Remove off-screen hearts
      if (heart.x + heart.size * 2 < 0) {
        heartsRef.current.splice(i, 1);
        i--;
      }
    }
    
    // Keep score in a ref to avoid React state update issues in the game loop
    scoreRef.current += 1;
    if (scoreRef.current % 5 === 0) { // Update React state less frequently to avoid performance issues
      setScore(scoreRef.current);
    }
    
    // Increase speed gradually
    if (scoreRef.current % 500 === 0 && scoreRef.current > 0) {
      speedRef.current += 0.2;
    }
    
    // Draw UI in pixel style
    ctx.fillStyle = colors.black;
    ctx.font = '20px "Press Start 2P", cursive, monospace';
    ctx.fillText(`Score: ${scoreRef.current}`, canvas.width - 200, 30);
    ctx.fillText(`Hearts: ${heartsCollectedRef.current}/${HEARTS_TO_WIN}`, canvas.width - 200, 60);
    
    // Continue game loop
    if (!gameOver) {
      frameIdRef.current = requestAnimationFrame(gameLoop);
    }
  };

  const endGame = () => {
    cancelAnimationFrame(frameIdRef.current);
    setGameOver(true);
    setScore(scoreRef.current); // Update the React state with the final score
    
    if (scoreRef.current > highScore) {
      setHighScore(scoreRef.current);
      if (typeof window !== 'undefined') {
        localStorage.setItem('heartJumpHighScore', scoreRef.current.toString());
      }
    }
  };

  const winGame = () => {
    cancelAnimationFrame(frameIdRef.current);
    setGameOver(true);
    setGameCompleted(true);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('heartJumpCompleted', 'true');
    }
    
    // Update high score if needed
    if (scoreRef.current > highScore) {
      setHighScore(scoreRef.current);
      if (typeof window !== 'undefined') {
        localStorage.setItem('heartJumpHighScore', scoreRef.current.toString());
      }
    }
  };

  const goToHub = () => {
    router.push('/gaming-hub');
  };

  return (
    <div className="pixel-art-container bg-gradient-to-b from-pink-200 to-purple-200 min-h-screen p-4">
      <Head>
        <title>Heart Jump</title>
        <meta name="description" content="Jump and collect hearts!" />
        <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet" />
      </Head>

      <main className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-3xl font-pixel text-pink-600 mb-6 text-center pixel-text">Heart Jump</h1>
        
        {!gameStarted && (
          <div className="text-center mb-6 bg-white bg-opacity-70 p-6 rounded-lg border-4 border-pink-400 pixel-border">
            <p className="mb-2 text-purple-800 pixel-text">Press SPACE or tap to jump.</p>
            <p className="mb-4 text-purple-800 pixel-text">Collect {HEARTS_TO_WIN} hearts to unlock a present!</p>
            <button 
              onClick={resetGame}
              className="px-6 py-3 text-lg cursor-pointer bg-pink-500 text-white border-none rounded pixel-button hover:bg-pink-600 transition"
            >
              Start Game
            </button>
          </div>
        )}
        
        <div className="relative">
          <canvas 
            ref={canvasRef}
            className={`border-4 border-pink-500 pixel-border ${gameStarted ? 'block' : 'hidden'}`}
            style={{ backgroundColor: '#f8f8f8' }}
          />
          
          <div className="absolute top-4 left-4 bg-pink-200 bg-opacity-70 p-2 rounded pixel-border">
            <p className="text-purple-900 pixel-text">Hearts: {heartsCollected}/{HEARTS_TO_WIN}</p>
          </div>
        </div>
        
        {gameOver && !gameCompleted && (
          <div className="text-center mt-6 bg-white bg-opacity-70 p-6 rounded-lg border-4 border-pink-400 pixel-border">
            <h2 className="text-2xl text-pink-600 mb-2 pixel-text">Game Over!</h2>
            <p className="mb-1 text-purple-800 pixel-text">Your score: {score}</p>
            <p className="mb-4 text-purple-800 pixel-text">High score: {highScore}</p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <button 
                onClick={resetGame}
                className="px-6 py-3 text-lg cursor-pointer bg-pink-500 text-white border-none rounded pixel-button hover:bg-pink-600 transition"
              >
                Play Again
              </button>
              <button 
                onClick={goToHub}
                className="px-6 py-3 text-lg cursor-pointer bg-purple-500 text-white border-none rounded pixel-button hover:bg-purple-600 transition"
              >
                Back to Hub
              </button>
            </div>
          </div>
        )}
        
        {gameCompleted && (
          <div className="text-center mt-6 bg-white bg-opacity-70 p-6 rounded-lg border-4 border-pink-400 pixel-border">
            <h2 className="text-2xl text-pink-600 mb-2 pixel-text">You Won!</h2>
            <div className="mb-4">
              <p className="text-purple-800 pixel-text">You collected all {HEARTS_TO_WIN} hearts!</p>
              <p className="text-purple-800 pixel-text">Final score: {score}</p>
              <p className="text-purple-800 pixel-text mt-4">A special present has been unlocked!</p>
            </div>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <button 
                onClick={resetGame}
                className="px-6 py-3 text-lg cursor-pointer bg-pink-500 text-white border-none rounded pixel-button hover:bg-pink-600 transition"
              >
                Play Again
              </button>
              <button 
                onClick={goToHub}
                className="px-6 py-3 text-lg cursor-pointer bg-purple-500 text-white border-none rounded pixel-button hover:bg-purple-600 transition"
              >
                Back to Hub
              </button>
            </div>
          </div>
        )}
      </main>

      <style jsx global>{`
        .pixel-text {
          font-family: 'Press Start 2P', cursive, monospace;
          image-rendering: pixelated;
          letter-spacing: 1px;
        }
        
        .pixel-border {
          image-rendering: pixelated;
          box-shadow: 4px 4px 0px rgba(0,0,0,0.2);
        }
        
        .pixel-button {
          font-family: 'Press Start 2P', cursive, monospace;
          image-rendering: pixelated;
          box-shadow: 4px 4px 0px rgba(0,0,0,0.2);
          transform: translateY(0);
          transition: transform 0.1s;
        }
        
        .pixel-button:active {
          transform: translateY(2px);
          box-shadow: 2px 2px 0px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
}