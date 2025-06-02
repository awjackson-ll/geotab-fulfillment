import React, { useState, type JSX } from 'react';
import './LoginPage.css';
import { Eye, EyeOff } from 'lucide-react';

interface LoginFormProps {
  onLogin: (username: string, password: string) => void;
}

function LoginPage({ onLogin }: LoginFormProps): JSX.Element {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await onLogin(username, password);
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
    console.log('Login attempt with:', username);
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <>
      <div className="loginContainer">
        <div className="loginLeftPanel">
          <div className="loginBanner">
            <div className="logoContainer">
              <img 
                src="/src/assets/linkLabsLogo.png"
                alt="Link Labs Logo" 
                className="linkLabsLogo" 
                />
              <img 
                src="/src/assets/geotabLogo.png" 
                alt="Geotab Logo" 
                className="geotabLogo" 
                />
            </div>
          </div>
          <div className="loginFormContainer">
            <p className="loginTitle">Login to Your Account</p>
            
            <form onSubmit={handleSubmit} className="loginForm">
              <div className="formGroup">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Email"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="formInput"
                />
              </div>
              
              <div className="formGroup">
                <input
                  id="password"
                  name="password"
                  type={passwordVisible ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="formInput"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="togglePasswordVisibilityButton"
                  aria-label={passwordVisible ? 'Hide password' : 'Show password'}
                >
                  {passwordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className="loginButton">
                {isLoading ? "Logging in..." : "Login In"}
              </button>
            </form>
          </div>
        </div>
          
        <div className="loginRightPanel">
          <div className="imgContainer">
            <div className="portalTitle">
              <p>Link Labs</p>
              <p>Geotab</p>
              <p>Fulfillment</p>
              <p>Portal</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
