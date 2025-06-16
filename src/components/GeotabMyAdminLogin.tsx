import { useState, useEffect } from 'react';
import { myAdminApi } from '../services/geotabAPI';

function GeotabMyAdminLogin({ setData, onNavigate, stepConfig, handleConsoleOutput }: any) {
  const MILLI_IN_A_WEEK = 604800000;
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  useEffect(() => {
    // This logic isn't working currently, and new token is always requested
    if (localStorage.getItem("myAdminSessionId") &&
        localStorage.getItem("myAdminSessionIdExpiration") &&
        (Date.now() - parseInt(localStorage.getItem("myAdminSessionIdExpiration") as string)) < MILLI_IN_A_WEEK) {
      try {
        if (stepConfig.nextStepId) {
          handleConsoleOutput(" Using cached session ID");
          onNavigate(stepConfig.nextStepId);
        } else {
          // This could be a terminal step if no nextStepId is defined
          alert("No next step defined from here. Consider this a submission point or add nextStepId.");
          // Potentially call a generic onSubmit if this is a valid end point
        }
      } catch (error) {
        console.error("Error getting pending orders:", error);
      }
    }
  }, []);

  useEffect(() => {
    // Enable the button only if the username field is not empty
    setIsButtonDisabled(username.trim() === '' || password.trim() === '');
  }, [username, password]);

  const handleNext = () => {
    if (!username || !password) {
      alert("Please fill in all fields for " + stepConfig.title);
      return;
    }
    setData((prevData: any) => ({ ...prevData, [stepConfig.id]: { username: username } }));
    if (stepConfig.nextStepId) {
      onNavigate(stepConfig.nextStepId);
    } else {
      // This could be a terminal step if no nextStepId is defined
      alert("No next step defined from here. Consider this a submission point or add nextStepId.");
      // Potentially call a generic onSubmit if this is a valid end point
    }
  };

  const handleEmailChange = (event: any) => {
    console.log('Username changed to: ' + event.target.value);
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event: any) => {
    console.log('Password changed to: ' + event.target.value);
    setPassword(event.target.value);
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    try {
      handleConsoleOutput(' Attempting to authenticate with username');
      handleConsoleOutput('  └─' + username);
      await myAdminApi.authenticate(username, password);
      handleConsoleOutput(' Authentication successful');
      handleNext();
    } catch (error) {
      handleConsoleOutput(' Authentication failed: ' + error);
    }
  };

  return (
    <div className="h-full bg-[#F9FAFB] flex flex-col items-center justify-center font-roboto">
      <main className="w-full max-w-md p-8 space-y-8">
        <div className="text-center">
          <h2 className="text-4xl font-semibold text-gray-800">{stepConfig.title}</h2>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label htmlFor="username" className="block text-[16px] font-[400] text-[#1f2833] leading-[1.125] mb-2">
              Username (Email)
            </label>
            <input
              id="username"
              name="username"
              type="email" // Using type="email" for better semantics and potential browser validation
              autoComplete="email"
              required
              value={username}
              onChange={handleEmailChange}
              className="appearance-none rounded-md relative block w-full p-1.75 border border-[#DFE5EB] placeholder-[#949494] text-black hover:border-[#66788C] focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Username"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-[16px] font-[400] text-[#1f2833] leading-[1.125] mb-2">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password" // Using type="email" for better semantics and potential browser validation
              autoComplete="email"
              required
              value={password}
              onChange={handlePasswordChange}
              className="appearance-none rounded-md relative block w-full p-1.75 border border-[#DFE5EB] placeholder-[#949494] text-black hover:border-[#66788C] focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Password"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isButtonDisabled}
              className={`group relative w-full flex justify-center px-3 py-2.5 border border-transparent text-sm font-medium rounded-md text-white 
                ${isButtonDisabled 
                  ? 'bg-[#D8DEE9]' 
                  : 'bg-[#0078D3] hover:bg-[#0078D3] hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                }`}
            >
              Next
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default GeotabMyAdminLogin;
