import { useState } from 'react';
import { SplashScreen } from './components/SplashScreen';
import { Login } from './pages/Login';
import './index.css';

function App() {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  return (
    <div className="w-full h-screen">
      {showSplash ? (
        <SplashScreen onComplete={handleSplashComplete} />
      ) : (
        <Login />
      )}
    </div>
  );
}

export default App;
