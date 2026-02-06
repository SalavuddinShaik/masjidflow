import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import bismillah from "../assets/bismillah.svg";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF, FaApple } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";
import { ApiError } from "../services/api";

export function Signup() {
  const navigate = useNavigate();
  const { sendSignupOtp, isAuthenticated } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode] = useState("+1");
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/welcome");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const timer = setTimeout(() => setShowForm(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const validateForm = () => {
    if (!fullName.trim() || fullName.trim().length < 2) {
      setError("Please enter your name");
      return false;
    }
    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email");
      return false;
    }
    if (!phoneNumber || phoneNumber.length < 10) {
      setError("Please enter a valid phone number");
      return false;
    }
    return true;
  };

  const handleGetOtp = async () => {
    if (!validateForm()) return;

    setError("");
    setIsLoading(true);

    try {
      await sendSignupOtp({
        name: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: phoneNumber,
        countryCode,
      });
      navigate("/otp");
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontFamily: "Poppins, sans-serif",
    fontSize: "14px",
    fontWeight: 500,
    color: "#000000",
    marginBottom: "6px",
  };

  const textInputStyle: React.CSSProperties = {
    width: "100%",
    height: "70px",
    background: "rgba(255, 255, 255, 0.64)",
    border: "1px solid #C1C1C1",
    borderRadius: "20px",
    outline: "none",
    fontFamily: "Poppins, sans-serif",
    fontSize: "18px",
    fontWeight: 500,
    color: "#1a1a1a",
    paddingLeft: "20px",
    paddingRight: "20px",
  };

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center md:block">
      {/* Container */}
      <div className="relative overflow-hidden bg-white w-[412px] min-h-[917px] rounded-[30px] md:w-screen md:h-screen md:min-h-0 md:rounded-none">
        {/* Background */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url(/images/login-background.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />

        {/* White glow */}
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
          className="absolute z-20 left-1/2 -translate-x-1/2"
          style={{ top: "120px", width: "280px" }}
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

        {/* Form */}
        <div
          className={`absolute z-10 left-0 right-0 transition-all duration-700 ease-out ${
            showForm ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ top: "322px", paddingLeft: "28px", paddingRight: "28px" }}
        >
          {/* Error message */}
          {error && (
            <p
              className="m-0 w-full text-center"
              style={{
                marginBottom: "12px",
                fontFamily: "Poppins, sans-serif",
                fontSize: "12px",
                fontWeight: 500,
                color: "#dc2626",
              }}
            >
              {error}
            </p>
          )}

          {/* Name */}
          <label style={labelStyle}>Enter Your Name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value);
              setError("");
            }}
            placeholder="Your Name"
            style={textInputStyle}
          />

          {/* Email */}
          <label style={{ ...labelStyle, marginTop: "14px" }}>
            Enter Your Email ID
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
            placeholder="xyz@gmail.com"
            style={textInputStyle}
          />

          {/* Mobile */}
          <label style={{ ...labelStyle, marginTop: "14px" }}>
            Enter Mobile Number
          </label>

          <div
            className="flex items-center w-full rounded-[20px]"
            style={{
              height: "70px",
              background: "rgba(255, 255, 255, 0.64)",
              border: "1px solid #C1C1C1",
            }}
          >
            <div
              className="flex-shrink-0 flex items-center justify-center"
              style={{ width: "59px", height: "100%" }}
            >
              <span
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "18px",
                  fontWeight: 500,
                  color: "#1a1a1a",
                }}
              >
                {countryCode}
              </span>
            </div>

            <div
              style={{
                width: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div className="w-px h-10 bg-[#C1C1C1]" />
            </div>

            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => {
                setPhoneNumber(e.target.value.replace(/\D/g, ""));
                setError("");
              }}
              placeholder="XXXXXXXXXX"
              className="flex-1 h-full outline-none bg-transparent placeholder-gray-400 tracking-widest"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: "18px",
                fontWeight: 500,
                color: "#1a1a1a",
                paddingLeft: "0",
                paddingRight: "20px",
              }}
            />
          </div>

          {/* Button */}
          <button
            type="button"
            onClick={handleGetOtp}
            disabled={isLoading}
            className="text-white border-none cursor-pointer transition-all duration-200 hover:brightness-110 active:scale-[0.98] w-full rounded-[20px] disabled:opacity-70 disabled:cursor-not-allowed"
            style={{
              marginTop: "30px",
              height: "70px",
              backgroundColor: "#024413",
              fontFamily: "Poppins, sans-serif",
              fontSize: "18px",
              fontWeight: 500,
            }}
          >
            {isLoading ? "Sending..." : "Get OTP"}
          </button>

          {/* Divider */}
          <div
            className="flex items-center w-full"
            style={{ marginTop: "30px" }}
          >
            <div className="flex-1 h-px bg-[#AAAAAA]" />
            <span
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: "16px",
                fontWeight: 500,
                color: "#000",
                paddingLeft: "16px",
                paddingRight: "16px",
              }}
            >
              Or login with
            </span>
            <div className="flex-1 h-px bg-[#AAAAAA]" />
          </div>

          {/* Social circles */}
          <div
            className="flex justify-center w-full"
            style={{ marginTop: "36px", gap: "27px" }}
          >
            {[
              { Icon: FcGoogle, label: "Google" },
              { Icon: FaFacebookF, label: "Facebook", color: "#1877F2" },
              { Icon: FaApple, label: "Apple", color: "#000000" },
            ].map((social, i) => (
              <button
                key={i}
                className="rounded-full bg-white cursor-pointer hover:shadow-md transition-shadow flex items-center justify-center"
                style={{
                  width: "46px",
                  height: "46px",
                  border: "1px solid #D0D0D0",
                }}
                aria-label={social.label}
              >
                <social.Icon size={24} color={social.color} />
              </button>
            ))}
          </div>
        </div>

        {/* Bottom link */}
        <div
          style={{
            position: "absolute",
            bottom: "80px",
            left: "50%",
            transform: "translateX(-50%)",
            whiteSpace: "nowrap",
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          <span
            className="text-[16px]"
            style={{
              color: "#000",
              fontFamily: "Poppins, sans-serif",
              fontWeight: 500,
            }}
          >
            Already have an account ?
          </span>
          <button
            type="button"
            onClick={() => navigate("/phone-login")}
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "16px",
              fontWeight: 600,
              color: "#024413",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "0 12px",
            }}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
