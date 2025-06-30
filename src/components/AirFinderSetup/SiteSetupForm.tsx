import { useState } from 'react';

interface SiteSetupFormProps {
  data: any;
  onNext: (data: any) => void;
  onBack: () => void;
  onCancel: () => void;
}

function SiteSetupForm({ data, onNext, onBack, onCancel }: SiteSetupFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    location: 'everywhere', // 'onsite' or 'everywhere'
    airFinderType: 'ble', // 'ble' or 'xle'
    enableWorkflows: false,
    enableReports: false,
    enableAnalytics: false,
    ...data
  });

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev: any) => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleNext = () => {
    if (!formData.name) {
      alert("Please fill in the site name.");
      return;
    }
    onNext(formData);
  };

  return (
    <div className="max-w-lg mx-auto bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-[#46A0BF] text-white p-5 text-2xl font-light">
        Add Site
      </div>

      {/* Form Content */}
      <div className="p-5">
        {/* Name */}
        <div className="mb-6">
          <input
            type="text"
            name="name"
            value={formData.name}
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
                checked={formData.location === 'onsite'}
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
                checked={formData.location === 'everywhere'}
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
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="airFinderType"
                value="ble"
                checked={formData.airFinderType === 'ble'}
                onChange={handleChange}
                className="w-5 h-5 text-[#46A0BF] border-2 border-gray-300 focus:ring-[#46A0BF] focus:ring-2"
              />
              <span className="text-gray-700 text-base">AirFinder BLE</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="airFinderType"
                value="xle"
                checked={formData.airFinderType === 'xle'}
                onChange={handleChange}
                className="w-5 h-5 text-[#46A0BF] border-2 border-gray-300 focus:ring-[#46A0BF] focus:ring-2"
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
                  checked={formData.enableWorkflows}
                  onChange={handleChange}
                  className="w-4 h-4 text-[#46A0BF] border-2 border-gray-300 rounded focus:ring-[#46A0BF] focus:ring-2"
                />
                <span className="text-gray-700 text-sm">Enable Workflows</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="enableReports"
                  checked={formData.enableReports}
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
                  checked={formData.enableAnalytics}
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