'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import GameCompletion from '@/components/GameCompletion';
import GameInstructions from '@/components/GameInstructions';
import '../app/globals.css';

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
  const [gameStarted, setGameStarted] = useState(false);

  // Initialize game
  const initializeGame = () => {
    const shuffledColors = [...FLOWER_COLORS]
      .sort(() => Math.random() - 0.5);
    
    setCards(shuffledColors);
    setFlippedIndices([]);
    setMatchedPairs([]);
    setGameCompleted(false);
    setMoves(0);
    setGameStarted(true);
    
    // Check if the game was already completed in localStorage
    try {
      const gameState = JSON.parse(localStorage.getItem('gameState') || '{}');
      if (gameState.flowerMatch) {
        // If the game is already completed in storage, we should still allow the user to play
        // but don't automatically show completion screen
      }
    } catch (error) {
      console.error("Error checking game completion status:", error);
    }
  };

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
    // Only trigger completion logic if all pairs are matched and game isn't already marked as completed
    if (matchedPairs.length === FLOWER_COLORS.length / 2 && !gameCompleted && gameStarted) {
      const timer = setTimeout(() => {
        setGameCompleted(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [matchedPairs, gameCompleted, gameStarted]);

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

  // Define game instructions
  const instructions = [
    "Click on cards to flip them",
    "Find matching pairs of flowers",
    "Remember the locations to make fewer moves"
  ];

  // If game hasn't started yet, show instructions
  if (!gameStarted) {
    return (
      <GameInstructions
        title="Pixel Flower Match"
        instructions={instructions}
        goal="Find all matching flower pairs in as few moves as possible!"
        onStart={initializeGame}
      />
    );
  }
  
  // If game is completed, show completion screen
  if (gameCompleted) {
    return (
      <GameCompletion
        gameId="flowerMatch"
        score={moves}
        scoreLabel="Moves"
        customMessage="Great job! You found all the matching flowers!"
        onRestart={initializeGame}
      />
    );
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
      </div>
    </div>
  );
}