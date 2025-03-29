'use client';

import Image from 'next/image';
import { Heart, Trophy, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import Image2 from '@/public/image2.png';

/**
 * CompletionReward component
 * Shows special reward when all games are completed
 * 
 * @param {Object} props
 * @param {Object} props.gameState - The current game state
 */
export default function CompletionReward({ gameState, showManually = false }) {
  const [allCompleted, setAllCompleted] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  
  // Function to display the reward
  const displayReward = () => {
    // Enable scrolling when modal is shown
    document.body.style.overflow = "auto";
    setShowAnimation(true);
  };
  
  // Check if all games are completed
  useEffect(() => {
    if (!gameState) return;
    
    const isAllCompleted = 
      gameState.flowerMatch === true && 
      gameState.cupcakeCatch === true && 
      gameState.heartJump === true;
      setAllCompleted(isAllCompleted);
    
      // Show animation if all completed - only on initial completion
      if (isAllCompleted && !showManually) {
        setTimeout(() => {
          displayReward();
        }, 500);
      }
    }, [gameState, showManually]);
    
    // Log gameState for debugging
    useEffect(() => {
      console.log("CompletionReward received gameState:", gameState);
      console.log("All completed?", allCompleted);
      console.log("Show manually?", showManually);
    }, [gameState, allCompleted, showManually]);
    
    // Handle manual display trigger
    useEffect(() => {
      if (showManually && allCompleted) {
        setTimeout(() => {
          displayReward();
        }, 100);
      }
    }, [showManually, allCompleted]);
    
   // Function to close modal
  const closeModal = () => {
    console.log("Closing reward modal");
    setShowAnimation(false);
    
    // Ensure the modal is completely removed from the DOM before enabling interactions
    setTimeout(() => {
      document.body.style.overflow = "auto";
      
      // Let the parent component know the modal is closed
      if (window && window.dispatchEvent) {
        window.dispatchEvent(new CustomEvent('modalClosed'));
      }
    }, 500);
  }
  
  if (!allCompleted) return null;
  
  // If not showing animation, don't render the component at all to prevent it from blocking clicks
  if (!showAnimation) return null;
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70 transition-opacity duration-500 overflow-y-auto p-4 opacity-100">
      <div className="bg-white rounded-xl border-4 border-pink-400 p-6 max-w-2xl transition-all transform duration-500 max-h-[90vh] overflow-y-auto scale-100 opacity-100">          <div className="text-center mb-4">
            <h2 className="text-2xl font-pixel text-pink-600 flex items-center justify-center">
              <Trophy className="mr-2 text-yellow-500" size={24} />
              ¡Completaste todos los juegos!
              <Trophy className="ml-2 text-yellow-500" size={24} />
            </h2>
            <p className="text-purple-500 font-pixel mt-4">¡Aquí tienes tu premio especial!</p>
        </div>
          
          {/* Special reward image */}
          <div className="mt-6 mb-6 relative">
            <div className="relative p-4 bg-gradient-to-r from-pink-100 to-purple-100 rounded-lg border-2 border-pink-300">
              {/* Sparkles decoration */}
              <div className="absolute -top-3 -left-3 text-yellow-400 animate-pulse">
                <Sparkles size={24} />
              </div>
              <div className="absolute -top-3 -right-3 text-yellow-400 animate-pulse" style={{ animationDelay: '0.3s' }}>
                <Sparkles size={24} />
              </div>
              <div className="absolute -bottom-3 -left-3 text-yellow-400 animate-pulse" style={{ animationDelay: '0.6s' }}>
                <Sparkles size={24} />
              </div>
              <div className="absolute -bottom-3 -right-3 text-yellow-400 animate-pulse" style={{ animationDelay: '0.9s' }}>
                <Sparkles size={24} />
              </div>
              
              <Image 
                src={Image2}
                width={500} 
                height={600} 
                alt="Pixel Art Couple Kissing"
                className="w-full h-auto rounded" 
              />
              
              {/* Floating hearts */}
              <div className="absolute top-1/4 left-0 text-pink-500 animate-float">
                <Heart size={16} fill="currentColor" />
              </div>
              <div className="absolute top-1/3 right-0 text-pink-500 animate-float" style={{ animationDelay: '0.5s' }}>
                <Heart size={20} fill="currentColor" />
              </div>
              <div className="absolute bottom-1/3 left-1/4 text-pink-500 animate-float" style={{ animationDelay: '1s' }}>
                <Heart size={14} fill="currentColor" />
              </div>
              <div className="absolute top-1/2 right-1/4 text-pink-500 animate-float" style={{ animationDelay: '1.5s' }}>
                <Heart size={18} fill="currentColor" />
              </div>
            </div>
          </div>
          
          {/* Special message */}
          <div className="text-center mt-4 p-4 bg-pink-50 rounded-lg border border-pink-200">
            <p className="text-pink-600 font-pixel text-sm">¡Te amo mucho! Gracias por ser parte de mi vida. ❤️</p>
            <p className="text-purple-500 font-pixel text-xs mt-3">Todos los cupones están listos para ser usados cuando quieras.</p>
          </div>
          
          {/* Close button */}
          <div className="text-center mt-6">
            <button 
              onClick={closeModal}
              className="px-6 py-3 bg-pink-500 text-white rounded-xl 
                      border-b-4 border-r-4 border-opacity-50 border-black
                      hover:translate-y-1 hover:border-b-2 active:translate-y-2 active:border-b-0
                      font-pixel text-sm transition-all duration-200"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    );
  }