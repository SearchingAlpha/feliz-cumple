'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import HeartJump from '@/components/HeartJump';
import { markGameAsCompleted } from '@/lib/gameState';

export default function HeartJumpGameWrapper() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Check authentication on mount
  useEffect(() => {
    // Check if user is authenticated
    try {
      // First check localStorage
      let authenticated = localStorage.getItem('isAuthenticated');
      
      // If not found in localStorage, check sessionStorage for temporary state
      if (authenticated !== 'true') {
        const tempAuth = sessionStorage.getItem('tempAuthState');
        if (tempAuth === 'true') {
          localStorage.setItem('isAuthenticated', 'true');
          authenticated = 'true';
          // Clear the temporary storage
          sessionStorage.removeItem('tempAuthState');
        }
      }
      
      if (authenticated === 'true') {
        setIsAuthenticated(true);
      } else {
        // Redirect to login page if not authenticated
        setTimeout(() => {
          router.push('/');
        }, 100);
      }
    } catch (error) {
      console.error("Authentication check error:", error);
      // On error, redirect to be safe
      setTimeout(() => {
        router.push('/');
      }, 100);
    } finally {
      setIsLoading(false);
    }
    
    // Initialize game state if needed
    try {
      const gameState = localStorage.getItem('gameState');
      if (!gameState) {
        // If no gameState exists, initialize it
        localStorage.setItem('gameState', JSON.stringify({
          flowerMatch: false,
          cupcakeCatch: false,
          heartJump: false
        }));
      }
    } catch (error) {
      console.error("Error initializing game state:", error);
    }
  }, [router]);
  
  // Handler for when game is completed
  const handleGameCompletion = () => {
    try {
      markGameAsCompleted('heartJump');
      // Success notification could be added here
    } catch (error) {
      console.error("Error saving game completion:", error);
    }
  };
  
  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-pink-200 to-purple-200">
        <div className="pixel-loading mb-4"></div>
        <p className="font-pixel text-purple-600">Loading Heart Runner...</p>
      </div>
    );
  }
  
  // If authenticated, show the game
  return isAuthenticated ? (
    <HeartJump onComplete={handleGameCompletion} />
  ) : null; // Will redirect in the useEffect
}