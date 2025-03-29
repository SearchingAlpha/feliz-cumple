'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import GameWrapper from '@/components/GameWrapper';
import LoadingGame from '@/components/LoadingGame';

// Import the game component dynamically
const PixelFlowerMatch = dynamic(() => import('@/components/PixelFlowerMatch'), {
  ssr: false,
  loading: () => <LoadingGame gameName="Pixel Flower Match" />
});

export default function PixelFlowerMatchPage() {
  return (
    <GameWrapper gameName="Pixel Flower Match">
      <main>
        <Suspense fallback={<LoadingGame gameName="Pixel Flower Match" />}>
          <PixelFlowerMatch />
        </Suspense>
      </main>
    </GameWrapper>
  );
}