import { useState, useEffect } from "react";
import bismillahSvg from "../assets/bismillah.svg";

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [step, setStep] = useState(1); // 1, 2, or 3

  useEffect(() => {
    // Step 1 → 2: White to Green (2s)
    const timer1 = setTimeout(() => setStep(2), 2000);

    // Step 2 → 3: Bismillah moves to top (3s later)
    const timer2 = setTimeout(() => setStep(3), 5000);

    // Complete and navigate (2s after step 3)
    const timer3 = setTimeout(() => onComplete(), 7000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      {/* Step 1: White background */}
      <div
        className="absolute inset-0 bg-white transition-opacity duration-1000 ease-in-out"
        style={{
          opacity: step === 1 ? 1 : 0,
        }}
      />

      {/* Step 2 & 3: Splash background image */}
      <div
        className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
        style={{
          backgroundImage: "url(/images/splash-background.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: step >= 2 ? 1 : 0,
        }}
      />

      {/* Step 3: BRIGHT WHITE GLOW */}
      <>
        {/* Main white glow - very bright */}
        <div
          className="absolute left-1/2 -translate-x-1/2 transition-all duration-[1200ms] ease-out"
          style={{
            top: "200px",
            width: "80%",
            maxWidth: "600px",
            height: "400px",
            background: `
              radial-gradient(ellipse at center, 
                rgba(255, 255, 255, 0.95) 0%, 
                rgba(255, 255, 255, 0.85) 15%, 
                rgba(255, 255, 255, 0.7) 30%, 
                rgba(255, 255, 255, 0.5) 45%, 
                rgba(255, 255, 255, 0.3) 60%, 
                transparent 80%
              )
            `,
            filter: "blur(60px)",
            opacity: step === 3 ? 1 : 0,
            zIndex: 5,
          }}
        />

        {/* Secondary glow layer for extra brightness */}
        <div
          className="absolute left-1/2 -translate-x-1/2 transition-all duration-[1200ms] ease-out"
          style={{
            top: "250px",
            width: "60%",
            maxWidth: "400px",
            height: "300px",
            background:
              "radial-gradient(ellipse, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.6) 40%, transparent 70%)",
            filter: "blur(40px)",
            opacity: step === 3 ? 1 : 0,
            zIndex: 6,
          }}
        />
      </>

      {/* Bismillah - SMOOTH ANIMATION */}
      <div
        className="absolute left-1/2 transition-all ease-out"
        style={{
          top: step === 3 ? "60px" : step === 2 ? "50%" : "50%",
          transform:
            step === 3 ? "translate(-50%, 0)" : "translate(-50%, -50%)",
          opacity: step >= 2 ? 1 : 0,
          transitionDuration: step === 3 ? "1800ms" : "1000ms",
          transitionTimingFunction:
            step === 3 ? "cubic-bezier(0.34, 1.56, 0.64, 1)" : "ease-out",
          zIndex: 10,
        }}
      >
        <img
          src={bismillahSvg}
          alt="Bismillah"
          className="w-64 md:w-80"
          style={{
            filter:
              step === 3
                ? "drop-shadow(0 4px 20px rgba(255, 255, 255, 0.6)) drop-shadow(0 0 40px rgba(255, 255, 255, 0.3))"
                : "none",
            transition: "filter 1200ms ease-out",
          }}
        />
      </div>
    </div>
  );
}
