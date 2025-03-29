'use client';

// app/hub/page.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import GamingHub from '@/components/GamingHub';
import CompletionReward from '@/components/CompletionReward';

// Loading component
function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="pixel-loading mb-4"></div>
      <p className="font-pixel text-pink-600">Loading Hub...</p>
    </div>
  );
}

// Function to initialize localStorage if it doesn't exist yet
function EnsureStorage() {
  useEffect(() => {
    try {
      console.log("Checking for game state in hub page");
      
      // Check if localStorage exists and has gameState
      const currentState = localStorage.getItem('gameState');
      if (!currentState) {
        console.log("No game state found, initializing");
        localStorage.setItem('gameState', JSON.stringify({
          flowerMatch: false,
          cupcakeCatch: false,
          heartJump: false
        }));
      } else {
        console.log("Existing game state found:", currentState);
      }
      
      // Check for backup in sessionStorage
      const backupState = sessionStorage.getItem('gameStateBackup');
      if (backupState) {
        console.log("Found backup game state, restoring");
        localStorage.setItem('gameState', backupState);
        localStorage.setItem('gameStateUpdated', 'true');
      }
    } catch (error) {
      console.error("Error initializing storage:", error);
    }
  }, []);
  
  return null;
}

// Authentication check component with safer redirect and game state initialization
function AuthCheck({ children }) {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);
  const [gameState, setGameState] = useState(null);
  const [showReward, setShowReward] = useState(false);
  
  useEffect(() => {
    // Check if user is authenticated
    console.log("Checking authentication in hub route");
    
    try {
      const isAuthenticated = localStorage.getItem('isAuthenticated');
      console.log("Authentication status:", isAuthenticated);
      
      // Check for any backup state in sessionStorage
      const backupGameState = sessionStorage.getItem('updatedGameState');
      if (backupGameState) {
        console.log("Found backup game state in session, restoring to localStorage");
        localStorage.setItem('gameState', backupGameState);
        sessionStorage.removeItem('updatedGameState');
      }
      
      if (isAuthenticated === 'true') {
        console.log("Authentication confirmed in hub");
        setAuthenticated(true);
        
        // Get game state
        try {
          const state = JSON.parse(localStorage.getItem('gameState'));
          setGameState(state);
        } catch (e) {
          console.error("Error parsing game state:", e);
        }
      } else {
        console.log("Not authenticated, will redirect to landing page");
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
  
  // Function to show the reward
  const handleShowReward = () => {
    setShowReward(true);
  };
  
  // Return a loading state while checking auth
  if (checking) {
    return <Loading />;
  }
  
  // Only render children if authenticated
  return authenticated ? (
    <>
      <GamingHub onShowReward={handleShowReward} />
      <CompletionReward gameState={gameState} showManually={showReward} />
    </>
  ) : <Loading />;
}

// Then modify your HubPage function to include EnsureStorage:
export default function HubPage() {
  return (
    <AuthCheck>
      <EnsureStorage />
    </AuthCheck>
  );
}