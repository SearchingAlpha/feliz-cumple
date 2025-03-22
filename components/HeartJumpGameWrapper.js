"use client";
// components/games/heart-jump/HeartJumpGameWrapper.jsx
import { useState, useEffect } from 'react';
import HeartJumpGame from '@/components/HeartJump';

function HeartJumpGameWrapper() {
  const [gameCompleted, setGameCompleted] = useState(false);
  
  // Check if game was previously completed
  useEffect(() => {
    // Check localStorage first
    const isCompleted = localStorage.getItem('heartJumpCompleted') === 'true';
    setGameCompleted(isCompleted);
  }, []);
  
  // Function to handle game completion
  function handleGameCompletion() {
    // Store completion in localStorage
    localStorage.setItem('heartJumpCompleted', 'true');
    setGameCompleted(true);
    
    // You would also call your API here to update server-side state
    fetch('/api/games/complete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        game: 'heart-jump',
        completed: true
      }),
    }).catch(error => {
      console.error('Error updating game state:', error);
    });
  }
  
  return <HeartJumpGame onComplete={handleGameCompletion} />;
}

export default HeartJumpGameWrapper;