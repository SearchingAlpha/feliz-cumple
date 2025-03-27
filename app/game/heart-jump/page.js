'use client';

// app/game/heart-jump/page.js
import { Suspense } from 'react';
import dynamic from 'next/dynamic';

// Import the game wrapper component dynamically
const HeartJumpGameWrapper = dynamic(() => import('@/components/HeartJumpGameWrapper'), {
  ssr: false,
  loading: () => <LoadingGame />
});

// Simple loading component
function LoadingGame() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-pink-200 to-purple-200">
      <div className="pixel-loading mb-4"></div>
      <p className="font-pixel text-purple-600">Loading Heart Runner...</p>
    </div>
  );
}

export default function HeartJumpPage() {
  return (
    <Suspense fallback={<LoadingGame />}>
      <HeartJumpGameWrapper />
    </Suspense>
  );
}