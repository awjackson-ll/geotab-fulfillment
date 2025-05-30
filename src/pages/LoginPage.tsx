import React, { useState, type JSX } from 'react';
import './LoginPage.css';

interface LoginFormProps {
  onLogin: (username: string, password: string) => void;
}

function LoginPage({ onLogin }: LoginFormProps): JSX.Element {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);


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
                  type="email"
                  placeholder="Email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="formInput"
                />
              </div>
              
              <div className="formGroup">
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="formInput"
                />
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
