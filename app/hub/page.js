'use client';

// app/hub/page.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import GamingHub from '@/components/GamingHub';

// Loading component
function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="pixel-loading mb-4"></div>
      <p className="font-pixel text-pink-600">Loading Hub...</p>
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
    console.log("Checking authentication in hub route");
    
    try {
      const isAuthenticated = localStorage.getItem('isAuthenticated');
      console.log("Authentication status:", isAuthenticated);
      
      if (isAuthenticated === 'true') {
        console.log("Authentication confirmed in hub");
        setAuthenticated(true);
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
  
  // Return a loading state while checking auth
  if (checking) {
    return <Loading />;
  }
  
  // Only render children if authenticated
  return authenticated ? children : <Loading />;
}

export default function HubPage() {
  return (
    <AuthCheck>
      <GamingHub />
    </AuthCheck>
  );
}