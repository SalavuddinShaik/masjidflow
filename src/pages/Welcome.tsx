import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import bismillah from "../assets/bismillah.svg";
import { useAuth } from "../contexts/AuthContext";

export function Welcome() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [showContent, setShowContent] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/phone-login");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const t = setTimeout(() => setShowContent(true), 300);
    return () => clearTimeout(t);
  }, []);

  const handleStart = () => {
    // Navigate to home/dashboard when ready
    // For now, just stay on welcome page
    console.log("Starting app...");
  };

  const handleLogout = async () => {
    await logout();
    navigate("/phone-login");
  };

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center md:block">
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

        {/* Logout button */}
        <button
          onClick={handleLogout}
          className="absolute z-30 top-12 right-6 px-4 py-2 bg-white/80 rounded-full hover:bg-white transition-colors"
          style={{
            border: "1px solid #C1C1C1",
            fontFamily: "Poppins, sans-serif",
            fontSize: "14px",
            fontWeight: 500,
            color: "#024413",
          }}
        >
          Logout
        </button>

        {/* White glow (optional) */}
        <div
          className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
          style={{
            top: "320px",
            width: "320px",
            height: "220px",
            background:
              "radial-gradient(ellipse at center, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.55) 35%, rgba(255, 255, 255, 0.2) 65%, transparent 85%)",
            filter: "blur(40px)",
            zIndex: 5,
          }}
        />

        {/* Bismillah (centered like screenshot) */}
        <div
          className="absolute z-20 left-1/2 -translate-x-1/2"
          style={{ top: "260px", width: "300px" }}
        >
          <img
            src={bismillah}
            alt="Bismillah"
            className="w-full h-full"
            style={{
              filter:
                "drop-shadow(0 4px 20px rgba(255, 255, 255, 0.6)) drop-shadow(0 0 40px rgba(255, 255, 255, 0.25))",
            }}
          />
        </div>

        {/* Content */}
        <div
          className={`absolute left-0 right-0 z-10 transition-all duration-700 ease-out ${
            showContent
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-3"
          }`}
          style={{ top: "400px", paddingLeft: "28px", paddingRight: "28px" }}
        >
          <h2
            className="text-center"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "22px",
              fontWeight: 700,
              color: "#000",
              marginBottom: "10px",
            }}
          >
            Welcome, {user?.name || "User"}
          </h2>

          <p
            className="text-center"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "14px",
              fontWeight: 500,
              color: "#333",
              marginBottom: "18px",
            }}
          >
            You're now connected with <b>ICN Olesen</b>
          </p>

          <p
            className="text-center"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "13px",
              fontWeight: 400,
              color: "#444",
              lineHeight: "1.6",
              marginBottom: "26px",
            }}
          >
            Explore community services, book Janazah slots, join events, or
            support fundraising — all in one place.
          </p>

          <button
            type="button"
            onClick={handleStart}
            className="text-white border-none cursor-pointer transition-all duration-200 hover:brightness-110 active:scale-[0.98] w-full rounded-[20px]"
            style={{
              height: "70px",
              backgroundColor: "#024413",
              fontFamily: "Poppins, sans-serif",
              fontSize: "16px",
              fontWeight: 600,
              boxShadow: "0 10px 25px rgba(0,0,0,0.18)",
            }}
          >
            Let's start in the name of Allah!
          </button>
        </div>
      </div>
    </div>
  );
}
