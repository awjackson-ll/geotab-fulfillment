import { useState, useEffect } from 'react';

function FulfillmentType({ data, setData, onNavigate, stepConfig, setNextStepId, handleConsoleOutput }: any) {
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
      <p className="text-[24px] font-[500]">{stepConfig.title}</p>
      <div className="w-full h-full mt-6 flex flex-row justify-around items-center text-[24px] font-[700] text-white">
        <div
          className="flex justify-center items-center relative w-48 h-48 rounded-[10px] bg-[url('/src/assets/blueSemi.jpg')] bg-cover bg-center cursor-pointer transition-all duration-300 ease-in-out hover:scale-110"
          onClick={() => {
            handleNext("selectGeotabPendingOrder")
            handleConsoleOutput(" Fullfillment Type: Geotab");
          }}>
          <p className="absolute top-10">Geotab</p>
        </div>
        <div
          className="flex justify-center items-center relative w-48 h-48 rounded-[10px] bg-[url('/src/assets/americanFlag.jpg')] bg-cover bg-center cursor-pointer transition-all duration-300 ease-in-out hover:scale-110"
          onClick={() => {
            handleNext("selectEasyVote")
            handleConsoleOutput(" Fullfillment Type: EasyVote");
          }}>
          <p className="absolute top-10">EasyVote</p>
        </div>
      </div>
    </>
  );
}

export default FulfillmentType;
