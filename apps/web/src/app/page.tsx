'use client';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-canvas-dark">
      <div className="space-y-4">
        {/* 색상 테스트 */}
        <h1 className="text-hero-display font-700 font-binance-nova text-primary">
          Welcome to GeoPlanet
        </h1>

        {/* 버튼 테스트 */}
        <button className="px-lg py-3 rounded-md bg-primary text-on-primary font-600 text-button">
          Sign Up
        </button>

        {/* 카드 테스트 */}
        <div className="bg-surface-card-dark text-on-dark p-lg rounded-xl">
          <p className="text-body-md">Explore the world with GeoPlanet</p>
        </div>
      </div>
    </main>
  );
}
