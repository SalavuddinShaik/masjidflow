import { useState, useEffect } from "react";
import bismillah from "../assets/bismillah.svg";

type LoginProps = {
  onLogin: () => void;
};

export function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowForm(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

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
            style={{ paddingLeft: 25, paddingRight: 60 }}
          >
            {/* Username field */}
            <label
              className="block"
              style={{ fontSize: 18, fontWeight: 500, color: "#000000", marginBottom: 8 }}
            >
              Enter Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="w-full outline-none text-[16px] text-[#1a1a1a] placeholder-gray-400"
              style={{
                height: 76,
                background: "rgba(255, 255, 255, 0.64)",
                border: "1px solid #C1C1C1",
                borderRadius: 13,
                paddingLeft: 20,
                paddingRight: 20,
                marginBottom: 23,
              }}
            />

            {/* Password field */}
            <label
              className="block"
              style={{ fontSize: 18, fontWeight: 500, color: "#000000", marginBottom: 8 }}
            >
              Enter Your Password
            </label>
            <div className="relative w-full" style={{ marginBottom: 35 }}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full outline-none text-[16px] text-[#1a1a1a] placeholder-gray-400"
                style={{
                  height: 76,
                  background: "rgba(255, 255, 255, 0.64)",
                  border: "1px solid #C1C1C1",
                  borderRadius: 13,
                  paddingLeft: 20,
                  paddingRight: 56,
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>

            {/* Login button */}
            <button
              type="button"
              onClick={onLogin}
              className="w-full text-white font-semibold text-[18px] transition-all duration-200 hover:brightness-110 active:scale-[0.98]"
              style={{ height: 81, backgroundColor: "#024413", borderRadius: 13 }}
            >
              Login
            </button>

            {/* Forgot password */}
            <div className="text-center" style={{ marginTop: 24 }}>
              <span style={{ fontSize: 18, fontWeight: 500, color: "#000000" }}>
                Forgot your password?{" "}
              </span>
              <button
                type="button"
                className="underline transition-all hover:opacity-80"
                style={{ fontSize: 18, fontWeight: 600, color: "#00721E" }}
              >
                Reset Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
