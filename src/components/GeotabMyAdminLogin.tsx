import React, { useState, useEffect } from 'react';
import { myAdminApi } from '../services/geotabAPI';

function GeotabMyAdminLogin({ data, setData, onNavigate, stepConfig }: any) {
  const [localData, setLocalData] = useState(data[stepConfig.id] || { name: '', email: '' });
  const [username, setUsername] = useState(import.meta.env.VITE_GEOTAB_SERVICE_ACCOUNT_EMAIL);
  const [password, setPassword] = useState(import.meta.env.VITE_GEOTAB_SERVICE_ACCOUNT_PASSWORD);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    if (localStorage.getItem("myAdminSessionId")) {
      try {
        // myAdminApi.getPendingOrders(localStorage.getItem("myAdminSessionId") as string);
        if (stepConfig.nextStepId) {
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
    // Keep localData in sync if global data for this step changes (e.g., navigating back)
    setLocalData(data[stepConfig.id] || { name: '', email: '' });
  }, [data, stepConfig.id]);

  useEffect(() => {
    // Enable the button only if the username field is not empty
    setIsButtonDisabled(username.trim() === '');
  }, [username]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setLocalData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (!localData.name || !localData.email) {
      alert("Please fill in all fields for Step 1.");
      return;
    }
    setData((prevData: any) => ({ ...prevData, [stepConfig.id]: localData }));
    if (stepConfig.nextStepId) {
      onNavigate(stepConfig.nextStepId);
    } else {
      // This could be a terminal step if no nextStepId is defined
      alert("No next step defined from here. Consider this a submission point or add nextStepId.");
      // Potentially call a generic onSubmit if this is a valid end point
    }
  };

  const handleEmailChange = (event: any) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event: any) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    myAdminApi.authenticate(username, password);
    console.log('Username submitted:', username);
    handleNext();
  };



  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center font-sans">
      {/* Header Section */}
      <header className="absolute top-0 left-0 w-full p-6 md:p-10">
        <h1 className="text-3xl md:text-4xl font-bold text-blue-600">myADMIN</h1>
      </header>

      {/* Login Form Section */}
      <main className="w-full max-w-md p-8 space-y-8">
        <div className="text-center">
          <h2 className="text-4xl font-semibold text-gray-800">Log In</h2>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
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
              className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Username"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
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
              className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Password"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isButtonDisabled}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white 
                ${isButtonDisabled 
                  ? 'bg-blue-300 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
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
