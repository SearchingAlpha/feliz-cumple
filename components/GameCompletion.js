'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Trophy } from 'lucide-react';
import { markGameAsCompleted } from '@/lib/gameState';
import '../app/globals.css';

/**
 * GameCompletion component using the utility function
 */
export default function GameCompletion({
  gameId,
  score,
  scoreLabel = 'Score',
  onRestart,
  customMessage
}) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  
  // Handle marking the game as completed
  const handleMarkAsCompleted = () => {
    setIsSaving(true);
    setSaveError('');
    
    try {
      // Use the utility function to mark the game as completed
      const success = markGameAsCompleted(gameId);
      
      if (success) {
        // Add a small delay before navigation
        setTimeout(() => {
          router.push('/hub');
        }, 100);
      } else {
        setSaveError('Failed to save progress. Please try again.');
      }
    } catch (error) {
      console.error('Error saving game completion:', error);
      setSaveError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Default victory message
  const defaultMessage = "Felicidades! Has completado el juego!";
  
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
      
      {/* Show error message if there was an error */}
      {saveError && (
        <div className="mb-4 p-2 bg-red-100 rounded-md">
          <p className="text-red-600 text-sm">{saveError}</p>
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
          disabled={isSaving}
        >
          Restart
        </button>
        
        <button 
          onClick={handleMarkAsCompleted}
          className="px-6 py-3 bg-pink-500 text-white rounded-xl
                    border-b-4 border-r-4 border-opacity-50 border-black
                    hover:translate-y-1 hover:border-b-2 active:translate-y-2 active:border-b-0
                    font-pixel text-sm transition-all duration-200"
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Marcar como completado'}
        </button>
      </div>
    </div>
  );
}