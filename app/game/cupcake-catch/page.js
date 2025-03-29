'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import GameWrapper from '@/components/GameWrapper';
import LoadingGame from '@/components/LoadingGame';

// Import the game component dynamically to avoid hydration issues
const CupcakeCatch = dynamic(() => import('@/components/CupcakeCatch'), {
  ssr: false,
  loading: () => <LoadingGame gameName="Cupcake Catch" />
});

export default function CupcakeCatchPage() {
  return (
    <GameWrapper gameName="Cupcake Catch">
      <main>
        <Suspense fallback={<LoadingGame gameName="Cupcake Catch" />}>
          <CupcakeCatch />
        </Suspense>
      </main>
    </GameWrapper>
  );
}