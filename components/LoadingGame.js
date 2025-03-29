'use client';

/**
 * Loading component for games
 * 
 * @param {Object} props
 * @param {string} props.gameName - Name of the game being loaded
 */
export default function LoadingGame({ gameName = 'Game' }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-pink-100 to-purple-200">
      <div className="px-6 py-8 bg-white rounded-lg shadow-md border-4 border-pink-300 animate-pulse">
        <div className="flex flex-col items-center">
          {/* Pixel art loading animation */}
          <div className="relative w-16 h-16 mb-4">
            {/* Animated pixel squares */}
            <div className="absolute top-0 left-0 w-6 h-6 bg-pink-400 animate-pulse" 
                 style={{ animationDelay: '0ms' }}></div>
            <div className="absolute top-0 right-0 w-6 h-6 bg-purple-400 animate-pulse" 
                 style={{ animationDelay: '300ms' }}></div>
            <div className="absolute bottom-0 left-0 w-6 h-6 bg-purple-400 animate-pulse" 
                 style={{ animationDelay: '600ms' }}></div>
            <div className="absolute bottom-0 right-0 w-6 h-6 bg-pink-400 animate-pulse" 
                 style={{ animationDelay: '900ms' }}></div>
          </div>
          
          <p className="font-pixel text-xl text-pink-600 mb-2">Loading...</p>
          <p className="font-pixel text-sm text-purple-500">{gameName}</p>
        </div>
      </div>
      
      {/* Pixel art decoration */}
      <div className="mt-8">
        <div className="w-4 h-4 bg-pink-300 inline-block mx-1 animate-pulse"></div>
        <div className="w-4 h-4 bg-purple-300 inline-block mx-1 animate-pulse" 
             style={{ animationDelay: '300ms' }}></div>
        <div className="w-4 h-4 bg-pink-300 inline-block mx-1 animate-pulse" 
             style={{ animationDelay: '600ms' }}></div>
      </div>
    </div>
  );
}