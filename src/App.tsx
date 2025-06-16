import { useState, useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import PortalPage from './pages/PortalPage';
import { PrimeReactProvider } from 'primereact/api';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';


function App() {
  const { auth, login, logout } = useAuth();
  const [initializing, setInitializing] = useState(true);

  // Simulate initial load to check auth status
  useEffect(() => {
    const timer = setTimeout(() => {
      setInitializing(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = async (username: string, password: string) => {
    try {
      const result = await login(username, password);
      
      if (!result.success) {
        console.error(result.error);
      }
    } catch (err) {
      console.error('An unexpected error occurred. Please try again.');
    }
  };

  const handleLogout = () => {
    logout();
  };

  if (initializing) {
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    );
  };

  return (
    <PrimeReactProvider>
      <Router>
        {!auth.isAuthenticated ? (
            <LoginPage onLogin={handleLogin} />
        ) : (
          <Routes>
            <Route 
              path="/" 
              element={<PortalPage auth={auth} onLogout={handleLogout} />} 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        )}
      </Router>
    </PrimeReactProvider>
  )
}

export default App;
