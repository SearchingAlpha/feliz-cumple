// ViewRewardButton.js
'use client';

import { Trophy, Heart } from 'lucide-react';

/**
 * Button to view the completion reward when all games are completed
 * 
 * @param {Object} props
 * @param {Object} props.gameState - Current game state
 * @param {Function} props.onShowReward - Function to call when button is clicked
 */
export default function ViewRewardButton({ gameState, onShowReward }) {
  if (!gameState) return null;
  
  // Check if all games are completed
  const allCompleted = 
    gameState.flowerMatch === true && 
    gameState.cupcakeCatch === true && 
    gameState.heartJump === true;
  
  if (!allCompleted) return null;
  
  return (
    <button
      onClick={onShowReward}
      className="flex items-center justify-center gap-2 px-6 py-3 mt-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl 
                border-b-4 border-r-4 border-opacity-50 border-black
                hover:translate-y-1 hover:border-b-2 active:translate-y-2 active:border-b-0
                font-pixel text-sm transition-all duration-200 w-full md:w-auto animate-pulse"
    >
      <Trophy size={18} className="text-yellow-300" />
      <span>Ver Recompensa Especial</span>
      <Heart size={16} className="text-pink-300" fill="currentColor" />
    </button>
  );
}