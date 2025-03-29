'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import LoadingGame from '@/components/LoadingGame';

/**
 * GameWrapper component
 * Handles authentication, loading state, and game state initialization
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - The game component to render
 * @param {string} props.gameName - Name of the game for loading message
 */
export default function GameWrapper({ children, gameName = 'Game' }) {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);
  
  useEffect(() => {
    // Check if user is authenticated
    try {
      // First check localStorage
      let isAuthenticated = localStorage.getItem('isAuthenticated');
      
      // If not found in localStorage, check sessionStorage for temporary state
      if (isAuthenticated !== 'true') {
        const tempAuth = sessionStorage.getItem('tempAuthState');
        if (tempAuth === 'true') {
          localStorage.setItem('isAuthenticated', 'true');
          isAuthenticated = 'true';
          // Clear the temporary storage
          sessionStorage.removeItem('tempAuthState');
        }
      }
      
      if (isAuthenticated === 'true') {
        setAuthenticated(true);
      } else {
        // Use a timeout to ensure we don't redirect during render
        setTimeout(() => {
          router.push('/');
        }, 0);
      }
    } catch (error) {
      console.error("Authentication check error:", error);
      // On error, redirect to be safe
      setTimeout(() => {
        router.push('/');
      }, 0);
    } finally {
      setChecking(false);
    }
  }, [router]);
  
  // Initialize game state
  useEffect(() => {
    // Ensure the gameState structure exists in localStorage
    try {
      const gameState = localStorage.getItem('gameState');
      if (!gameState) {
        localStorage.setItem('gameState', JSON.stringify({
          flowerMatch: false,
          cupcakeCatch: false,
          heartJump: false
        }));
      }
    } catch (error) {
      console.error("Error initializing game state:", error);
    }
  }, []);
  
  // Return a loading state while checking auth
  if (checking) {
    return <LoadingGame gameName={gameName} />;
  }
  
  // Only render children if authenticated
  return authenticated ? (
    <Suspense fallback={<LoadingGame gameName={gameName} />}>
      {children}
    </Suspense>
  ) : <LoadingGame gameName={gameName} />;
}