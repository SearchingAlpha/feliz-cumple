'use client';

import dynamic from 'next/dynamic';
import { Suspense, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image1 from '@/public/image1.png';
import Image from 'next/image';
import { useState } from 'react';

// Import LandingPage dynamically using a custom component
const EnhancedLandingPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e) {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      console.log("Login attempt with:", { username, password });
      
      // In a real implementation, this would call the Node.js backend
      // For now, we'll just use hardcoded values for the example
      
      // Note: In a real application, you would never hardcode credentials like this
      // Instead, you would validate via a secure API endpoint
      const correctUsername = 'Vanessa'; // Replace with actual name
      const correctPassword = '13112024'; // Replace with actual date in the format MMDDYYYY
      
      if (username === correctUsername && password === correctPassword) {
        // Set a flag in localStorage to maintain session (replace with proper auth in production)
        console.log("Login successful, setting authentication flag");
        localStorage.setItem('isAuthenticated', 'true');
        console.log("Authentication status after login:", localStorage.getItem('isAuthenticated'));
        
        router.push('/hub');
      } else {
        console.log("Login failed: incorrect credentials");
        setError('Incorrecto! Intenta de nuevo.');
      }
    } catch (err) {
      console.error("Login error:", err);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-pink-100 to-purple-200 p-4">
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 h-16 w-16 bg-pink-300 rounded-full opacity-20"></div>
      <div className="absolute bottom-10 right-10 h-20 w-20 bg-purple-300 rounded-full opacity-20"></div>
      <div className="absolute top-1/4 right-1/4 h-12 w-12 bg-pink-400 rounded-full opacity-10"></div>
      <div className="absolute bottom-1/3 left-1/3 h-10 w-10 bg-purple-400 rounded-full opacity-10"></div>
      
      <div className="w-full max-w-5xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-pink-600 mb-4 font-pixel">Felicidades mi Amooor 03/04/2025</h1>
          <p className="text-pink-500 mb-2 font-pixel">Descubre las sorpresas que te esperan!</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
          {/* Pixel Art Image */}
          <div className="w-full md:w-1/2 flex justify-center">
            <div className="p-4 bg-white rounded-lg shadow-lg border-4 border-pink-300 max-w-md">
              <Image 
                src={Image1}
                width={400} 
                height={500} 
                alt="Pixel Art Couple"
                className="w-full h-auto" 
              />
            </div>
          </div>
          
          {/* Login Form */}
          <div className="w-full md:w-1/2 max-w-md">
            {/* Pixelated Login Box */}
            <div className="bg-white p-6 rounded-lg shadow-lg border-4 border-pink-400">
              <h2 className="text-xl text-center text-pink-600 mb-6 font-pixel">Login</h2>
              
              <form onSubmit={handleLogin}>
                <div className="mb-4">
                  <label className="block text-pink-500 mb-2 text-sm font-pixel" htmlFor="username">
                    Nombre
                  </label>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-3 py-2 border-2 border-pink-300 rounded-md focus:outline-none focus:border-pink-500"
                    placeholder="Introduce tu nombre"
                    required
                  />
                </div>
                
                <div className="mb-6">
                  <label className="block text-pink-500 mb-2 text-sm font-pixel" htmlFor="password">
                    Contraseña
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border-2 border-pink-300 rounded-md focus:outline-none focus:border-pink-500"
                    placeholder="Fecha especial DDMMYYYY"
                    required
                  />
                </div>
                
                {error && (
                  <div className="mb-4 p-2 bg-pink-100 text-pink-700 rounded text-center font-pixel text-sm">
                    {error}
                  </div>
                )}
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2 px-4 bg-pink-500 text-white rounded-md hover:bg-pink-600 focus:outline-none focus:ring focus:ring-pink-300 disabled:opacity-70 font-pixel text-sm"
                >
                  {isLoading ? 'Loading...' : 'Descúbrelo!'}
                </button>
              </form>
            </div>
            
            {/* Pixel Art Decorations */}
            <div className="mt-8 flex justify-center space-x-4">
              <div className="w-6 h-6 bg-pink-400 rounded-full animate-pulse"></div>
              <div className="w-6 h-6 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              <div className="w-6 h-6 bg-pink-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

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
        <EnhancedLandingPage />
      </Suspense>
    </>
  );
}