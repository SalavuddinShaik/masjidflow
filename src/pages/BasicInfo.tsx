import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import bismillah from "../assets/bismillah.svg";
import { useAuth } from "../contexts/AuthContext";
import { ApiError } from "../services/api";

export function BasicInfo() {
  const navigate = useNavigate();
  const { user, updateProfile, isAuthenticated } = useAuth();

  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [whatsapp, setWhatsapp] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/phone-login");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const t = setTimeout(() => setShowForm(true), 300);
    return () => clearTimeout(t);
  }, []);

  const handleFinish = async () => {
    setError("");
    setIsLoading(true);

    try {
      await updateProfile({
        whatsappNumber: whatsapp || null,
        address: address || null,
        city: city || null,
        state: state || null,
      });
      navigate("/welcome");
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

  const handleSkip = () => {
    navigate("/welcome");
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    height: "70px",
    background: "rgba(255, 255, 255, 0.64)",
    border: "1px solid #C1C1C1",
    borderRadius: "20px",
    outline: "none",
    fontFamily: "Poppins, sans-serif",
    fontSize: "16px",
    fontWeight: 500,
    color: "#1a1a1a",
    paddingLeft: "18px",
    paddingRight: "18px",
  };

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center md:block">
      <div className="relative overflow-hidden bg-white w-[412px] min-h-[917px] rounded-[30px] md:w-screen md:h-screen md:min-h-0 md:rounded-none">
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

        {/* Content */}
        <div
          className={`absolute left-0 right-0 z-10 transition-all duration-700 ease-out ${
            showForm ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ top: "280px", paddingLeft: "28px", paddingRight: "28px" }}
        >
          <h2
            className="text-center"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "22px",
              fontWeight: 700,
              color: "#000",
              marginBottom: "22px",
            }}
          >
            Tell us a bit about you
          </h2>

          {/* Welcome message for new user */}
          {user && (
            <p
              className="text-center"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: "14px",
                fontWeight: 400,
                color: "#444",
                marginBottom: "16px",
              }}
            >
              Welcome, {user.name}!
            </p>
          )}

          {/* Error message */}
          {error && (
            <p
              className="text-center"
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

          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <input
              type="tel"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="Whatsapp Number"
              style={inputStyle}
            />
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Current Address"
              style={inputStyle}
            />
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City"
              style={inputStyle}
            />
            <input
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              placeholder="State"
              style={inputStyle}
            />
          </div>

          <button
            type="button"
            onClick={handleFinish}
            disabled={isLoading}
            className="text-white border-none cursor-pointer transition-all duration-200 hover:brightness-110 active:scale-[0.98] w-full rounded-[20px] disabled:opacity-70 disabled:cursor-not-allowed"
            style={{
              marginTop: "26px",
              height: "70px",
              backgroundColor: "#024413",
              fontFamily: "Poppins, sans-serif",
              fontSize: "18px",
              fontWeight: 600,
            }}
          >
            {isLoading ? "Saving..." : "Finish Setup"}
          </button>

          <button
            type="button"
            onClick={handleSkip}
            disabled={isLoading}
            className="w-full text-center disabled:opacity-70"
            style={{
              marginTop: "18px",
              fontFamily: "Poppins, sans-serif",
              fontSize: "16px",
              fontWeight: 600,
              color: "#024413",
              background: "none",
              border: "none",
              cursor: isLoading ? "not-allowed" : "pointer",
            }}
          >
            Skip &gt;&gt;
          </button>
        </div>
      </div>
    </div>
  );
}
