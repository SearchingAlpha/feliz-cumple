'use client';

import dynamic from 'next/dynamic';
import { Suspense, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Import LandingPage dynamically
const LandingPage = dynamic(() => import('@/components/LandingPage'), {
  ssr: false,
  loading: () => <LoadingScreen />
});

// Simple loading screen
function LoadingScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-pink-100 to-purple-200">
      <div className="pixel-loading mb-4"></div>
      <p className="font-pixel text-pink-600">Loading...</p>
    </div>
  );
}

// App initialization component
function AppInitializer() {
  const router = useRouter();
  
  useEffect(() => {
    // Check if already authenticated to possibly skip login
    console.log("Checking initial auth state");
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    console.log("Initial auth state:", isAuthenticated);
    
    // Initialize game state if it doesn't exist
    try {
      const gameState = localStorage.getItem('gameState');
      if (!gameState) {
        console.log("Initializing game state");
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
  
  return null;
}

export default function Home() {
  return (
    <>
      <AppInitializer />
      <Suspense fallback={<LoadingScreen />}>
        <LandingPage />
      </Suspense>
    </>
  );
}