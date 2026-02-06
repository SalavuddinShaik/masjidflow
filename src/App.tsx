import { BrowserRouter, Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { SplashScreen } from "./components/SplashScreen";
import { Login } from "./pages/Login";
import { PhoneLogin } from "./pages/PhoneLogin";
import { Signup } from "./pages/Signup";
import { Welcome } from "./pages/Welcome";
import { Otp } from "./pages/Otp";
import { BasicInfo } from "./pages/BasicInfo";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

import "./index.css";

// Loading screen component
function LoadingScreen() {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <div
          className="animate-spin rounded-full h-12 w-12 border-4 border-[#024413] border-t-transparent mx-auto mb-4"
        />
        <p style={{ fontFamily: "Poppins, sans-serif", color: "#444" }}>
          Loading...
        </p>
      </div>
    </div>
  );
}

// Protected route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/phone-login" replace />;
  }

  return <>{children}</>;
}

// Public route wrapper (redirects to welcome if already authenticated)
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isAuthenticated) {
    return <Navigate to="/welcome" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  const handleSplashComplete = () => {
    if (isAuthenticated) {
      navigate("/welcome");
    } else {
      navigate("/phone-login");
    }
  };

  return (
    <div className="w-full h-screen">
      <Routes>
        <Route
          path="/"
          element={
            isLoading ? (
              <LoadingScreen />
            ) : (
              <SplashScreen onComplete={handleSplashComplete} />
            )
          }
        />

        {/* Public routes - redirect to welcome if authenticated */}
        <Route
          path="/phone-login"
          element={
            <PublicRoute>
              <PhoneLogin />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          }
        />
        <Route
          path="/otp"
          element={<Otp />}
        />

        {/* Keep Login route for later */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login onLogin={() => navigate("/otp")} />
            </PublicRoute>
          }
        />

        {/* Protected routes - require authentication */}
        <Route
          path="/basic-info"
          element={
            <ProtectedRoute>
              <BasicInfo />
            </ProtectedRoute>
          }
        />
        <Route
          path="/welcome"
          element={
            <ProtectedRoute>
              <Welcome />
            </ProtectedRoute>
          }
        />

        {/* Catch all - redirect to splash */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
