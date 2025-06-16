import { useState } from 'react';
import { X } from 'lucide-react';
import FulfillmentType from './FulfillmentType';
import GeotabPendingOrder from './GeotabPendingOrder';
import EasyVote from './EasyVote';
import ReviewSubmit from './ReviewSubmit';
import GeotabMyAdminLogin from './GeotabMyAdminLogin';

interface PortalConfigProps {
  setShowConfigPopup: (show: boolean) => void;
  handleConsoleOutput: (input: string) => void;
}

function PortalConfigPopup({ setShowConfigPopup, handleConsoleOutput }: PortalConfigProps) {
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
      nextStepId: 'reviewSubmitGeotab',
      prevStepId: 'fulfillmentType',
    },
    {
      id: 'selectEasyVote',
      title: 'Select Easy Vote',
      component: EasyVote,
      nextStepId: 'reviewSubmitEasy',
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
    <div className="fixed top-0 left-0 w-screen h-screen flex justify-center items-center bg-[rgba(0,0,0,0.33)] z-[999]">
      <div className="bg-white p-5 rounded w-[600px] min-h-[700px] max-h-[80vh] shadow-md">
        <div className="flex">
          <p className="text-[28px] font-[600] m-0 p-0">Configuration Menu</p>
          <button className="ml-auto hover:cursor-pointer" onClick={() => setShowConfigPopup(false)}><X /></button>
        </div>
        <div className="mb-6 text-center">
            {stepsConfig.map((step, index) => (
              <span key={step.id} className={`text-sm ${step.id === currentStepId ? 'font-bold text-[#8CB82B]' : 'text-gray-500'}`}>
                {step.title}
                {index < stepsConfig.length - 1 && <span className="mx-1 text-gray-400">&rarr;</span>}
              </span>
            ))}
        </div>
        <div className="w-full h-[63vh] flex flex-col justify-start overflow-y-auto">
          <ActiveStepComponent
            data={formData}
            setData={setFormData}
            onNavigate={handleNavigate}
            onSubmit={handleSubmit}
            stepConfig={currentStepConfig}
            setNextStepId={setNextStepId}
            handleConsoleOutput={handleConsoleOutput}
          />
        </div>
      </div>
    </div>
  );
}

export default PortalConfigPopup;