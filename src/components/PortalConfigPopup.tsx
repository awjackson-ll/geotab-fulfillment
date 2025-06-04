import React, { useState } from 'react';
import './PortalConfigPopup.css';
import { X } from 'lucide-react';
import FulfillmentType from './FulfillmentType';
import GeotabPendingOrder from './GeotabPendingOrder';
import EasyVote from './EasyVote';
import ReviewSubmit from './ReviewSubmit';
import GeotabMyAdminLogin from './GeotabMyAdminLogin';

function PortalConfigPopup({ setShowConfigPopup }: { setShowConfigPopup: (show: boolean) => void }) {
  const [nextStepId, setNextStepId] = useState('geotabMyAdminLogin');
  const stepsConfig = [
    {
      id: 'fulfillmentType',
      title: 'Select Fulfillment Type',
      component: FulfillmentType,
      nextStepId: nextStepId,
      prevStepId: null,
    },
    {
      id: 'geotabMyAdminLogin',
      title: 'Geotab MyAdmin Login',
      component: GeotabMyAdminLogin,
      nextStepId: 'selectGeotabPendingOrder',
      prevStepId: 'fulfillmentType',
    },
    {
      id: 'selectGeotabPendingOrder',
      title: 'Select Geotab Pending Order',
      component: GeotabPendingOrder,
      nextStepId: 'reviewSubmit',
      prevStepId: 'fulfillmentType',
    },
    {
      id: 'selectEasyVote',
      title: 'Select Easy Vote',
      component: EasyVote,
      nextStepId: 'reviewSubmit',
      prevStepId: 'fulfillmentType',
    },
    {
      id: 'reviewSubmitGeotab',
      title: 'Review & Submit Geotab',
      component: ReviewSubmit,
      nextStepId: null,
      prevStepId: 'selectGeotabPendingOrder',
    },
    {
      id: 'reviewSubmitEasy',
      title: 'Review & Submit Easy Vote',
      component: ReviewSubmit,
      nextStepId: null,
      prevStepId: 'selectEasyVote',
    },
  ];
  const [currentStepId, setCurrentStepId] = useState(stepsConfig[0]?.id);
  const [formData, setFormData] = useState({});

  const handleNavigate = (targetStepId: any) => {
    const targetStep = stepsConfig.find(step => step.id === targetStepId);
    if (targetStep) {
      setCurrentStepId(targetStepId);
    } else {
      console.error(`Error: Step with ID "${targetStepId}" not found.`);
      // Potentially show an error to the user or stay on the current step
    }
  };

  const handleSubmit = () => {
    console.log('Final Configuration Data:', formData);
    alert('Configuration Submitted! Check the console for data.');
    // Reset to the first step or show a success message
    setCurrentStepId(stepsConfig[0]?.id); // Reset to the initial step
    setFormData({});
  };

  // Find the current step's configuration and component
  const currentStepConfig = stepsConfig.find(step => step.id === currentStepId);
  
  if (!currentStepConfig) {
    return (
        <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8 text-red-600">
            Error: Current step configuration not found. Please check your stepsConfig.
        </div>
    );
  }
  const ActiveStepComponent = currentStepConfig.component;


  return (
    <div className="portalConfigContainer">
      <div className="portalConfigViewport">
        <div className="portalConfigHeader">
          <p className="portalConfigTitle">Configuration Menu</p>
          <button onClick={() => setShowConfigPopup(false)}><X /></button>
        </div>
        <div className="mb-6 text-center">
            {stepsConfig.map((step, index) => (
              <span key={step.id} className={`text-sm ${step.id === currentStepId ? 'font-bold text-indigo-600' : 'text-gray-500'}`}>
                {step.title}
                {index < stepsConfig.length - 1 && <span className="mx-1 text-gray-400">&rarr;</span>}
              </span>
            ))}
        </div>
        <div className="portalConfigContent">
          <ActiveStepComponent
            data={formData}
            setData={setFormData}
            onNavigate={handleNavigate}
            onSubmit={handleSubmit}
            stepConfig={currentStepConfig}
            setNextStepId={setNextStepId}
          />
        </div>
      </div>
    </div>
  );
}

export default PortalConfigPopup;