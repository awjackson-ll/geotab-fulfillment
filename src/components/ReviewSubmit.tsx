import React, { useState, useEffect } from 'react';

function ReviewSubmit({ data, setData, onNavigate, stepConfig }: any) {
  const [localData, setLocalData] = useState(data[stepConfig.id] || { name: '', email: '' });

  useEffect(() => {
    // Keep localData in sync if global data for this step changes (e.g., navigating back)
    setLocalData(data[stepConfig.id] || { name: '', email: '' });
  }, [data, stepConfig.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (!localData.name || !localData.email) {
      alert("Please fill in all fields for Step 1.");
      return;
    }
    setData(prevData => ({ ...prevData, [stepConfig.id]: localData }));
    if (stepConfig.nextStepId) {
      onNavigate(stepConfig.nextStepId);
    } else {
      // This could be a terminal step if no nextStepId is defined
      alert("No next step defined from here. Consider this a submission point or add nextStepId.");
      // Potentially call a generic onSubmit if this is a valid end point
    }
  };

  return (
    <div>
      <h1>Review & Submit</h1>
    </div>
  );
}

export default ReviewSubmit;
