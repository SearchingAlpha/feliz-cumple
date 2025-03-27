'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import HeartJump from '@/components/HeartJump';

export default function HeartJumpGameWrapper() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Simple authentication check
  useEffect(() => {
    try {
      if (localStorage.getItem('isAuthenticated') === 'true') {
        setIsAuthenticated(true);
      } else {
        router.push('/');
      }
    } catch (error) {
      router.push('/');
    }
  }, [router]);
  
  // Render the game component if authenticated
  return isAuthenticated ? <HeartJump /> : (
    <div className="flex justify-center items-center h-screen">
      <p>Loading...</p>
    </div>
  );
}