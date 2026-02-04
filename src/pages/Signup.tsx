import { useState, useEffect } from "react";
import bismillah from "../assets/bismillah.svg";

type SignupProps = {
  onGetOtp: () => void;
  onLogin: () => void;
};

const inputStyle = {
  height: 76,
  background: "rgba(255, 255, 255, 0.64)",
  border: "1px solid #C1C1C1",
  borderRadius: 13,
  paddingLeft: 20,
  paddingRight: 20,
} as const;

const labelStyle = {
  fontSize: 18,
  fontWeight: 500,
  color: "#000000",
  marginBottom: 8,
} as const;

export function Signup({ onGetOtp, onLogin }: SignupProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
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
            {/* Name field */}
            <label className="block" style={labelStyle}>
              Enter Your Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
              className="w-full outline-none text-[16px] text-[#1a1a1a] placeholder-gray-400"
              style={{ ...inputStyle, marginBottom: 23 }}
            />

            {/* Email field */}
            <label className="block" style={labelStyle}>
              Enter Your Email ID
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="xyz@gmail.com"
              className="w-full outline-none text-[16px] text-[#1a1a1a] placeholder-gray-400"
              style={{ ...inputStyle, marginBottom: 23 }}
            />

            {/* Phone number field */}
            <label className="block" style={labelStyle}>
              Enter Mobile Number
            </label>
            <div
              className="w-full flex items-center overflow-hidden"
              style={{
                height: 76,
                background: "rgba(255, 255, 255, 0.64)",
                border: "1px solid #C1C1C1",
                borderRadius: 13,
                marginBottom: 35,
              }}
            >
              <div
                className="flex-shrink-0 flex items-center justify-center"
                style={{ width: 70, height: "100%" }}
              >
                <span style={{ fontSize: 16, fontWeight: 500, color: "#1a1a1a" }}>
                  +00
                </span>
              </div>
              <div
                style={{
                  width: 1,
                  height: 40,
                  backgroundColor: "#C1C1C1",
                  flexShrink: 0,
                }}
              />
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="XXXXXXXXXX"
                className="flex-1 outline-none bg-transparent text-[16px] text-[#1a1a1a] placeholder-gray-400 tracking-widest"
                style={{ paddingLeft: 16, paddingRight: 20, height: "100%" }}
              />
            </div>

            {/* Get OTP button */}
            <button
              type="button"
              onClick={onGetOtp}
              className="w-full text-white font-semibold text-[18px] transition-all duration-200 hover:brightness-110 active:scale-[0.98]"
              style={{ height: 81, backgroundColor: "#024413", borderRadius: 13 }}
            >
              Get OTP
            </button>

            {/* --- Or login with --- */}
            <div className="flex items-center" style={{ marginTop: 32, marginBottom: 24 }}>
              <div style={{ flex: 1, height: 1, backgroundColor: "#AAAAAA" }} />
              <span
                style={{
                  paddingLeft: 16,
                  paddingRight: 16,
                  fontSize: 14,
                  fontWeight: 500,
                  color: "#444444",
                  fontStyle: "italic",
                  whiteSpace: "nowrap",
                }}
              >
                Or login with
              </span>
              <div style={{ flex: 1, height: 1, backgroundColor: "#AAAAAA" }} />
            </div>

            {/* 3 white circles */}
            <div className="flex justify-center" style={{ gap: 24, marginBottom: 40 }}>
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  style={{
                    width: 65,
                    height: 65,
                    borderRadius: "50%",
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #D0D0D0",
                  }}
                />
              ))}
            </div>

            {/* Login link */}
            <div className="text-center">
              <span style={{ fontSize: 18, fontWeight: 500, color: "#000000" }}>
                Already have an account?{" "}
              </span>
              <button
                type="button"
                onClick={onLogin}
                className="underline transition-all hover:opacity-80"
                style={{ fontSize: 18, fontWeight: 600, color: "#00721E" }}
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
