"use client";

import { useState, useEffect } from 'react';
import { Heart, Gift, Trophy } from 'lucide-react';

// This component needs client-side features
// use client

// Custom Pixel Button component
const PixelButton = ({ onClick, color, children, completed, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative px-6 py-3 font-pixel text-white 
        transition-all duration-200 
        ${color} 
        border-b-4 border-r-4 
        ${completed ? 'border-green-700 bg-green-500' : 'border-opacity-50 border-black'} 
        ${disabled ? 'opacity-70 cursor-not-allowed' : 'hover:translate-y-1 hover:border-b-2 active:translate-y-2 active:border-b-0'}
        before:absolute before:top-0 before:left-0 before:w-full before:h-full
        before:border-2 before:border-white before:border-opacity-20
      `}
    >
      <div className="flex items-center justify-center gap-2">
        {children}
        {completed && <Trophy size={16} className="ml-1 animate-pulse" />}
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
        border-2 border-dashed ${unlocked ? 'border-pink-400' : 'border-gray-400'}
      `}
    >
      <div className="flex items-center gap-2 mb-2">
        <Gift 
          size={24} 
          className={`${unlocked ? 'text-pink-500' : 'text-gray-500'} ${isOpen && unlocked ? 'animate-bounce' : ''}`} 
        />
        <h3 className={`font-pixel text-lg ${unlocked ? 'text-pink-600' : 'text-gray-500'}`}>
          {unlocked ? title : "Locked Present"}
        </h3>
      </div>
      
      {unlocked && isOpen && (
        <div className="mt-3 p-3 bg-white rounded-md border border-pink-300 font-pixel text-sm animate-fadeIn">
          <p>{content}</p>
        </div>
      )}
      
      {unlocked && !isOpen && (
        <p className="text-xs text-pink-400 font-pixel">Click to open!</p>
      )}
      
      {!unlocked && (
        <p className="text-xs text-gray-500 font-pixel">Complete a game to unlock!</p>
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

const GamingHub = () => {
  // Game state
  const [gameState, setGameState] = useState({
    flowerMatch: false,
    cupcakeCatch: false,
    heartJump: false
  });

  // Load game state from localStorage on component mount
  useEffect(() => {
    const savedState = localStorage.getItem('gameState');
    if (savedState) {
      setGameState(JSON.parse(savedState));
    }
  }, []);

  // Save game state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('gameState', JSON.stringify(gameState));
  }, [gameState]);

  // Mock function to navigate to a game
  const navigateToGame = (game) => {
    // In a real app, this would navigate to the game
    console.log(`Navigating to ${game} game`);
    
    // For demo purposes, this simulates completing a game
    if (window.confirm(`Do you want to simulate completing the ${game} game?`)) {
      const newGameState = { ...gameState };
      newGameState[game] = true;
      setGameState(newGameState);
    }
  };

  // Calculate total progress
  const completedGames = Object.values(gameState).filter(Boolean).length;
  const totalGames = Object.keys(gameState).length;
  const progressPercentage = (completedGames / totalGames) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-pink-100">
      {/* Decorative elements */}
      <div className="fixed inset-0 pointer-events-none">
        <PixelHeart size="w-6 h-6" color="bg-pink-300" />
        <PixelStar size="w-8 h-8" color="bg-yellow-200" />
        <PixelHeart size="w-4 h-4" color="bg-pink-400" />
        <PixelStar size="w-5 h-5" color="bg-purple-200" />
      </div>
      
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-pixel text-purple-700 mb-4 tracking-wide">
            Retro Gaming Hub
          </h1>
          <p className="font-pixel text-pink-600 text-lg">Your special adventure awaits!</p>
          
          {/* Progress bar */}
          <div className="mt-6 w-full bg-gray-200 rounded-full h-6 border-2 border-purple-300">
            <div 
              className="bg-gradient-to-r from-pink-400 to-purple-500 h-full rounded-full transition-all duration-500 flex items-center justify-center text-xs font-pixel text-white"
              style={{ width: `${progressPercentage}%` }}
            >
              {completedGames}/{totalGames}
            </div>
          </div>
        </div>
        
        {/* Main content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Game selection */}
          <div className="md:col-span-2 bg-white rounded-xl p-6 shadow-lg border-4 border-purple-300">
            <h2 className="text-2xl font-pixel text-purple-600 mb-6 flex items-center">
              <Heart size={24} className="mr-2 text-pink-500" /> 
              Choose a Game
            </h2>
            
            <div className="grid grid-cols-1 gap-4">
              {/* Game 1 */}
              <div className="p-4 bg-pink-50 rounded-lg border-2 border-pink-200">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="bg-pink-400 w-12 h-12 rounded-lg flex items-center justify-center mr-4">
                      <div className="pixel-flower w-8 h-8"></div>
                    </div>
                    <div>
                      <h3 className="font-pixel text-xl text-pink-600">Pixel Flower Match</h3>
                      <p className="text-sm text-pink-500">Memory game with pixelated flowers</p>
                    </div>
                  </div>
                  <PixelButton 
                    onClick={() => navigateToGame('flowerMatch')}
                    color="bg-pink-500"
                    completed={gameState.flowerMatch}
                  >
                    {gameState.flowerMatch ? 'Completed' : 'Play Now'}
                  </PixelButton>
                </div>
              </div>
              
              {/* Game 2 */}
              <div className="p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="bg-purple-400 w-12 h-12 rounded-lg flex items-center justify-center mr-4">
                      <div className="pixel-cupcake w-8 h-8"></div>
                    </div>
                    <div>
                      <h3 className="font-pixel text-xl text-purple-600">Cupcake Catch</h3>
                      <p className="text-sm text-purple-500">Catch falling treats, avoid bombs</p>
                    </div>
                  </div>
                  <PixelButton 
                    onClick={() => navigateToGame('cupcakeCatch')}
                    color="bg-purple-500"
                    completed={gameState.cupcakeCatch}
                  >
                    {gameState.cupcakeCatch ? 'Completed' : 'Play Now'}
                  </PixelButton>
                </div>
              </div>
              
              {/* Game 3 */}
              <div className="p-4 bg-red-50 rounded-lg border-2 border-red-200">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="bg-red-400 w-12 h-12 rounded-lg flex items-center justify-center mr-4">
                      <div className="pixel-heart w-8 h-8"></div>
                    </div>
                    <div>
                      <h3 className="font-pixel text-xl text-red-500">Heart Jump</h3>
                      <p className="text-sm text-red-400">Platform game to collect hearts</p>
                    </div>
                  </div>
                  <PixelButton 
                    onClick={() => navigateToGame('heartJump')}
                    color="bg-red-400"
                    completed={gameState.heartJump}
                  >
                    {gameState.heartJump ? 'Completed' : 'Play Now'}
                  </PixelButton>
                </div>
              </div>
            </div>
          </div>
          
          {/* Presents section */}
          <div className="bg-white rounded-xl p-6 shadow-lg border-4 border-pink-300">
            <h2 className="text-2xl font-pixel text-pink-600 mb-6 flex items-center">
              <Gift size={24} className="mr-2 text-pink-500" /> 
              Your Presents
            </h2>
            
            <div className="space-y-4">
              <PresentBox 
                unlocked={gameState.flowerMatch}
                title="Special Message"
                content="You're the most beautiful flower in my garden! I love you more each day. ♥"
              />
              
              <PresentBox 
                unlocked={gameState.cupcakeCatch}
                title="Date Coupon"
                content="Redeem for one fancy dinner date of your choice! I'll take you anywhere you want to go."
              />
              
              <PresentBox 
                unlocked={gameState.heartJump}
                title="Sweet Surprise"
                content="Check under your pillow tonight for a special surprise I've hidden for you!"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="mt-12 py-4 text-center font-pixel text-sm text-pink-500">
        Made with ♥ just for you!
      </div>
      
      {/* CSS for pixel art elements */}
      <style jsx>{`
        @font-face {
          font-family: 'PixelFont';
          src: url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
        }
        
        .font-pixel {
          font-family: 'PixelFont', monospace;
          letter-spacing: 1px;
        }
        
        .pixel-heart {
          position: absolute;
          clip-path: polygon(
            50% 0%, 65% 15%, 85% 15%, 100% 30%, 100% 60%, 
            85% 75%, 65% 85%, 50% 100%, 35% 85%, 15% 75%, 
            0% 60%, 0% 30%, 15% 15%, 35% 15%
          );
          top: 15%;
          left: 10%;
        }
        
        .pixel-star {
          position: absolute;
          clip-path: polygon(
            50% 0%, 61% 35%, 98% 35%, 68% 57%, 
            79% 91%, 50% 70%, 21% 91%, 32% 57%, 
            2% 35%, 39% 35%
          );
          top: 30%;
          right: 15%;
        }
        
        .pixel-flower {
          background-color: #F472B6;
          position: relative;
          border-radius: 50%;
        }
        
        .pixel-flower:before, .pixel-flower:after {
          content: '';
          position: absolute;
          background-color: #F472B6;
          border-radius: 50%;
          width: 50%;
          height: 50%;
        }
        
        .pixel-flower:before {
          top: -25%;
          left: 25%;
        }
        
        .pixel-flower:after {
          bottom: -25%;
          left: 25%;
        }
        
        .pixel-cupcake {
          background-color: #C084FC;
          position: relative;
          clip-path: polygon(
            0% 50%, 0% 100%, 100% 100%, 100% 50%,
            80% 50%, 80% 20%, 65% 10%, 35% 10%, 20% 20%, 20% 50%
          );
        }
        
        .pixel-cupcake:before {
          content: '';
          position: absolute;
          background-color: #F9A8D4;
          width: 20%;
          height: 20%;
          top: 5%;
          left: 40%;
          border-radius: 50%;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-spin-slow {
          animation: spin 12s linear infinite;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-in-out;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default GamingHub;