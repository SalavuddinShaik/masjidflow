import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { authService } from '../services/auth.service';
import type { User, SignupData } from '../types/auth.types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface PendingAuth {
  phone: string;
  countryCode: string;
  isSignup: boolean;
  signupData?: SignupData;
}

interface AuthContextType extends AuthState {
  pendingAuth: PendingAuth | null;
  sendLoginOtp: (phone: string, countryCode: string) => Promise<void>;
  sendSignupOtp: (data: SignupData) => Promise<void>;
  verifyOtp: (otp: string) => Promise<{ isNewUser: boolean }>;
  updateProfile: (data: Partial<Pick<User, 'whatsappNumber' | 'address' | 'city' | 'state'>>) => Promise<void>;
  logout: () => Promise<void>;
  clearPendingAuth: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });
  const [pendingAuth, setPendingAuth] = useState<PendingAuth | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setState(prev => ({ ...prev, isLoading: false }));
        return;
      }

      try {
        const user = await authService.getMe();
        setState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch {
        // Token invalid, clear it
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    };

    checkAuth();
  }, []);

  const sendLoginOtp = useCallback(async (phone: string, countryCode: string) => {
    await authService.sendLoginOtp(phone, countryCode);
    setPendingAuth({ phone, countryCode, isSignup: false });
  }, []);

  const sendSignupOtp = useCallback(async (data: SignupData) => {
    await authService.signup(data);
    setPendingAuth({
      phone: data.phone,
      countryCode: data.countryCode,
      isSignup: true,
      signupData: data,
    });
  }, []);

  const verifyOtp = useCallback(async (otp: string) => {
    if (!pendingAuth) {
      throw new Error('No pending authentication');
    }

    const result = await authService.verifyOtp(
      pendingAuth.phone,
      pendingAuth.countryCode,
      otp
    );

    // Store tokens
    localStorage.setItem('accessToken', result.accessToken);
    localStorage.setItem('refreshToken', result.refreshToken);

    // Update state
    setState({
      user: result.user,
      isAuthenticated: true,
      isLoading: false,
    });

    setPendingAuth(null);

    return { isNewUser: result.isNewUser };
  }, [pendingAuth]);

  const updateProfile = useCallback(async (data: Partial<Pick<User, 'whatsappNumber' | 'address' | 'city' | 'state'>>) => {
    const updatedUser = await authService.updateProfile(data);
    setState(prev => ({
      ...prev,
      user: updatedUser,
    }));
  }, []);

  const logout = useCallback(async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      try {
        await authService.logout(refreshToken);
      } catch {
        // Ignore errors during logout
      }
    }

    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  }, []);

  const clearPendingAuth = useCallback(() => {
    setPendingAuth(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        pendingAuth,
        sendLoginOtp,
        sendSignupOtp,
        verifyOtp,
        updateProfile,
        logout,
        clearPendingAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
