import './PortalConfigPopup.css';
import { X } from 'lucide-react';

function PortalConfigPopup({ setShowConfigPopup }: { setShowConfigPopup: (show: boolean) => void }) {
  return (
    <div className="portalConfigurationContainer">
      <div className="portalConfigurationViewport">
        <button onClick={() => setShowConfigPopup(false)}><X /></button>
      </div>
    </div>
  );
}

export default PortalConfigPopup;