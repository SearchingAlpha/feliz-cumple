'use client';

import { useState, useEffect } from 'react';
import { Heart, Gift, Trophy } from 'lucide-react';
import { useRouter } from 'next/navigation';
import '../app/globals.css';
import { getGameState, resetGame, resetAllGames } from '@/lib/gameState';

// Custom Pixel Button component
const PixelButton = ({ onClick, color, children, completed, disabled, size = "normal" }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative font-pixel text-white 
        transition-all duration-200 
        ${color} 
        border-b-4 border-r-4 
        ${completed ? 'border-green-700 bg-green-500' : 'border-opacity-50 border-black'} 
        ${disabled ? 'opacity-70 cursor-not-allowed' : 'hover:translate-y-1 hover:border-b-2 active:translate-y-2 active:border-b-0'}
        ${size === "small" ? 'px-3 py-1 text-xs' : 'px-6 py-3'}
        rounded-xl
        before:absolute before:top-0 before:left-0 before:w-full before:h-full
        before:border-2 before:border-white before:border-opacity-20
      `}
    >
      <div className="flex items-center justify-center gap-2">
        {children}
        {completed && size !== "small" && <Trophy size={16} className="ml-1 animate-pulse" />}
      </div>
      
      {/* Pixel-style decoration */}
      <div className="absolute inset-0 flex items-end justify-start overflow-hidden opacity-20">
        <div className="h-2 w-2 bg-white"></div>
      </div>
      <div className="absolute inset-0 flex items-end justify-end overflow-hidden opacity-20">
        <div className="h-2 w-2 bg-white"></div>
      </div>
    </button>
  );
};

// Present Box Component
const PresentBox = ({ unlocked, title, content }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    if (unlocked) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div 
      onClick={handleClick}
      className={`
        relative w-full p-4 rounded-lg cursor-pointer transition-all
        ${unlocked ? 'bg-pink-100 hover:bg-pink-200' : 'bg-gray-200'}
        border-3 border-dashed ${unlocked ? 'border-pink-400' : 'border-gray-400'}
      `}
    >
      <div className="flex items-center gap-2 mb-2">
        <Gift 
          size={24} 
          className={`${unlocked ? 'text-pink-500' : 'text-gray-500'} ${isOpen && unlocked ? 'animate-bounce' : ''}`} 
        />
        <h3 className={`font-pixel text-lg ${unlocked ? 'text-pink-600' : 'text-gray-500'}`}>
          {unlocked ? title : "Regalo bloqueado"}
        </h3>
      </div>
      
      {unlocked && isOpen && (
        <div className="mt-3 p-3 bg-white rounded-md border border-pink-300 font-pixel text-sm animate-fadeIn">
          <p>{content}</p>
          
          {/* Pixelated corners for retro feel */}
          <div className="absolute left-2 top-2 h-1 w-1 bg-pink-300 opacity-30"></div>
          <div className="absolute right-2 top-2 h-1 w-1 bg-pink-300 opacity-30"></div>
          <div className="absolute bottom-2 left-2 h-1 w-1 bg-pink-300 opacity-30"></div>
          <div className="absolute bottom-2 right-2 h-1 w-1 bg-pink-300 opacity-30"></div>
        </div>
      )}
      
      {unlocked && !isOpen && (
        <p className="text-xs text-pink-400 font-pixel">Haz clic para abrir</p>
      )}
      
      {!unlocked && (
        <p className="text-xs text-gray-500 font-pixel">Completa el juego para desbloquear!</p>
      )}
    </div>
  );
};

// Pixel Art decoration components
const PixelHeart = ({ size = 12, color = "bg-pink-400" }) => (
  <div className={`${size} ${color} pixel-heart animate-float`}></div>
);

const PixelStar = ({ size = 12, color = "bg-yellow-300" }) => (
  <div className={`${size} ${color} pixel-star animate-spin-slow`}></div>
);

const GamingHub = ({ onShowReward }) => {
  const router = useRouter(); // For navigation
  
  // Game state
  const [gameState, setGameState] = useState({
    flowerMatch: false,
    cupcakeCatch: false,
    heartJump: false
  });

  // Calculate if all games are completed
  const allGamesCompleted = 
    gameState.flowerMatch === true && 
    gameState.cupcakeCatch === true && 
    gameState.heartJump === true;

// Simplified game state loading with the utility function
useEffect(() => {
  // Function to load game state
  function loadGameState() {
    const state = getGameState();
    console.log("Loading game state:", state);
    setGameState(state);
  }
  
  // Load game state initially
  loadGameState();
  
  // Set up event listeners
  function handleVisibilityChange() {
    if (document.visibilityState === 'visible') {
      console.log("Page became visible, reloading game state");
      loadGameState();
    }
  }
  
  function handleStorageChange(event) {
    if (event.key === 'gameState' || event.key === 'forceRefresh') {
      console.log("Storage changed, reloading game state");
      loadGameState();
    }
  }
  
  // Listen for the modalClosed event to refresh the UI
  function handleModalClosed() {
    console.log("Modal closed event detected, refreshing UI");
    loadGameState();
    
    // Force a small delay to ensure DOM is updated
    setTimeout(() => {
      const event = new MouseEvent('mousemove', {
        view: window,
        bubbles: true,
        cancelable: true
      });
      document.dispatchEvent(event);
    }, 100);
  }
  
  // Add event listeners
  document.addEventListener('visibilitychange', handleVisibilityChange);
  window.addEventListener('storage', handleStorageChange);
  window.addEventListener('modalClosed', handleModalClosed);
  
  // Also set up an interval to periodically check for changes
  const intervalId = setInterval(loadGameState, 1000);
  
  // Clean up
  return () => {
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    window.removeEventListener('storage', handleStorageChange);
    window.removeEventListener('modalClosed', handleModalClosed);
    clearInterval(intervalId);
  };
}, []);

  // Function to navigate to a game
  const navigateToGame = (game) => {
    console.log(`Attempting to navigate to game: ${game}`);
    
    // Store current auth state in sessionStorage temporarily to maintain it across page navigation
    try {
      const authState = localStorage.getItem('isAuthenticated');
      if (authState) {
        sessionStorage.setItem('tempAuthState', authState);
      }
      
      // Also preserve current game state in session storage
      const currentGameState = localStorage.getItem('gameState');
      if (currentGameState) {
        sessionStorage.setItem('gameStateBackup', currentGameState);
      }
    } catch (error) {
      console.error("Error preserving state:", error);
    }
    
    // Navigate to the appropriate game route
    switch(game) {
      case 'flowerMatch':
        console.log('Navigating to /game/pixel-flower-match');
        router.push('/game/pixel-flower-match');
        break;
      case 'cupcakeCatch':
        console.log('Navigating to /game/cupcake-catch');
        router.push('/game/cupcake-catch');
        break;
      case 'heartJump':
        console.log('Navigating to /game/heart-jump');
        router.push('/game/heart-jump');
        break;
      default:
        console.error('Unknown game:', game);
    }
  };
  
  // Function to reset a game's completion status
  const resetGameHandler = (game) => {
    if (window.confirm(`Estás seguro que quieres reiniciar el progreso de ${game}?`)) {
      resetGame(game);
      // Update the local state immediately for UI responsiveness
      setGameState(prev => ({
        ...prev,
        [game]: false
      }));
    }
  };

  // Function to reset all games
  const resetAllGamesHandler = () => {
    if (window.confirm('Estás seguro que quieres reiniciar el progreso de todos los juegos?')) {
      resetAllGames();
      // Update the local state
      setGameState({
        flowerMatch: false,
        cupcakeCatch: false,
        heartJump: false
      });
    }
  };

  // Calculate total progress
  const completedGames = Object.values(gameState).filter(Boolean).length;
  const totalGames = Object.keys(gameState).length;
  const progressPercentage = (completedGames / totalGames) * 100;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Pixel Background */}
      <div className="fixed inset-0 z-0">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-fuchsia-100 to-pink-100"></div>
        
        {/* Pixelated grid overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="h-full w-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmFlZGEiIHN0cm9rZS1vcGFjaXR5PSIwLjQiLz48L3N2Zz4=')]"></div>
        </div>
        
        {/* Pixelated decorative elements */}
        <div className="absolute top-20 left-20 h-16 w-16 rounded-md bg-gradient-to-br from-pink-300 to-pink-400 opacity-40 blur-sm"></div>
        <div className="absolute bottom-40 right-20 h-24 w-24 rounded-full bg-gradient-to-br from-purple-300 to-fuchsia-300 opacity-30 blur-sm"></div>
        <div className="absolute bottom-20 left-1/4 h-12 w-12 rounded-full bg-gradient-to-br from-pink-200 to-pink-300 opacity-40 blur-sm"></div>
        <div className="absolute top-1/3 right-1/4 h-20 w-20 rounded-full bg-gradient-to-br from-fuchsia-200 to-purple-300 opacity-30 blur-sm"></div>
        
        {/* Heart decorations */}
        <div className="absolute top-10 right-10 h-8 w-8 opacity-40">
          <svg viewBox="0 0 24 24" fill="currentColor" className="text-pink-400">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
        <div className="absolute bottom-16 left-12 h-6 w-6 opacity-40">
          <svg viewBox="0 0 24 24" fill="currentColor" className="text-pink-400">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
        <div className="absolute top-1/3 left-1/3 h-5 w-5 opacity-30">
          <svg viewBox="0 0 24 24" fill="currentColor" className="text-pink-300">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
        
        {/* Sparkles */}
        <div className="absolute top-1/4 right-1/3 h-2 w-2 animate-pulse rounded-full bg-yellow-200 opacity-60"></div>
        <div className="absolute bottom-1/3 right-1/4 h-1.5 w-1.5 animate-pulse rounded-full bg-yellow-200 opacity-60"></div>
        <div className="absolute top-1/2 left-1/5 h-2.5 w-2.5 animate-pulse rounded-full bg-yellow-200 opacity-50"></div>
      </div>
      
      <div className="container mx-auto px-4 py-12 max-w-4xl relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-pixel text-purple-700 mb-4 tracking-wide drop-shadow-[0_2px_0_rgba(255,105,180,0.7)]">
            Portal a tu Mundo de Juegos
          </h1>
          <p className="font-pixel text-pink-600 text-lg">Te espera una aventura!</p>
          
          <div className="flex justify-center mt-4">
            {completedGames > 0 && (
              <PixelButton
                onClick={resetAllGamesHandler}
                color="bg-pink-700"
                size="small"
              >
                Reiniciar los progresos
              </PixelButton>
            )}
          </div>
          
          {/* Progress bar */}
          <div className="mt-6 w-full bg-white rounded-full h-6 border-4 border-pink-300">
            <div 
              className="bg-gradient-to-r from-pink-400 to-purple-500 h-full rounded-full transition-all duration-500 flex items-center justify-center text-xs font-pixel text-white"
              style={{ width: `${progressPercentage}%` }}
            >
              <div className="flex h-full w-full">
                {[...Array(20)].map((_, i) => (
                  <div 
                    key={i}
                    className={`h-full flex-1 ${i % 2 === 0 ? 'bg-pink-300' : 'bg-pink-400'} opacity-30`}
                  />
                ))}
              </div>
              <span className="absolute">{completedGames}/{totalGames}</span>
            </div>
          </div>
          
          {/* Reward Button - Only show when all games are completed */}
          {allGamesCompleted && (
            <div className="mt-6">
              <button
                onClick={() => {
                  console.log("Reward button clicked, all completed:", allGamesCompleted);
                  onShowReward();
                }}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl 
                        border-b-4 border-r-4 border-opacity-50 border-black
                        hover:translate-y-1 hover:border-b-2 active:translate-y-2 active:border-b-0
                        font-pixel text-sm transition-all duration-200 animate-pulse"
              >
                <div className="flex items-center justify-center gap-2">
                  <Trophy size={18} className="text-yellow-300" />
                  <span>Ver Recompensa Especial</span>
                  <Heart size={16} className="text-pink-300" fill="currentColor" />
                </div>
              </button>
            </div>
          )}
        </div>
        
        {/* Main content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Game selection */}
          <div className="md:col-span-2 bg-white rounded-xl p-6 shadow-lg border-4 border-purple-300">
            <h2 className="text-2xl font-pixel text-purple-600 mb-6 flex items-center">
              <Heart size={24} className="mr-2 text-pink-500" /> 
              Elige un juego
            </h2>
            
            <div className="grid grid-cols-1 gap-4">
              {/* Game 1 - Pixel Flower Match (implemented) */}
              <div className="p-4 bg-pink-50 rounded-lg border-2 border-pink-200">
                <div className="flex justify-between items-center flex-wrap md:flex-nowrap">
                  <div className="flex items-center">
                    <div className="bg-pink-400 w-12 h-12 rounded-lg flex items-center justify-center mr-4">
                      <div className="pixel-flower w-8 h-8"></div>
                    </div>
                    <div>
                      <h3 className="font-pixel text-xl text-pink-600">Pixel Flower Match</h3>
                      <p className="text-sm text-pink-500">Juego de memorizar</p>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row gap-2 mt-4 md:mt-0">
                    {gameState.flowerMatch && (
                      <PixelButton 
                        onClick={() => resetGameHandler('flowerMatch')}
                        color="bg-gray-500"
                        size="small"
                      >
                        Reset
                      </PixelButton>
                    )}
                    <PixelButton 
                      onClick={() => navigateToGame('flowerMatch')}
                      color="bg-pink-500"
                      completed={gameState.flowerMatch}
                    >
                      {gameState.flowerMatch ? 'Play Again' : 'Play Now'}
                    </PixelButton>
                  </div>
                </div>
              </div>
              
              {/* Game 2 - Cupcake Catch (placeholder) */}
              <div className="p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
                <div className="flex justify-between items-center flex-wrap md:flex-nowrap">
                  <div className="flex items-center">
                    <div className="bg-purple-400 w-12 h-12 rounded-lg flex items-center justify-center mr-4">
                      <div className="pixel-cupcake w-8 h-8"></div>
                    </div>
                    <div>
                      <h3 className="font-pixel text-xl text-purple-600">Cupcake Catch</h3>
                      <p className="text-sm text-purple-500">Recoge cupcakes y evita las bombas</p>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row gap-2 mt-4 md:mt-0">
                    {gameState.cupcakeCatch && (
                      <PixelButton 
                        onClick={() => resetGameHandler('cupcakeCatch')}
                        color="bg-gray-500"
                        size="small"
                      >
                        Reset
                      </PixelButton>
                    )}
                    <PixelButton 
                      onClick={() => navigateToGame('cupcakeCatch')}
                      color="bg-purple-500"
                      completed={gameState.cupcakeCatch}
                    >
                      {gameState.cupcakeCatch ? 'Play Again' : 'Play Now'}
                    </PixelButton>
                  </div>
                </div>
              </div>
              
              {/* Game 3 - Heart Jump (placeholder) */}
              <div className="p-4 bg-red-50 rounded-lg border-2 border-red-200">
                <div className="flex justify-between items-center flex-wrap md:flex-nowrap">
                  <div className="flex items-center">
                    <div className="bg-red-400 w-12 h-12 rounded-lg flex items-center justify-center mr-4">
                      <div className="pixel-heart w-8 h-8"></div>
                    </div>
                    <div>
                      <h3 className="font-pixel text-xl text-red-500">Heart Jump</h3>
                      <p className="text-sm text-red-400">Esquiva los obstáculos y recoge corazones</p>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row gap-2 mt-4 md:mt-0">
                    {gameState.heartJump && (
                      <PixelButton 
                        onClick={() => resetGameHandler('heartJump')}
                        color="bg-gray-500"
                        size="small"
                      >
                        Reset
                      </PixelButton>
                    )}
                    <PixelButton 
                      onClick={() => navigateToGame('heartJump')}
                      color="bg-red-400"
                      completed={gameState.heartJump}
                    >
                      {gameState.heartJump ? 'Play Again' : 'Play Now'}
                    </PixelButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Presents section */}
          <div className="bg-white rounded-xl p-6 shadow-lg border-4 border-pink-300">
            <h2 className="text-2xl font-pixel text-pink-600 mb-6 flex items-center">
              <Gift size={24} className="mr-2 text-pink-500" /> 
              Tus regalos
            </h2>
            
            <div className="space-y-4">
              <PresentBox 
                unlocked={gameState.flowerMatch}
                title="Cupón de Princesa"
                content="Cupón para un día de Princess Treatment a otro nivel. Cocinaré una cena romática, masajes, you name it... ♥"
              />
              
              <PresentBox 
                unlocked={gameState.cupcakeCatch}
                title="Cupón de Cena"
                content="Cupón para una cena romántica! Me encantó el último restaurante que visitamos juntos."
              />
              
              <PresentBox 
                unlocked={gameState.heartJump}
                title="Cupón de un Viaje"
                content="Cupón para un viaje a París! Será la siguiente capital que visitemos juntos."
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="mt-12 py-4 text-center font-pixel text-sm text-pink-500">
        <span className="relative">
          Hecho con 
          <svg className="inline-block w-4 h-4 mx-1 text-pink-500 animate-pulse" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
          solo para ti!
        </span>
      </div>
    </div>
  );
};

export default GamingHub;