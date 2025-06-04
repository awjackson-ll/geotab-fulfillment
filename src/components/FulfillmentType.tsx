import React, { useState, useEffect } from 'react';

function FulfillmentType({ data, setData, onNavigate, stepConfig, setNextStepId }: any) {
  const [localData, setLocalData] = useState(data[stepConfig.id] || { fulfillmentType: '' });

  useEffect(() => {
    // Keep localData in sync if global data for this step changes (e.g., navigating back)
    setLocalData(data[stepConfig.id] || { fulfillmentType: '' });
  }, [data, stepConfig.id]);

  function handleNext( nextStepId : string ) {
    
    setNextStepId(nextStepId);
    setData((prevData: any) => ({ ...prevData, [stepConfig.id]: localData }));
    if (stepConfig.nextStepId) {
      onNavigate(stepConfig.nextStepId);
    } else {
      // This could be a terminal step if no nextStepId is defined
      alert("No next step defined from here. Consider this a submission point or add nextStepId.");
      // Potentially call a generic onSubmit if this is a valid end point
    }
  };

  return (
    <>
      <p className="configStepTitle">{stepConfig.title}</p>
      <div className="typeContainer">
        <button
          className="typeButtonGeotab"
          onClick={() => handleNext("selectGeotabPendingOrder")}>
          <p>Geotab</p>
        </button>
        <button
          className="typeButtonEasyVote"
          onClick={() => handleNext("selectEasyVote")}>
          <p>EasyVote</p>
        </button>
      </div>
    </>
  );
}

export default FulfillmentType;
