import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { SplashScreen } from "./components/SplashScreen";
import { Login } from "./pages/Login";
import { PhoneLogin } from "./pages/PhoneLogin";
import { Signup } from "./pages/Signup";
import { Otp } from "./pages/Otp";
import "./index.css";

function AppRoutes() {
  const navigate = useNavigate();

  return (
    <div className="w-full h-screen">
      <Routes>
        <Route
          path="/"
          element={<SplashScreen onComplete={() => navigate("/login")} />}
        />
        <Route
          path="/login"
          element={<Login onLogin={() => navigate("/otp")} />}
        />
        <Route
          path="/phone-login"
          element={
            <PhoneLogin
              onGetOtp={() => navigate("/otp")}
              onSignup={() => navigate("/signup")}
            />
          }
        />
        <Route
          path="/signup"
          element={
            <Signup
              onGetOtp={() => navigate("/otp")}
              onLogin={() => navigate("/login")}
            />
          }
        />
        <Route
          path="/otp"
          element={
            <Otp
              phone="+00 XXXXXXXX"
              onBack={() => navigate(-1)}
              onVerified={() => navigate("/login")}
            />
          }
        />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
