'use client';
// app/game/pixel-flower-match/page.js
import { Suspense } from 'react';
import dynamic from 'next/dynamic';

// Import the game component dynamically
const PixelFlowerMatch = dynamic(() => import('@/components/PixelFlowerMatch'), {
  ssr: false,
  loading: () => <LoadingGame />
});

// Simple loading component
function LoadingGame() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="pixel-loading mb-4"></div>
      <p className="font-pixel text-pink-600">Loading Pixel Flower Match...</p>
    </div>
  );
}

export default function PixelFlowerMatchPage() {
  return (
    <main>
      <Suspense fallback={<LoadingGame />}>
        <PixelFlowerMatch />
      </Suspense>
    </main>
  );
}