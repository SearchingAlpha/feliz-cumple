// app/games/heart-jump/page.js
import { Suspense } from 'react';
import HeartJumpGameWrapper from '@/components/HeartJumpGameWrapper';

function HeartJumpPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-pink-200 to-purple-200">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg border-4 border-purple-400">
          <h2 className="text-2xl font-bold mb-4 text-pink-600">Loading Game...</h2>
          <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    }>
      <HeartJumpGameWrapper />
    </Suspense>
  );
}

export default HeartJumpPage;