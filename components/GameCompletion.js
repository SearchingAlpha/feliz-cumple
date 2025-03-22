'use client';

import { useRouter } from 'next/navigation';
import { Trophy } from 'lucide-react';

/**
 * GameCompletion component to be used across all games
 * 
 * @param {Object} props Component props
 * @param {string} props.gameId The game identifier (e.g., 'flowerMatch')
 * @param {number} props.score Optional score or stats to display
 * @param {string} props.scoreLabel Optional label for the score (e.g., 'Moves', 'Points')
 * @param {Function} props.onRestart Function to call when user clicks Restart
 * @param {string} props.customMessage Optional custom victory message
 */
export default function GameCompletion({
  gameId,
  score,
  scoreLabel = 'Score',
  onRestart,
  customMessage
}) {
  const router = useRouter();
  
  // Mark the game as completed and return to hub
  const handleMarkAsCompleted = () => {
    try {
      // Get current game state or initialize if not exist
      const gameState = JSON.parse(localStorage.getItem('gameState') || 
        '{"flowerMatch":false,"cupcakeCatch":false,"heartJump":false}');
      
      // Mark this specific game as completed
      gameState[gameId] = true;
      
      // Save to localStorage
      localStorage.setItem('gameState', JSON.stringify(gameState));
      
      // Dispatch event for game hub to detect change
      const event = new CustomEvent('gameStateChanged', { 
        detail: { game: gameId, completed: true } 
      });
      window.dispatchEvent(event);
      
      // Navigate back to hub
      router.push('/hub');
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