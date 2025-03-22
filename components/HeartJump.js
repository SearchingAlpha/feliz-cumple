"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

function HeartJumpGame({ onComplete }) {
  const [gameState, setGameState] = useState({
    player: {
      x: 50,
      y: 350,
      width: 32,
      height: 32,
      velocityY: 0,
      isJumping: false,
    },
    hearts: [],
    score: 0,
    isGameOver: false,
    isGameWon: false,
    timeLeft: 60,
    platforms: [
      { x: 0, y: 400, width: 600, height: 20 },
      { x: 150, y: 300, width: 100, height: 20 },
      { x: 320, y: 250, width: 100, height: 20 },
      { x: 100, y: 200, width: 100, height: 20 },
      { x: 300, y: 150, width: 100, height: 20 },
    ],
  });
  
  const canvasRef = useRef(null);
  const frameRef = useRef(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  
  // Images
  const [playerImg, setPlayerImg] = useState(null);
  const [heartImg, setHeartImg] = useState(null);
  const [platformImg, setPlatformImg] = useState(null);
  const [backgroundImg, setBackgroundImg] = useState(null);
  
  // Load images
  useEffect(() => {
    const playerImage = new Image();
    playerImage.src = '/images/games/heart-jump/player.png';
    playerImage.onload = () => setPlayerImg(playerImage);
    
    const heartImage = new Image();
    heartImage.src = '/images/games/heart-jump/heart.png';
    heartImage.onload = () => setHeartImg(heartImage);
    
    const platformImage = new Image();
    platformImage.src = '/images/games/heart-jump/platform.png';
    platformImage.onload = () => setPlatformImg(platformImage);
    
    const bgImage = new Image();
    bgImage.src = '/images/games/heart-jump/background.png';
    bgImage.onload = () => setBackgroundImg(bgImage);
  }, []);
  
  // Generate hearts randomly
  useEffect(() => {
    if (!gameStarted || !heartImg) return;
    
    // Generate 15 hearts at random positions on platforms
    const newHearts = [];
    for (let i = 0; i < 15; i++) {
      const randomPlatform = gameState.platforms[Math.floor(Math.random() * (gameState.platforms.length - 1)) + 1];
      newHearts.push({
        x: randomPlatform.x + Math.random() * (randomPlatform.width - 20),
        y: randomPlatform.y - 30,
        width: 24,
        height: 24,
        collected: false,
      });
    }
    
    setGameState(prev => ({ ...prev, hearts: newHearts }));
  }, [gameStarted, heartImg]);
  
  // Key handlers
  useEffect(() => {
    if (!gameStarted) return;
    
    const keys = {
      ArrowLeft: false,
      ArrowRight: false,
      ArrowUp: false,
    };
    
    const keyDownHandler = (e) => {
      if (e.key in keys) {
        keys[e.key] = true;
      }
    };
    
    const keyUpHandler = (e) => {
      if (e.key in keys) {
        keys[e.key] = false;
      }
    };
    
    window.addEventListener('keydown', keyDownHandler);
    window.addEventListener('keyup', keyUpHandler);
    
    // Game loop
    const gameLoop = () => {
      setGameState(prev => {
        if (prev.isGameOver || prev.isGameWon) return prev;
        
        // Update player position
        let { player, platforms, hearts, score } = prev;
        let { x, y, velocityY, isJumping } = player;
        
        // Move left/right
        if (keys.ArrowLeft) x -= 5;
        if (keys.ArrowRight) x += 5;
        
        // Jump
        if (keys.ArrowUp && !isJumping) {
          velocityY = -12;
          isJumping = true;
        }
        
        // Apply gravity
        velocityY += 0.8;
        y += velocityY;
        
        // Check platform collisions
        isJumping = true;
        for (const platform of platforms) {
          if (
            x + player.width > platform.x &&
            x < platform.x + platform.width &&
            y + player.height > platform.y &&
            y + player.height < platform.y + platform.height / 2 &&
            velocityY > 0
          ) {
            y = platform.y - player.height;
            velocityY = 0;
            isJumping = false;
            break;
          }
        }
        
        // Check boundaries
        if (x < 0) x = 0;
        if (x + player.width > 600) x = 600 - player.width;
        
        // Check if fallen off bottom
        if (y > 500) {
          return { ...prev, isGameOver: true };
        }
        
        // Check heart collisions
        for (let i = 0; i < hearts.length; i++) {
          if (!hearts[i].collected &&
              x + player.width > hearts[i].x &&
              x < hearts[i].x + hearts[i].width &&
              y + player.height > hearts[i].y &&
              y < hearts[i].y + hearts[i].height) {
            hearts[i].collected = true;
            score += 1;
          }
        }
        
        // Check for win condition (collect 12 hearts)
        if (score >= 12) {
          return { ...prev, 
            player: { ...player, x, y, velocityY, isJumping }, 
            hearts, 
            score, 
            isGameWon: true 
          };
        }
        
        // Update time
        const timeLeft = prev.timeLeft - 1/60; // Assuming 60 FPS
        if (timeLeft <= 0) {
          return { ...prev, isGameOver: true };
        }
        
        return { 
          ...prev, 
          player: { ...player, x, y, velocityY, isJumping }, 
          hearts, 
          score,
          timeLeft 
        };
      });
      
      frameRef.current = requestAnimationFrame(gameLoop);
    };
    
    frameRef.current = requestAnimationFrame(gameLoop);
    
    // Cleanup function
    return () => {
      window.removeEventListener('keydown', keyDownHandler);
      window.removeEventListener('keyup', keyUpHandler);
      cancelAnimationFrame(frameRef.current);
    };
  }, [gameStarted]);
  
  // Draw the game
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background
    if (backgroundImg) {
      ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
    } else {
      ctx.fillStyle = '#ffd9eb'; // Pastel pink background if image not loaded
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    // Draw platforms
    gameState.platforms.forEach(platform => {
      if (platformImg) {
        // Tile the platform image
        const tileSize = 20;
        for (let i = 0; i < platform.width; i += tileSize) {
          ctx.drawImage(
            platformImg,
            platform.x + i,
            platform.y,
            Math.min(tileSize, platform.width - i),
            platform.height
          );
        }
      } else {
        ctx.fillStyle = '#c988d9'; // Pastel purple platforms if image not loaded
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
      }
    });
    
    // Draw hearts
    gameState.hearts.forEach(heart => {
      if (!heart.collected) {
        if (heartImg) {
          ctx.drawImage(heartImg, heart.x, heart.y, heart.width, heart.height);
        } else {
          ctx.fillStyle = '#ff6b8d'; // Coral pink hearts if image not loaded
          ctx.fillRect(heart.x, heart.y, heart.width, heart.height);
        }
      }
    });
    
    // Draw player
    if (playerImg) {
      ctx.drawImage(
        playerImg,
        gameState.player.x,
        gameState.player.y,
        gameState.player.width,
        gameState.player.height
      );
    } else {
      ctx.fillStyle = '#6dd5ed'; // Light blue player if image not loaded
      ctx.fillRect(
        gameState.player.x,
        gameState.player.y,
        gameState.player.width,
        gameState.player.height
      );
    }
    
    // Draw HUD (score, time)
    ctx.fillStyle = '#fff';
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 3;
    ctx.font = '20px "Press Start 2P", cursive';
    const scoreText = `Hearts: ${gameState.score}/12`;
    const timeText = `Time: ${Math.ceil(gameState.timeLeft)}`;
    
    // Score with text shadow
    ctx.strokeText(scoreText, 20, 30);
    ctx.fillText(scoreText, 20, 30);
    
    // Time with text shadow
    ctx.strokeText(timeText, 400, 30);
    ctx.fillText(timeText, 400, 30);
    
    // Draw game over or win screen
    if (gameState.isGameOver) {
      drawGameOverScreen(ctx, canvas);
    }
    
    if (gameState.isGameWon) {
      drawGameWinScreen(ctx, canvas);
      
      // Notify parent component of game completion
      if (onComplete && typeof onComplete === 'function') {
        onComplete();
      }
    }
  }, [gameState, playerImg, heartImg, platformImg, backgroundImg, onComplete]);
  
  // Helper function to draw game over screen
  const drawGameOverScreen = (ctx, canvas) => {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#ff6b8d';
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 5;
    ctx.font = '30px "Press Start 2P", cursive';
    const gameOverText = 'GAME OVER';
    const textWidth = ctx.measureText(gameOverText).width;
    
    ctx.strokeText(gameOverText, (canvas.width - textWidth) / 2, canvas.height / 2 - 40);
    ctx.fillText(gameOverText, (canvas.width - textWidth) / 2, canvas.height / 2 - 40);
    
    ctx.font = '16px "Press Start 2P", cursive';
    const restartText = 'Press ENTER to play again';
    const restartWidth = ctx.measureText(restartText).width;
    
    ctx.strokeText(restartText, (canvas.width - restartWidth) / 2, canvas.height / 2 + 20);
    ctx.fillText(restartText, (canvas.width - restartWidth) / 2, canvas.height / 2 + 20);
  };
  
  // Helper function to draw win screen
  const drawGameWinScreen = (ctx, canvas) => {
    ctx.fillStyle = 'rgba(255, 192, 203, 0.7)'; // Pink overlay
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#fff';
    ctx.strokeStyle = '#6dd5ed';
    ctx.lineWidth = 5;
    ctx.font = '30px "Press Start 2P", cursive';
    const winText = 'YOU WIN!';
    const textWidth = ctx.measureText(winText).width;
    
    ctx.strokeText(winText, (canvas.width - textWidth) / 2, canvas.height / 2 - 40);
    ctx.fillText(winText, (canvas.width - textWidth) / 2, canvas.height / 2 - 40);
    
    ctx.font = '16px "Press Start 2P", cursive';
    const unlockText = 'Present Unlocked!';
    const unlockWidth = ctx.measureText(unlockText).width;
    
    ctx.strokeText(unlockText, (canvas.width - unlockWidth) / 2, canvas.height / 2 + 20);
    ctx.fillText(unlockText, (canvas.width - unlockWidth) / 2, canvas.height / 2 + 20);
    
    ctx.font = '14px "Press Start 2P", cursive';
    const continueText = 'Press ENTER to continue';
    const continueWidth = ctx.measureText(continueText).width;
    
    ctx.strokeText(continueText, (canvas.width - continueWidth) / 2, canvas.height / 2 + 60);
    ctx.fillText(continueText, (canvas.width - continueWidth) / 2, canvas.height / 2 + 60);
  };
  
  // Handle enter key for restart/continue
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
        if (gameState.isGameOver) {
          // Reset game
          setGameState({
            player: {
              x: 50,
              y: 350,
              width: 32,
              height: 32,
              velocityY: 0,
              isJumping: false,
            },
            hearts: [],
            score: 0,
            isGameOver: false,
            isGameWon: false,
            timeLeft: 60,
            platforms: [
              { x: 0, y: 400, width: 600, height: 20 },
              { x: 150, y: 300, width: 100, height: 20 },
              { x: 320, y: 250, width: 100, height: 20 },
              { x: 100, y: 200, width: 100, height: 20 },
              { x: 300, y: 150, width: 100, height: 20 },
            ],
          });
        } else if (gameState.isGameWon) {
          // Return to hub
          window.location.href = '/gaming-hub';
        } else if (showInstructions) {
          // Start game after instructions
          setShowInstructions(false);
          setGameStarted(true);
        }
      }
    };
    
    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [gameState.isGameOver, gameState.isGameWon, showInstructions]);
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-pink-200 to-purple-200 p-4">
      <div className="pixel-box w-full max-w-4xl bg-white p-6 rounded-lg shadow-lg border-4 border-purple-400">
        <h1 className="text-3xl font-bold text-center mb-4 text-pink-600 pixel-text">Heart Jump</h1>
        
        {showInstructions ? (
          <div className="text-center p-4 bg-pink-100 rounded-lg mb-4">
            <h2 className="text-2xl font-bold mb-3 text-purple-700">How to Play</h2>
            <ul className="text-left space-y-2 mb-6 mx-auto max-w-md">
              <li className="flex items-center">
                <span className="font-bold mr-2">→</span> Use Arrow Keys to move
              </li>
              <li className="flex items-center">
                <span className="font-bold mr-2">↑</span> Press Up Arrow to jump
              </li>
              <li className="flex items-center">
                <span className="font-bold mr-2">❤️</span> Collect 12 hearts to win
              </li>
              <li className="flex items-center">
                <span className="font-bold mr-2">⏱️</span> Complete the game before time runs out
              </li>
            </ul>
            <button 
              onClick={() => {
                setShowInstructions(false);
                setGameStarted(true);
              }}
              className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg shadow-md hover:from-pink-600 hover:to-purple-600 transition duration-300 font-bold"
            >
              Start Game
            </button>
          </div>
        ) : (
          <canvas 
            ref={canvasRef} 
            width={600} 
            height={450}
            className="border-4 border-purple-300 rounded-lg mx-auto block shadow-lg"
          />
        )}
        
        <div className="flex justify-center mt-4">
          <Link href="/gaming-hub">
            <button className="px-4 py-2 bg-purple-400 text-white rounded hover:bg-purple-500 transition duration-200 mr-4">
              Back to Hub
            </button>
          </Link>
          {!showInstructions && !gameState.isGameWon && !gameState.isGameOver && (
            <button 
              onClick={() => {
                cancelAnimationFrame(frameRef.current);
                setGameStarted(false);
                setShowInstructions(true);
              }}
              className="px-4 py-2 bg-pink-400 text-white rounded hover:bg-pink-500 transition duration-200"
            >
              Restart
            </button>
          )}
        </div>
      </div>
      
      <style jsx global>{`
        @font-face {
          font-family: 'Press Start 2P';
          src: url('/fonts/PressStart2P-Regular.ttf') format('truetype');
          font-weight: normal;
          font-style: normal;
        }
        
        .pixel-text {
          font-family: 'Press Start 2P', cursive;
          letter-spacing: 1px;
        }
        
        .pixel-box {
          image-rendering: pixelated;
          box-shadow: 0 0 0 4px #c988d9, 0 0 0 8px #ffa6c9;
        }
      `}</style>
    </div>
  );
}

export default HeartJumpGame;