'use client';

// app/game/cupcake-catch/page.js
import { Suspense, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';

// Import the game component dynamically
const CupcakeCatch = dynamic(() => import('@/components/CupcakeCatch'), {
  ssr: false,
  loading: () => <LoadingGame />
});

// Simple loading component
function LoadingGame() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="pixel-loading mb-4"></div>
      <p className="font-pixel text-purple-600">Loading Cupcake Catch...</p>
    </div>
  );
}

// Authentication check component with safer redirect
function AuthCheck({ children }) {
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
  
  // Return a loading state while checking auth
  if (checking) {
    return <LoadingGame />;
  }
  
  // Only render children if authenticated
  return authenticated ? children : <LoadingGame />;
}

// Component to directly initialize game state
function GameStateInitializer() {
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

  return null;
}

export default function CupcakeCatchPage() {
  return (
    <AuthCheck>
      <GameStateInitializer />
      <main>
        <Suspense fallback={<LoadingGame />}>
          <CupcakeCatch />
        </Suspense>
      </main>
    </AuthCheck>
  );
}