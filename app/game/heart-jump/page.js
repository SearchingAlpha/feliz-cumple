'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import GameWrapper from '@/components/GameWrapper';
import LoadingGame from '@/components/LoadingGame';

// Import the game component dynamically
const HeartJump = dynamic(() => import('@/components/HeartJump'), {
  ssr: false,
  loading: () => <LoadingGame gameName="Heart Jump" />
});

export default function HeartJumpPage() {
  return (
    <GameWrapper gameName="Heart Jump">
      <main>
        <Suspense fallback={<LoadingGame gameName="Heart Jump" />}>
          <HeartJump />
        </Suspense>
      </main>
    </GameWrapper>
  );
}