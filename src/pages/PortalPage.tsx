import { useState, type JSX } from 'react';
import type { AuthState } from '../types';
import PortalConfigPopup from '../components/PortalConfigPopup';

interface AuthenticatedAppProps {
  auth: AuthState;
  onLogout: () => void;
}

function PortalPage({ onLogout }: AuthenticatedAppProps): JSX.Element {
  const [showConfigPopup, setShowConfigPopup] = useState(true);
  const [portalConsoleOutput, setPortalConsoleOutput] = useState('>');

  const handleConsoleOutput = (input: string) => {
    setPortalConsoleOutput(prevOutput => prevOutput + input + '\n>');
  };

  return (
    <>
      <div className="h-screen w-screen flex flex-col">
        {showConfigPopup ? <PortalConfigPopup setShowConfigPopup={setShowConfigPopup} handleConsoleOutput={handleConsoleOutput}/> : null}
        <div className="flex flex-row w-full h-24 bg-white shadow-md z-1">
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
          <button onClick={onLogout}>Logout</button>
          <button onClick={() => setShowConfigPopup(true)}>Config</button>
        </div>
        <div className="bg-[#F9FAFB] flex flex-row w-full h-[calc(100%-100px)]">
          <div className="w-24 bg-white shadow-md">
            
          </div>
          <div className="w-[calc(100%-100px)]">
            <div className="w-[calc(100%-50px)] h-[calc(100%-50px)] whitespace-pre-wrap rounded-[10px] m-6 p-5 bg-[#F0F5E6] border border-solid border-[#8CB82B] border-[2px] box-border overflow-y-auto font-[300] font-cascadia-mono text-[#8CB82B] text-xl shadow-md inset-shadow-[0px_0px_15px_2px_rgba(140,184,43,1)]">
              {portalConsoleOutput}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PortalPage;
