'use client';

import { useRouter } from 'next/navigation';
import { Trophy } from 'lucide-react';
import { useEffect } from 'react';

export default function GameCompletion({
  gameId,
  score,
  scoreLabel = 'Score',
  onRestart,
  customMessage
}) {
  const router = useRouter();
  
  // Debug log the game ID to make sure it's correct
  useEffect(() => {
    console.log(`Game completion mounted for: ${gameId}`);
    
    try {
      const currentState = localStorage.getItem('gameState');
      console.log('Current game state:', currentState);
    } catch (error) {
      console.error('Error reading game state:', error);
    }
  }, [gameId]);
  
  // Handle marking the game as completed
  const handleMarkAsCompleted = () => {
    try {
      console.log(`Marking game ${gameId} as completed`);
      
      // Define the default state
      const defaultState = {
        flowerMatch: false,
        cupcakeCatch: false,
        heartJump: false
      };
      
      // Get the current state
      let gameState;
      try {
        const savedState = localStorage.getItem('gameState');
        console.log('Retrieved game state:', savedState);
        
        if (savedState) {
          gameState = JSON.parse(savedState);
        } else {
          console.log('No existing game state found, using default');
          gameState = defaultState;
        }
      } catch (error) {
        console.error('Error parsing game state, using default:', error);
        gameState = defaultState;
      }
      
      // Mark this game as completed
      gameState[gameId] = true;
      console.log('Updated game state:', gameState);
      
      // Save back to localStorage
      const stringifiedState = JSON.stringify(gameState);
      localStorage.setItem('gameState', stringifiedState);
      console.log('Saved game state to localStorage:', stringifiedState);
      
      // CRITICAL: Force a global flag to be checked on hub page load
      localStorage.setItem('gameStateUpdated', 'true');
      
      // Also store in sessionStorage as backup
      sessionStorage.setItem('gameStateBackup', stringifiedState);
      console.log('Backup saved to sessionStorage');
      
      // Delay navigation slightly to ensure storage is updated
      setTimeout(() => {
        console.log('Navigating to hub...');
        router.push('/hub');
      }, 200);
      
    } catch (error) {
      console.error('Failed to save game completion:', error);
      alert('There was an error saving your progress. Please try again.');
    }
  };
  
  // Default victory message
  const defaultMessage = "Congratulations! You've completed the game!";
  
  return (
    <div className="text-center bg-white p-6 rounded-lg shadow-lg border-4 border-pink-300 animate-fadeIn">
      {/* Victory header with trophy icon */}
      <div className="flex items-center justify-center mb-4">
        <Trophy className="text-yellow-500 mr-2" size={24} />
        <h2 className="text-xl font-bold text-pink-600 font-pixel">Victory!</h2>
        <Trophy className="text-yellow-500 ml-2" size={24} />
      </div>
      
      {/* Victory message */}
      <p className="text-pink-500 mb-4 font-pixel text-sm">
        {customMessage || defaultMessage}
      </p>
      
      {/* Display score if provided */}
      {score !== undefined && (
        <div className="mb-6 p-3 bg-pink-50 rounded-lg">
          <p className="text-pink-600 font-pixel">
            {scoreLabel}: <span className="text-lg">{score}</span>
          </p>
        </div>
      )}
      
      {/* Confetti decoration */}
      <div className="relative h-8 mb-6 overflow-hidden">
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i}
              className="absolute w-1 h-1 rounded-full"
              style={{
                backgroundColor: ['#FF9FF3', '#FECA57', '#FF6B6B', '#1DD1A1', '#5F27CD'][i % 5],
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: 0.7
              }}
            />
          ))}
        </div>
      </div>
      
      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <button 
          onClick={onRestart}
          className="px-6 py-3 bg-purple-500 text-white rounded-xl 
                    border-b-4 border-r-4 border-opacity-50 border-black
                    hover:translate-y-1 hover:border-b-2 active:translate-y-2 active:border-b-0
                    font-pixel text-sm transition-all duration-200"
        >
          Restart
        </button>
        
        <button 
          onClick={handleMarkAsCompleted}
          className="px-6 py-3 bg-pink-500 text-white rounded-xl
                    border-b-4 border-r-4 border-opacity-50 border-black
                    hover:translate-y-1 hover:border-b-2 active:translate-y-2 active:border-b-0
                    font-pixel text-sm transition-all duration-200"
        >
          Mark as Completed
        </button>
      </div>
    </div>
  );
}