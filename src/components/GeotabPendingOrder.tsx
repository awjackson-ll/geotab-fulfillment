import React, { useState, useEffect } from 'react';

function GeotabPendingOrder({ data, setData, onNavigate, stepConfig }: any) {
  const [localData, setLocalData] = useState(data[stepConfig.id] || { name: '', email: '' });

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

const request = new XMLHttpRequest();
  request.open("POST", "https://myadminapi.geotab.com/v2/MyAdminApi.ashx", true);
  request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  request.onreadystatechange = function () {
    if (request.readyState === 4) {
        if (request.status === 200) {
          const json = JSON.parse(request.responseText);
          if (json.result) {
              // Work with your result
              // Simple example just alerts its presence
              console.log(json.result);
          }
        }
    }
  };
  // Send the HTTP BODY in the JSON-RPC format. ID is ignored
  // and can be set to -1.
  // This example demonstrates authentication using HTTP POST.
//   const authenticateParams = {
//     "id" : -1,
//     "method" : "Authenticate",
//     "params" : {
//         "username":"service.geotab.device.admin@link-labs.com",
//         "password":"#G30ta@@1rf1nd3r@nywh3r3#"
//     }
//   };
// request.send("JSON-RPC=" + encodeURIComponent(JSON.stringify(authenticateParams)));


// Send the HTTP BODY in the JSON-RPC format. ID is ignored
// and can be set to -1.
// The method being called is “GetDevicePlans”.
// The “GetDevicePlans” method’s parameters are then passed in the “params” property
const apiMethod = {
  "id" : -1,
  "method" : "GetOnlineOrderStatus",
  "params" : {
    "apiKey":"5a84129c-4a21-4891-a797-58c06606ec1a",
    "forAccount":"LLAB01",
    "sessionId":"53a95e55-f00b-45a5-bec8-215a37d27aa2"
  }
};
request.send("JSON-RPC=" + encodeURIComponent(JSON.stringify(apiMethod)));

  return (
    <>
      <p className="configStepTitle">{stepConfig.title}</p>
      <div className="geotabContainer">
        
      </div>
    </>
  );
}

export default GeotabPendingOrder;
