import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import bismillah from "../assets/bismillah.svg";
import { useAuth } from "../contexts/AuthContext";
import { ApiError } from "../services/api";

export function Otp() {
  const navigate = useNavigate();
  const { pendingAuth, verifyOtp, sendLoginOtp, sendSignupOtp, clearPendingAuth } = useAuth();

  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const [secondsLeft, setSecondsLeft] = useState(30);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const otpValue = useMemo(() => digits.join(""), [digits]);
  const canVerify = otpValue.length === 6;

  // Redirect if no pending auth
  useEffect(() => {
    if (!pendingAuth) {
      navigate("/phone-login");
    }
  }, [pendingAuth, navigate]);

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
    setError("");
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

  const handleVerify = async () => {
    if (!canVerify || !pendingAuth) return;

    setError("");
    setIsLoading(true);

    try {
      const { isNewUser } = await verifyOtp(otpValue);

      if (isNewUser) {
        navigate("/basic-info");
      } else {
        navigate("/welcome");
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
        // Clear digits on invalid OTP
        if (err.code === "INVALID_OTP") {
          setDigits(["", "", "", "", "", ""]);
          inputsRef.current[0]?.focus();
        }
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (secondsLeft > 0 || !pendingAuth) return;

    setError("");
    setIsLoading(true);

    try {
      if (pendingAuth.isSignup && pendingAuth.signupData) {
        await sendSignupOtp(pendingAuth.signupData);
      } else {
        await sendLoginOtp(pendingAuth.phone, pendingAuth.countryCode);
      }
      setSecondsLeft(30);
      setDigits(["", "", "", "", "", ""]);
      inputsRef.current[0]?.focus();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Failed to resend OTP. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    clearPendingAuth();
    navigate(-1);
  };

  const displayPhone = pendingAuth
    ? `${pendingAuth.countryCode} ${pendingAuth.phone.replace(/(\d{3})(\d{3})(\d{4})/, "$1 $2 $3")}`
    : "";

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center md:block">
      {/* Container: same as PhoneLogin */}
      <div className="relative overflow-hidden bg-white w-[412px] h-[917px] rounded-[30px] md:w-screen md:h-screen md:min-h-0 md:rounded-none">
        {/* Background image */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url(/images/login-background.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />

        {/* Back button */}
        <button
          onClick={handleBack}
          className="absolute z-30 top-12 left-6 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
          style={{ border: "1px solid #C1C1C1" }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* White glow below Bismillah */}
        <div
          className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
          style={{
            top: "215px",
            width: "300px",
            height: "200px",
            background:
              "radial-gradient(ellipse at center, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.6) 30%, rgba(255, 255, 255, 0.3) 60%, transparent 80%)",
            filter: "blur(40px)",
            zIndex: 5,
          }}
        />

        {/* Bismillah */}
        <div
          className="absolute z-20 left-1/2 -translate-x-1/2 md:left-1/2 md:-translate-x-1/2"
          style={{
            top: "120px",
            width: "280px",
          }}
        >
          <img
            src={bismillah}
            alt="Bismillah"
            className="w-full h-full"
            style={{
              filter:
                "drop-shadow(0 4px 20px rgba(255, 255, 255, 0.6)) drop-shadow(0 0 40px rgba(255, 255, 255, 0.3))",
            }}
          />
        </div>

        {/* Form content */}
        <div
          className={`absolute z-10 left-0 right-0 md:left-1/2 md:right-auto md:px-0 md:-translate-x-1/2 transition-all duration-700 ease-out ${
            showForm ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ top: "322px", paddingLeft: "28px", paddingRight: "28px" }}
        >
          {/* Title */}
          <h1
            className="w-full md:w-[480px] text-center"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "20px",
              fontWeight: 600,
              color: "#000000",
              margin: 0,
              marginBottom: "0px",
            }}
          >
            Verify Your Number
          </h1>

          {/* Subtitle */}
          <p
            className="w-full max-w-[432px] md:w-[480px] text-center mx-auto"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "14px",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "normal",
              color: "#444444",
              margin: 0,
              marginTop: "24px",
              marginBottom: "8px",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            We've sent a 6-digit code to{" "}
            <span style={{ fontWeight: 600 }}>{displayPhone}</span>
          </p>

          {/* Error message */}
          {error && (
            <p
              className="w-full max-w-[432px] mx-auto text-center"
              style={{
                marginTop: "8px",
                marginBottom: "8px",
                fontFamily: "Poppins, sans-serif",
                fontSize: "12px",
                fontWeight: 500,
                color: "#dc2626",
              }}
            >
              {error}
            </p>
          )}

          {/* 6 OTP input boxes */}
          <div className="w-full max-w-[432px] md:w-[480px] mx-auto overflow-visible">
            {/* mobile scale wrapper */}
            <div className="origin-top-left scale-[0.70] md:scale-100">
              <div
                className="flex flex-nowrap justify-between w-full"
                style={{ gap: "12px", marginBottom: "30px" }}
              >
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
                    className="flex-none outline-none text-center font-semibold rounded-[16px]"
                    style={{
                      width: "68px",
                      height: "68px",
                      minWidth: 0,
                      background: "rgba(255, 255, 255, 0.64)",
                      border: error ? "1px solid #dc2626" : "1px solid #C1C1C1",
                      fontFamily: "Poppins, sans-serif",
                      fontSize: "24px",
                      fontWeight: 600,
                      color: "#1a1a1a",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Verify OTP button - same as Get OTP */}
          <button
            type="button"
            disabled={!canVerify || isLoading}
            onClick={handleVerify}
            className="w-full max-w-[432px] mx-auto block text-white border-none cursor-pointer transition-all duration-200 hover:brightness-110 active:scale-[0.98] rounded-[10px] disabled:opacity-70 disabled:cursor-not-allowed"
            style={{
              height: "64px",
              backgroundColor: "#024413",
              boxShadow: "0 4px 7.8px rgba(0, 0, 0, 0.25)",
              fontFamily: "Poppins, sans-serif",
              fontSize: "18px",
              fontWeight: 600,
            }}
          >
            {isLoading ? "Verifying..." : "Verify OTP"}
          </button>
          {/* Resend link */}
          <div
            className="w-full max-w-[432px] mx-auto flex items-center justify-center"
            style={{ marginTop: "60px", gap: "6px" }}
          >
            <span
              style={{
                color: "#000",
                fontFamily: "Poppins, sans-serif",
                fontWeight: 500,
                fontSize: "16px",
              }}
            >
              Didn't receive OTP?
            </span>

            {secondsLeft > 0 ? (
              <span
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "#024413",
                }}
              >
                Resend in {secondsLeft}s
              </span>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={isLoading}
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "#024413",
                  background: "none",
                  border: "none",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  padding: 0,
                  opacity: isLoading ? 0.7 : 1,
                }}
              >
                Resend OTP
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
