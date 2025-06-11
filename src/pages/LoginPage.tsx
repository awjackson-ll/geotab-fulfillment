import React, { useState, type JSX } from 'react';
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
      <div className="h-screen w-screen flex flex-row">
        <div className="w-2/3 bg-gray-100 flex flex-col shadow-md z-1">
          <div className="flex flex-row w-full h-24 bg-white shadow-md">
            <div className="flex flex-col items-start ml-5 mt-5">
              <img 
                src="/src/assets/linkLabsLogo.png"
                alt="Link Labs Logo" 
                className="w-48 mb-1" 
                />
              <img 
                src="/src/assets/geotabLogo.png" 
                alt="Geotab Logo" 
                className="w-48 mb-1" 
                />
            </div>
          </div>
          <div className="flex flex-col justify-center mx-auto my-0 mt-8">
            <p className="text-[#08334D] text-[64px] mb-[40px] font-[700]">Login to Your Account</p>
            
            <form onSubmit={handleSubmit} className="flex flex-col items-center w-3/5 m-auto mt-12">
              <div className="mb-5 w-full relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Email"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-[5px] bg-[#f0f5e6] text-base box-border px-[12px] py-[15px] border-none shadow-sm"
                />
              </div>
              
              <div className="mb-5 w-full relative">
                <input
                  id="password"
                  name="password"
                  type={passwordVisible ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-[5px] bg-[#f0f5e6] text-base box-border px-[12px] py-[15px] border-none shadow-sm"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="text-[#757575] absolute top-[60%] right-[10%] -translate-y-[65%] translate-x-[100%] bg-transparent border-none cursor-pointer z-1 m-0 p-0"
                  aria-label={passwordVisible ? 'Hide password' : 'Show password'}
                >
                  {passwordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-3/5 p-3 bg-[#8cb82b] border-none transition ease-in-out hover:bg-[#7aa125] active:translate-y-[2px] active:shadow-sm text-white rounded-[5px] text-base font-bold cursor-pointer mt-12 shadow-lg">
                {isLoading ? "Logging in..." : "Login In"}
              </button>
            </form>
          </div>
        </div>
          
        <div className="w-1/3 relative flex flex-col justify-center items-center text-white text-center">
          <div className="h-full w-full flex justify-center bg-[url(/src/assets/blueSemi.jpg)] bg-cover bg-center bg-linear-to-t-[at_0%_25%_50%] from-[rgba(8, 51, 77, 1)] to-[rgba(8, 51, 77, 0.5)] to-[rgba(8, 51, 77, 0)]">
            <div className="pt-10 text-center text-[64px] font-[700] m-0">
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
