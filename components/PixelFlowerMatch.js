'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Flower colors for the pixel art flowers
const FLOWER_COLORS = [
  '#FF9FF3', // Pink
  '#FECA57', // Yellow
  '#FF6B6B', // Red
  '#1DD1A1', // Green
  '#5F27CD', // Purple
  '#54A0FF', // Blue
  '#FF9FF3', // Pink (duplicate for pairs)
  '#FECA57', // Yellow (duplicate for pairs)
  '#FF6B6B', // Red (duplicate for pairs)
  '#1DD1A1', // Green (duplicate for pairs)
  '#5F27CD', // Purple (duplicate for pairs)
  '#54A0FF', // Blue (duplicate for pairs)
];

// Simple pixel art flower component using CSS
function PixelFlower({ color, isFlipped, onClick }) {
  return (
    <div 
      className={`w-full h-full flex items-center justify-center cursor-pointer transition-all duration-300 ${
        isFlipped ? 'transform rotate-0' : 'bg-pink-200 transform rotate-180'
      }`}
      onClick={onClick}
    >
      {isFlipped && (
        <div className="relative w-10 h-10 md:w-16 md:h-16">
          {/* Flower center */}
          <div 
            className="absolute inset-1/4 rounded-full" 
            style={{ backgroundColor: '#FFFF00' }}
          />
          
          {/* Flower petals */}
          <div 
            className="absolute top-0 left-1/3 right-1/3 h-1/4 rounded-t-full" 
            style={{ backgroundColor: color }}
          />
          <div 
            className="absolute bottom-0 left-1/3 right-1/3 h-1/4 rounded-b-full" 
            style={{ backgroundColor: color }}
          />
          <div 
            className="absolute left-0 top-1/3 bottom-1/3 w-1/4 rounded-l-full" 
            style={{ backgroundColor: color }}
          />
          <div 
            className="absolute right-0 top-1/3 bottom-1/3 w-1/4 rounded-r-full" 
            style={{ backgroundColor: color }}
          />
        </div>
      )}
    </div>
  );
}

export default function PixelFlowerMatch() {
  const router = useRouter();
  const [cards, setCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [moves, setMoves] = useState(0);

  // Initialize game
  useEffect(() => {
    initializeGame();
    
    // Check if the game was already completed
    const gameState = JSON.parse(localStorage.getItem('gameState') || '{}');
    if (gameState.flowerMatch) {
      // If the game is already completed, we don't need to reset it
      // This prevents resetting progress if the user navigates back to the game
    }
  }, []);

  // Check for matches when two cards are flipped
  useEffect(() => {
    if (flippedIndices.length === 2) {
      const [firstIndex, secondIndex] = flippedIndices;
      
      // Increment moves counter
      setMoves(prevMoves => prevMoves + 1);
      
      if (cards[firstIndex] === cards[secondIndex]) {
        // Match found
        setMatchedPairs(prevMatched => [...prevMatched, cards[firstIndex]]);
        setFlippedIndices([]);
      } else {
        // No match, flip cards back after delay
        const timer = setTimeout(() => {
          setFlippedIndices([]);
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [flippedIndices, cards]);

  // Check if game is completed
  useEffect(() => {
    if (matchedPairs.length === FLOWER_COLORS.length / 2 && !gameCompleted) {
      const timer = setTimeout(() => {
        setGameCompleted(true);
        // Save game completion
        saveGameCompletion();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [matchedPairs, gameCompleted]);

  // Initialize game by shuffling colors
  function initializeGame() {
    const shuffledColors = [...FLOWER_COLORS]
      .sort(() => Math.random() - 0.5);
    
    setCards(shuffledColors);
    setFlippedIndices([]);
    setMatchedPairs([]);
    setGameCompleted(false);
    setMoves(0);
  }

  // Handle card click
  function handleCardClick(index) {
    // Ignore click if card is already flipped or matched
    if (
      flippedIndices.includes(index) || 
      matchedPairs.includes(cards[index]) ||
      flippedIndices.length >= 2 ||
      gameCompleted
    ) {
      return;
    }

    setFlippedIndices(prev => [...prev, index]);
  }

  // Save game completion to localStorage and ensure it's visible in the hub
  async function saveGameCompletion() {
    try {
      // Update the game state in localStorage to match the format used in the hub
      const gameState = JSON.parse(localStorage.getItem('gameState') || '{"flowerMatch":false,"cupcakeCatch":false,"heartJump":false}');
      gameState.flowerMatch = true;
      localStorage.setItem('gameState', JSON.stringify(gameState));
      
      console.log("Game completion saved:", gameState);
      
      // In a real implementation, you would call your Node.js backend
      // await fetch('/api/games/complete', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ game: 'flowerMatch' })
      // });
    } catch (error) {
      console.error('Failed to save game completion:', error);
    }
  }

  function returnToHub() {
    router.push('/hub');
  }

  // Add some celebratory particles when the game is completed
  function CelebrationEffect() {
    return (
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-3 h-3 bg-pink-400 rounded-full animate-float"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-pink-100 to-purple-100 p-4 relative">
      {gameCompleted && <CelebrationEffect />}
      
      <div className="w-full max-w-md">
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold text-pink-600 mb-2 font-pixel">Pixel Flower Match</h1>
          <p className="text-pink-500 mb-2">Find all matching flower pairs!</p>
          <p className="text-pink-500 mb-4">Moves: {moves}</p>
        </div>

        {gameCompleted ? (
          <div className="text-center bg-white p-6 rounded-lg shadow-lg">
            <div className="text-xl font-bold text-pink-600 mb-2 font-pixel">🎉 You Won! 🎉</div>
            <p className="text-pink-500 mb-4">You found all the matching flowers in {moves} moves!</p>
            <div className="flex justify-center space-x-4">
              <button 
                onClick={() => {
                  // Only reinitialize the game, but keep completion status
                  initializeGame();
                  // Immediately mark as completed so the hub shows it correctly
                  saveGameCompletion();
                }}
                className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition font-pixel"
              >
                Play Again
              </button>
              <button 
                onClick={returnToHub}
                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition font-pixel"
              >
                Return to Hub
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-3 md:grid-cols-4 gap-2 bg-white p-4 rounded-lg shadow-lg">
            {cards.map((color, index) => (
              <div key={index} className="aspect-square border-2 border-pink-300 rounded-lg overflow-hidden">
                <PixelFlower 
                  color={color}
                  isFlipped={flippedIndices.includes(index) || matchedPairs.includes(color)}
                  onClick={() => handleCardClick(index)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}