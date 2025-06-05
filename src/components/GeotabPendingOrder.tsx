import React, { useState, useEffect } from 'react';
import { myAdminApi } from '../services/geotabAPI';

function GeotabPendingOrder({ data, setData, onNavigate, stepConfig }: any) {
  const [localData, setLocalData] = useState(data[stepConfig.id] || { name: '', email: '' });
  const [pendingOrders, setPendingOrders] = useState<any>(null);

  function doFoo() {
    const json = myAdminApi.getPendingOrders(localStorage.getItem("myAdminSessionId") as string);
    setPendingOrders(json);
  }
  
  useEffect(() => {
    // Keep localData in sync if global data for this step changes (e.g., navigating back)
    setLocalData(data[stepConfig.id] || { name: '', email: '' });
  }, [data, stepConfig.id]);

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

  return (
    <>
      <p className="configStepTitle">{stepConfig.title}</p>
      <div className="geotabContainer">
        <button onClick={() => doFoo()}>Get Pending Orders</button>
      </div>
    </>
  );
}

export default GeotabPendingOrder;
