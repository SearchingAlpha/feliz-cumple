// app/page.js
"use client";

import { useState, useEffect } from 'react';

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showStartButton, setShowStartButton] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isStartHovered, setIsStartHovered] = useState(false);
  const [isStartPressed, setIsStartPressed] = useState(false);
  const [isLoginHovered, setIsLoginHovered] = useState(false);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsLoading(false);
          setShowStartButton(true);
          return 100;
        }
        return prev + 5;
      });
    }, 150);
    
    return () => clearInterval(interval);
  }, []);

  const handleStartClick = () => {
    setShowStartButton(false);
    setShowLoginForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    try {
      // In a real app, this would be an API call to the Node.js backend
      // For now, we're just simulating the request
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          // This would be replaced with actual authentication logic
          if (username === "PLACEHOLDER_NAME" && password === "PLACEHOLDER_DATE") {
            resolve({ success: true });
          } else {
            resolve({ 
              success: false, 
              message: "Oops! Try again, sweetie!" 
            });
          }
        }, 1000);
      });
      
      if (response.success) {
        // Redirect to gaming hub 
        window.location.href = "/hub";
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError("Something went wrong! Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-fuchsia-100">
      {/* Pixel Background */}
      <div className="fixed inset-0 z-0">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-fuchsia-100 to-pink-100"></div>
        
        {/* Pixelated grid overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="h-full w-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmFlZGEiIHN0cm9rZS1vcGFjaXR5PSIwLjQiLz48L3N2Zz4=')]"></div>
        </div>
        
        {/* Pixelated decorative elements */}
        <div className="absolute top-20 left-20 h-16 w-16 rounded-md bg-gradient-to-br from-pink-300 to-pink-400 opacity-40 blur-sm"></div>
        <div className="absolute bottom-40 right-20 h-24 w-24 rounded-full bg-gradient-to-br from-purple-300 to-fuchsia-300 opacity-30 blur-sm"></div>
        <div className="absolute bottom-20 left-1/4 h-12 w-12 rounded-full bg-gradient-to-br from-pink-200 to-pink-300 opacity-40 blur-sm"></div>
        <div className="absolute top-1/3 right-1/4 h-20 w-20 rounded-full bg-gradient-to-br from-fuchsia-200 to-purple-300 opacity-30 blur-sm"></div>
        
        {/* Heart decorations */}
        <div className="absolute top-10 right-10 h-8 w-8 opacity-40">
          <svg viewBox="0 0 24 24" fill="currentColor" className="text-pink-400">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
        <div className="absolute bottom-16 left-12 h-6 w-6 opacity-40">
          <svg viewBox="0 0 24 24" fill="currentColor" className="text-pink-400">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
        <div className="absolute top-1/3 left-1/3 h-5 w-5 opacity-30">
          <svg viewBox="0 0 24 24" fill="currentColor" className="text-pink-300">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
        
        {/* Sparkles */}
        <div className="absolute top-1/4 right-1/3 h-2 w-2 animate-pulse rounded-full bg-yellow-200 opacity-60"></div>
        <div className="absolute bottom-1/3 right-1/4 h-1.5 w-1.5 animate-pulse rounded-full bg-yellow-200 opacity-60 animation-delay-500"></div>
        <div className="absolute top-1/2 left-1/5 h-2.5 w-2.5 animate-pulse rounded-full bg-yellow-200 opacity-50 animation-delay-1000"></div>
      </div>
      
      {/* Main Content */}
      <div className="z-10 flex flex-col items-center justify-center gap-6 px-4 py-8">
        <h1 className="text-center font-pixel text-4xl md:text-6xl text-pink-600 drop-shadow-[0_2px_0_rgba(255,105,180,0.7)]">
          Retro Gaming Hub
        </h1>
        
        {/* Loading Bar */}
        {isLoading && (
          <div className="w-full max-w-md">
            <div className="mb-2 flex justify-between">
              <span className="font-pixel text-xs text-pink-700">Loading...</span>
              <span className="font-pixel text-xs text-pink-700">{loadingProgress}%</span>
            </div>
            <div className="h-6 w-full overflow-hidden rounded-md border-4 border-pink-400 bg-white p-1">
              <div
                className="h-full bg-gradient-to-r from-pink-400 to-purple-400 transition-all duration-300"
                style={{ width: `${loadingProgress}%` }}
              >
                {/* Pixel-like segments for retro feel */}
                <div className="flex h-full w-full">
                  {[...Array(20)].map((_, i) => (
                    <div 
                      key={i}
                      className={`h-full flex-1 ${i % 2 === 0 ? 'bg-pink-300' : 'bg-pink-400'} opacity-30`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Start Button */}
        {showStartButton && (
          <button
            className={`
              relative mt-4 px-12 py-4 
              font-pixel text-2xl text-white
              transition-all duration-150
              ${isStartPressed 
                ? 'translate-y-1 shadow-none' 
                : 'shadow-[0_6px_0_rgb(157,23,77)]'}
              ${isStartHovered 
                ? 'bg-gradient-to-r from-pink-600 to-fuchsia-600 scale-105' 
                : 'bg-gradient-to-r from-pink-500 to-fuchsia-500'}
              rounded-xl border-4 border-pink-300
              focus:outline-none
              active:translate-y-1 active:shadow-none
            `}
            onMouseEnter={() => setIsStartHovered(true)}
            onMouseLeave={() => {
              setIsStartHovered(false);
              setIsStartPressed(false);
            }}
            onMouseDown={() => setIsStartPressed(true)}
            onMouseUp={() => setIsStartPressed(false)}
            onClick={handleStartClick}
          >
            <span className="relative z-10">START GAME</span>
            
            {/* Pixel-style decoration */}
            <div className="absolute inset-0 flex items-end justify-start overflow-hidden opacity-20">
              <div className="h-3 w-3 bg-white"></div>
            </div>
            <div className="absolute inset-0 flex items-end justify-end overflow-hidden opacity-20">
              <div className="h-3 w-3 bg-white"></div>
            </div>
            
            {/* Sparkles that appear on hover */}
            {isStartHovered && (
              <>
                <span className="absolute -left-1 -top-1 h-2 w-2 animate-ping rounded-full bg-pink-200" />
                <span className="absolute -right-1 -top-1 h-2 w-2 animate-ping rounded-full bg-pink-200 animation-delay-300" />
                <span className="absolute -bottom-1 -left-1 h-2 w-2 animate-ping rounded-full bg-pink-200 animation-delay-600" />
                <span className="absolute -bottom-1 -right-1 h-2 w-2 animate-ping rounded-full bg-pink-200 animation-delay-900" />
              </>
            )}
          </button>
        )}
        
        {/* Login Form */}
        {showLoginForm && (
          <div className="w-full max-w-md">
            <div className="rounded-xl border-4 border-pink-400 bg-white p-6 shadow-lg">
              <form onSubmit={handleSubmit} className="space-y-4">
                <h2 className="mb-6 text-center font-pixel text-2xl text-pink-600">Enter Your Details</h2>
                
                {/* Username Input */}
                <div className="w-full">
                  <label 
                    htmlFor="username"
                    className="mb-1 block font-pixel text-sm text-pink-600"
                  >
                    Username
                  </label>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your name"
                    required
                    className="w-full rounded-md border-3 border-pink-300 bg-pink-50 px-3 py-2 
                              font-pixel text-pink-800 placeholder-pink-300
                              focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-200"
                  />
                </div>
                
                {/* Password Input */}
                <div className="w-full">
                  <label 
                    htmlFor="password"
                    className="mb-1 block font-pixel text-sm text-pink-600"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="The day we met (MMDDYYYY)"
                    required
                    className="w-full rounded-md border-3 border-pink-300 bg-pink-50 px-3 py-2 
                              font-pixel text-pink-800 placeholder-pink-300
                              focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-200"
                  />
                </div>
                
                {/* Error Message */}
                {error && (
                  <div className="rounded-md border-2 border-pink-300 bg-pink-50 p-3">
                    <p className="font-pixel text-sm text-pink-500">{error}</p>
                  </div>
                )}
                
                {/* Login Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`
                      relative w-full rounded-md py-3
                      font-pixel text-lg text-white
                      transition-all duration-150
                      ${isSubmitting 
                        ? 'bg-pink-300 cursor-not-allowed' 
                        : isLoginHovered 
                          ? 'bg-gradient-to-r from-pink-500 to-fuchsia-500 shadow-[0_4px_0_rgb(157,23,77)]' 
                          : 'bg-gradient-to-r from-pink-400 to-fuchsia-400 shadow-[0_4px_0_rgb(157,23,77)]'}
                      disabled:translate-y-0 disabled:shadow-none
                      focus:outline-none
                      active:translate-y-1 active:shadow-none
                    `}
                    onMouseEnter={() => setIsLoginHovered(true)}
                    onMouseLeave={() => setIsLoginHovered(false)}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-white"></div>
                        <span className="ml-2">Loading...</span>
                      </div>
                    ) : (
                      <>
                        <span className="relative z-10">ENTER</span>
                        
                        {/* Pixelated corners for retro feel */}
                        <div className="absolute left-2 top-2 h-1 w-1 bg-white opacity-20"></div>
                        <div className="absolute right-2 top-2 h-1 w-1 bg-white opacity-20"></div>
                        <div className="absolute bottom-2 left-2 h-1 w-1 bg-white opacity-20"></div>
                        <div className="absolute bottom-2 right-2 h-1 w-1 bg-white opacity-20"></div>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}