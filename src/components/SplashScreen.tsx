import { useState, useEffect } from 'react';
import bismillahSvg from '../assets/bismillah.svg';

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [showGradient, setShowGradient] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [moveToTop, setMoveToTop] = useState(false);

  useEffect(() => {
    // Screen 1: White for 2 seconds
    const gradientTimer = setTimeout(() => {
      setShowGradient(true);
    }, 2000);

    // Screen 2: Show Bismillah centered (fade in after gradient starts)
    const contentTimer = setTimeout(() => {
      setShowContent(true);
    }, 2500);

    // Screen 3: After 3 seconds centered, animate Bismillah to top
    const moveToTopTimer = setTimeout(() => {
      setMoveToTop(true);
    }, 5500);

    // Navigate to login after animation completes (1.5s animation + buffer)
    const navigationTimer = setTimeout(() => {
      onComplete();
    }, 7500);

    return () => {
      clearTimeout(gradientTimer);
      clearTimeout(contentTimer);
      clearTimeout(moveToTopTimer);
      clearTimeout(navigationTimer);
    };
  }, [onComplete]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* White background (Screen 1) */}
      <div
        className={`absolute inset-0 bg-white transition-opacity duration-1000 ease-in-out ${
          showGradient ? 'opacity-0' : 'opacity-100'
        }`}
      />

      {/* Green gradient background (Screen 2 & 3) */}
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
          showGradient ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          background: 'linear-gradient(to bottom, #c8e6c9 0%, #81c784 30%, #66bb6a 60%, #4caf50 100%)',
        }}
      />

      {/* Grainy/noise texture overlay */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-1000 ease-in-out ${
          showGradient ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          opacity: 0.15,
          mixBlendMode: 'overlay',
        }}
      />

      {/* Bismillah SVG - animates from center to top */}
      <div
        className={`absolute inset-x-0 flex justify-center ease-in-out ${
          showContent ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          top: moveToTop ? '15%' : '50%',
          transform: moveToTop ? 'translateY(0)' : 'translateY(-50%)',
          transition: moveToTop
            ? 'top 1.5s cubic-bezier(0.4, 0, 0.2, 1), transform 1.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 1s ease-in-out'
            : 'opacity 1s ease-in-out',
        }}
      >
        <img
          src={bismillahSvg}
          alt="Bismillah"
          className="w-64 md:w-80 lg:w-96"
        />
      </div>
    </div>
  );
}
