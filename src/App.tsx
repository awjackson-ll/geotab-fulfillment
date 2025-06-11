import { useState, useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import PortalPage from './pages/PortalPage';
import { PrimeReactProvider } from 'primereact/api';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';


function App() {
  const { auth, login, logout } = useAuth();
  const [error, setError] = useState<string | null | undefined>(null);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);

  // Simulate initial load to check auth status
  useEffect(() => {
    const timer = setTimeout(() => {
      setInitializing(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = async (username: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await login(username, password);
      
      if (!result.success) {
        setError(result.error);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
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
