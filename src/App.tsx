import { useState, useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import PortalPage from './pages/PortalPage';
import './App.css';
import { Navigate, createBrowserRouter, RouterProvider } from 'react-router';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';



function App() {
  const navigate = useNavigate();
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
  }

  const router = createBrowserRouter([
    { 
      path: '/',
      element: <App />,
      errorElement: <h1>404 Page Not Found</h1>
    },
    {
      path: '/login',
      element: <LoginPage onLogin={handleLogin} />
    },
    {
      path: '/portal',
      element: <PortalPage />
    }
  ]);

  function isAuthenticated() {
    if (!auth.isAuthenticated) {
      navigate("/login");
      return (
        <div>
          <h1>{error}</h1>
        </div>
      );
    } else {
      navigate("/portal");
    }
  }

  return (
    <>
      <RouterProvider router={router} />
      {isAuthenticated()}
    </>
  )
}

export default App
