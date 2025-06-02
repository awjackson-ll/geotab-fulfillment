import React, { useState, type JSX } from 'react';
import './PortalPage.css';
import type { AuthState } from '../types';
import PortalConfigPopup from '../components/PortalConfigPopup';

interface AuthenticatedAppProps {
  auth: AuthState;
  onLogout: () => void;
}

function PortalPage({ auth, onLogout }: AuthenticatedAppProps): JSX.Element {
  const [showConfigPopup, setShowConfigPopup] = useState(true);

  return (
    <>
      <div className="portalContainer">
        {showConfigPopup ? <PortalConfigPopup setShowConfigPopup={setShowConfigPopup}/> : null}
        <div className="portalBanner">
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
          <button onClick={onLogout}>Logout</button>
          <button onClick={() => setShowConfigPopup(true)}>Config</button>
        </div>
        <div className="portalWindow">
          <div className="portalSidebar">
            
          </div>
          <div className="portalContent">
            <div className="portalResultViewport">
            <p>&gt;</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PortalPage;
