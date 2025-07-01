import { useState } from 'react';
import { airfinderAPI } from '../../services/airfinderAPI';
import ErrorBanner from '../ErrorBanner';

interface SiteSetupFormProps {
  data: any;
  onNext: (data: any) => void;
  onBack: () => void;
  onCancel: () => void;
}

function SiteSetupForm({ data, onNext, onBack, onCancel }: SiteSetupFormProps) {
  const [formData, setFormData] = useState({
    configValue: '',
    properties: {
      isEverywhere: false,
      isAf2: true,
      isAf3: false,
      isWorkflowEnable: false,
      isCustomReportsEnable: false,
      isReportsEnable: false,
      organizationId: sessionStorage.getItem("orgId"),
    },
    ...data
  });

  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'location') {
      // Handle location radio buttons
      setFormData((prev: any) => ({
        ...prev,
        properties: {
          ...prev.properties,
          isEverywhere: value === 'everywhere',
          isAf2: value === 'onsite',
          isAf3: value === 'onsite'
        }
      }));
    } else if (name === 'airFinderType') {
      // Handle AirFinder type radio buttons
      setFormData((prev: any) => ({
        ...prev,
        properties: {
          ...prev.properties,
          isAf2: value === 'ble',
          isAf3: value === 'xle'
        }
      }));
    } else if (name === 'enableWorkflows') {
      // Handle Enable Workflows checkbox
      setFormData((prev: any) => ({
        ...prev,
        properties: {
          ...prev.properties,
          isWorkflowEnable: checked
        }
      }));
    } else if (name === 'enableReports') {
      // Handle Enable Reports checkbox
      setFormData((prev: any) => ({
        ...prev,
        properties: {
          ...prev.properties,
          isReportsEnable: checked
        }
      }));
    } else if (name === 'enableAnalytics') {
      // Handle Enable Analytics checkbox
      setFormData((prev: any) => ({
        ...prev,
        properties: {
          ...prev.properties,
          isCustomReportsEnable: checked
        }
      }));
    } else {
      // Handle top-level properties (like name)
      setFormData((prev: any) => ({ 
        ...prev, 
        [name]: type === 'checkbox' ? checked : value 
      }));
    }
  };

  const handleNext = async () => {
    // Clear any previous error messages
    setErrorMessage('');
    
    // Validate required fields
    if (!formData.configValue) {
      alert("Please fill in the site name.");
      return;
    }
    
    const authString = localStorage.getItem("auth");
    const auth = authString ? JSON.parse(authString) : null;
    
    try {
      const response = await airfinderAPI.createSite(auth?.token, JSON.stringify(formData));
      
      // Check if response has an error message
      if (response.message) {
        setErrorMessage(response.message);
        return; // Don't proceed to next step
      }
      
      // Success case
      onNext(formData);
    } catch (error) {
      console.error("API Error:", error);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-[#46A0BF] text-white p-5 text-2xl font-light">
        Add Site
      </div>

      {/* Form Content */}
      <div className="p-5">
        {/* Error Banner */}
        {errorMessage && <ErrorBanner message={errorMessage} className='fixed bottom-4 right-4 z-50'/>}
        {/* Name */}
        <div className="mb-6">
          <input
            type="text"
            name="configValue"
            value={formData.configValue}
            onChange={handleChange}
            placeholder="Name"
            className="w-full p-3 border border-gray-300 rounded text-base bg-white"
          />
        </div>

        {/* Location Options */}
        <div className="mb-8">
          <div className="flex items-center gap-8">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="location"
                value="onsite"
                checked={!formData.properties.isEverywhere}
                onChange={handleChange}
                className="w-5 h-5 text-[#46A0BF] border-2 border-gray-300 focus:ring-[#46A0BF] focus:ring-2"
              />
              <span className="text-gray-700 text-base">OnSite</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="location"
                value="everywhere"
                checked={formData.properties.isEverywhere}
                onChange={handleChange}
                className="w-5 h-5 text-[#46A0BF] border-2 border-gray-300 focus:ring-[#46A0BF] focus:ring-2"
              />
              <span className="text-gray-700 text-base">Everywhere</span>
            </label>
          </div>
        </div>

        {/* AirFinder Type Options */}
        <div className="mb-8">
          <div className="space-y-3">
            <label className={`flex items-center gap-2 cursor-pointer ${formData.properties.isEverywhere ? 'opacity-50 cursor-not-allowed' : ''}`}>
              <input
                type="radio"
                name="airFinderType"
                value="ble"
                checked={formData.properties.isAf2}
                disabled={formData.properties.isEverywhere}
                onChange={handleChange}
                className="w-5 h-5 text-[#46A0BF] border-2 border-gray-300 focus:ring-[#46A0BF] focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <span className="text-gray-700 text-base">AirFinder BLE</span>
            </label>

            <label className={`flex items-center gap-2 cursor-pointer ${formData.properties.isEverywhere ? 'opacity-50 cursor-not-allowed' : ''}`}>
              <input
                type="radio"
                name="airFinderType"
                value="xle"
                checked={formData.properties.isAf3}
                disabled={formData.properties.isEverywhere}
                onChange={handleChange}
                className="w-5 h-5 text-[#46A0BF] border-2 border-gray-300 focus:ring-[#46A0BF] focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <span className="text-gray-700 text-base">AirFinder XLE</span>
            </label>
          </div>
        </div>

        {/* Menus Section */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          {/* Events Menu */}
          <div>
            <h3 className="text-gray-600 text-base font-medium mb-4">Events Menu</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="enableWorkflows"
                  checked={formData.properties.isWorkflowEnable}
                  onChange={handleChange}
                  className="w-4 h-4 text-[#46A0BF] border-2 border-gray-300 rounded focus:ring-[#46A0BF] focus:ring-2"
                />
                <span className="text-gray-700 text-sm">Enable Workflows</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="enableReports"
                  checked={formData.properties.isReportsEnable}
                  onChange={handleChange}
                  className="w-4 h-4 text-[#46A0BF] border-2 border-gray-300 rounded focus:ring-[#46A0BF] focus:ring-2"
                />
                <span className="text-gray-700 text-sm">Enable Reports</span>
              </label>
            </div>
          </div>

          {/* Analytics Menu */}
          <div>
            <h3 className="text-gray-600 text-base font-medium mb-4">Analytics Menu</h3>
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="enableAnalytics"
                  checked={formData.properties.isCustomReportsEnable}
                  onChange={handleChange}
                  className="w-4 h-4 text-[#46A0BF] border-2 border-gray-300 rounded focus:ring-[#46A0BF] focus:ring-2"
                />
                <span className="text-gray-700 text-sm">Enable Analytics</span>
              </label>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-between pt-8">
          <button
            onClick={onBack}
            className="px-6 py-3 bg-transparent text-[#03A1C0] border-none rounded text-base cursor-pointer font-medium hover:bg-gray-100 transition-colors"
          >
            Back
          </button>
          
          <div className="flex gap-4">
            <button
              onClick={onCancel}
              className="px-6 py-3 bg-transparent text-[#03A1C0] border-none rounded text-base cursor-pointer font-medium hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            
            <button
              onClick={handleNext}
              className="px-6 py-3 bg-[#46A0BF] text-white border-none rounded text-base cursor-pointer font-medium hover:bg-[#46A0BF]/80 transition-colors"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SiteSetupForm;