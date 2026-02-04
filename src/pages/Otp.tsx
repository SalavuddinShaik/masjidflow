import { useEffect, useMemo, useRef, useState } from "react";
import bismillah from "../assets/bismillah.svg";

type OtpProps = {
  phone?: string;
  onBack: () => void;
  onVerified: () => void;
};

export function Otp({
  phone = "+1 630 123 4567",
  onBack,
  onVerified,
}: OtpProps) {
  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const [secondsLeft, setSecondsLeft] = useState(30);
  const [showForm, setShowForm] = useState(false);

  const otpValue = useMemo(() => digits.join(""), [digits]);
  const canVerify = otpValue.length === 6;

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowForm(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const t = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [secondsLeft]);

  const setAt = (index: number, value: string) => {
    const v = value.replace(/\D/g, "").slice(-1);
    setDigits((prev) => {
      const next = [...prev];
      next[index] = v;
      return next;
    });
  };

  const handleChange = (index: number, value: string) => {
    setAt(index, value);
    if (value.replace(/\D/g, "")) inputsRef.current[index + 1]?.focus();
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace") {
      if (digits[index]) {
        setAt(index, "");
        return;
      }
      if (index > 0) inputsRef.current[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0)
      inputsRef.current[index - 1]?.focus();
    if (e.key === "ArrowRight" && index < 5)
      inputsRef.current[index + 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!text) return;
    e.preventDefault();
    setDigits(() => {
      const next = ["", "", "", "", "", ""];
      for (let i = 0; i < 6; i++) next[i] = text[i] ?? "";
      return next;
    });
    const lastIndex = Math.min(text.length, 6) - 1;
    if (lastIndex >= 0) inputsRef.current[lastIndex]?.focus();
  };

  const handleResend = () => {
    if (secondsLeft > 0) return;
    setSecondsLeft(30);
    setDigits(["", "", "", "", "", ""]);
    inputsRef.current[0]?.focus();
  };

  return (
    <div
      className="relative w-full min-h-screen overflow-hidden flex items-center justify-center"
      style={{
        background:
          "linear-gradient(180deg, #D4E8D1 0%, #C5E0C8 25%, #B8D9BE 50%, #A8D4B8 75%, #9ACFAE 100%)",
      }}
    >
      {/* Card: full screen on mobile, centered 480px card on desktop */}
      <div
        className="relative w-full min-h-screen md:min-h-0 md:max-w-[480px] md:rounded-[32px] md:shadow-2xl overflow-hidden"
        style={{
          background:
            "linear-gradient(180deg, #D4E8D1 0%, #C5E0C8 25%, #B8D9BE 50%, #A8D4B8 75%, #9ACFAE 100%)",
        }}
      >
        {/* Mosque + Bismillah hero section */}
        <div
          className="relative w-full flex items-center justify-center"
          style={{ height: "40vh", minHeight: 260 }}
        >
          <img
            src="/images/mosque.png"
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            style={{ opacity: 0.7 }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, transparent 0%, transparent 50%, rgba(197, 224, 200, 0.6) 75%, #C5E0C8 100%)",
            }}
          />
          <img
            src={bismillah}
            alt="Bismillah"
            className="relative z-10 h-20 md:h-24 drop-shadow-sm"
          />
        </div>

        {/* Form section */}
        <div
          className={`flex flex-col items-center px-6 pb-10 transition-all duration-700 ease-out ${
            showForm ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div
            className="w-full max-w-[480px] mx-auto"
            style={{ paddingLeft: 20, paddingRight: 20 }}
          >
            {/* Heading */}
            <h1
              className="text-center"
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: "#000000",
                marginBottom: 24,
              }}
            >
              Verify Your Number
            </h1>

            {/* Subtitle */}
            <p
              style={{
                fontSize: 14,
                fontWeight: 400,
                color: "#444444",
                marginBottom: 12,
              }}
            >
              We've sent a 6-digit code to{" "}
              <span style={{ fontWeight: 600 }}>{phone}</span>
            </p>

            {/* 6 OTP input boxes */}
            <div className="flex gap-2" style={{ marginBottom: 35 }}>
              {digits.map((d, i) => (
                <input
                  key={i}
                  ref={(el) => {
                    inputsRef.current[i] = el;
                  }}
                  value={d}
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  onPaste={i === 0 ? handlePaste : undefined}
                  className="outline-none text-center text-xl font-semibold"
                  style={{
                    width: 45,
                    height: 55,
                    background: "rgba(255, 255, 255, 0.64)",
                    border: "1px solid #C1C1C1",
                    borderRadius: 13,
                    color: "#1a1a1a",
                  }}
                />
              ))}
            </div>

            {/* Verify OTP button */}
            <button
              type="button"
              disabled={!canVerify}
              onClick={onVerified}
              className="w-full text-white font-semibold text-[18px] transition-all duration-200 hover:brightness-110 active:scale-[0.98]"
              style={{
                height: 81,
                backgroundColor: canVerify ? "#024413" : "rgba(2, 68, 19, 0.5)",
                borderRadius: 13,
                cursor: canVerify ? "pointer" : "not-allowed",
              }}
            >
              Verify OTP
            </button>

            {/* Didn't receive OTP? Resend OTP */}
            <div style={{ marginTop: 24 }}>
              <span
                style={{
                  fontSize: 18,
                  fontWeight: 500,
                  color: "#000000",
                  fontStyle: "italic",
                }}
              >
                Didn't recieve OTP?{" "}
              </span>
              {secondsLeft > 0 ? (
                <span
                  style={{ fontSize: 18, fontWeight: 600, color: "#00721E" }}
                >
                  Resend in {secondsLeft}s
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  className="underline transition-all hover:opacity-80"
                  style={{ fontSize: 18, fontWeight: 600, color: "#00721E" }}
                >
                  Resend OTP
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
