import { useState } from 'react';
import { airfinderAPI } from '../../services/airfinderAPI';
import ErrorBanner from '../ErrorBanner';

interface OrgSetupFormProps {
  data: any;
  onNext: (data: any) => void;
  onCancel?: () => void;
}

function OrgSetupForm({ data, onNext, onCancel }: OrgSetupFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    address1: '',
    address2: '',
    country: 0,
    state: 0,
    city: '',
    zipcode: '',
    primaryContact: '',
    primaryEmail: '',
    primaryPhone: '',
    techContact: '',
    techEmail: '',
    techPhone: '',
    properties: {
      isOrgCustomReportsEnable: false,
      dashboardPage: ""
    },
    ...data
  });

  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    
    // Parse country and state as numbers to maintain numeric type
    let processedValue = value;
    if (name === 'country' || name === 'state') {
      processedValue = value === '' ? 0 : parseInt(value, 10);
    }
    
    setFormData((prev: any) => ({ ...prev, [name]: processedValue }));
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      address1: '',
      address2: '',
      country: 0,
      state: 0,
      city: '',
      zipcode: '',
      primaryContact: '',
      primaryEmail: '',
      primaryPhone: '',
      techContact: '',
      techEmail: '',
      techPhone: '',
      properties: {
        isOrgCustomReportsEnable: false,
        dashboardPage: ""
    }});
    if (onCancel) onCancel();
  };

  const handleNext = async () => {
    // Clear any previous error messages
    setErrorMessage('');
    
    // Validate required fields
    if (!formData.name || !formData.address1 || !formData.primaryContact || !formData.primaryEmail || !formData.primaryPhone) {
      alert("Please fill in all required fields.");
      return;
    }
    
    const authString = localStorage.getItem("auth");
    const auth = authString ? JSON.parse(authString) : null;
    
    try {
      const response = await airfinderAPI.createOrg(auth?.token, JSON.stringify(formData));
      
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
        Add Organization
      </div>

      {/* Form Content */}
      <div className="p-5">
        {/* Error Banner */}
        {errorMessage && <ErrorBanner message={errorMessage} className='fixed bottom-4 right-4 z-50'/>}

        {/* Organization */}
        <div className="mb-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Organization"
            className="w-full p-3 border border-gray-300 rounded text-base bg-white"
          />
        </div>

        {/* Address */}
        <div className="mb-4">
          <input
            type="text"
            name="address1"
            value={formData.address1}
            onChange={handleChange}
            placeholder="Address"
            className="w-full p-3 border border-gray-300 rounded text-base bg-white"
          />
        </div>

        {/* Address 2 */}
        <div className="mb-4">
          <input
            type="text"
            name="address2"
            value={formData.address2}
            onChange={handleChange}
            placeholder="Address 2"
            className="w-full p-3 border border-gray-300 rounded text-base bg-white"
          />
        </div>

        {/* Country and State Row */}
        <div className="flex gap-2.5 mb-4">
          <input 
            type="number"
            name="country"
            placeholder="Country"
            value={formData.country}
            onChange={handleChange}
            className={`flex-1 p-3 border border-gray-300 rounded text-base bg-white ${
              formData.country ? 'text-black' : 'text-gray-400'
            }`}
          />

          <input
            type="number"
            name="state"
            placeholder="State"
            value={formData.state}
            onChange={handleChange}
            className={`flex-1 p-3 border border-gray-300 rounded text-base bg-white ${
              formData.state ? 'text-black' : 'text-gray-400'
            }`}
          />
        </div>

        {/* City and Postal Code Row */}
        <div className="flex gap-2.5 mb-8">
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="City"
            className="flex-1 p-3 border border-gray-300 rounded text-base bg-white"
          />

          <input
            type="text"
            name="zipcode"
            value={formData.zipcode}
            onChange={handleChange}
            placeholder="Postal Code"
            className="flex-1 p-3 border border-gray-300 rounded text-base bg-white"
          />
        </div>

        {/* Primary Contact Label */}
        <div className="text-gray-600 text-base mb-4 font-medium">
          Primary Contact
        </div>

        {/* Contact Full Name */}
        <div className="mb-4">
          <input
            type="text"
            name="primaryContact"
            value={formData.primaryContact}
            onChange={handleChange}
            placeholder="Primary Contact Full Name"
            className="w-full p-3 border border-gray-300 rounded text-base bg-white"
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <input
            type="email"
            name="primaryEmail"
            value={formData.primaryEmail}
            onChange={handleChange}
            placeholder="Primary Email"
            className="w-full p-3 border border-gray-300 rounded text-base bg-white"
          />
        </div>

        {/* Phone Number */}
        <div className="mb-10">
          <div className="text-gray-400 text-sm mb-1">
            Phone Number
          </div>
          <input
            type="tel"
            name="primaryPhone"
            value={formData.primaryPhone}
            onChange={handleChange}
            placeholder="+1 (202)-524-1390"
            className="w-full p-3 border border-gray-300 rounded text-base bg-white"
          />
        </div>

        {/* Technical Contact Label */}
        <div className="text-gray-600 text-base mb-4 font-medium">
          Technical Contact
        </div>

        {/* Technical Contact Full Name */}
        <div className="mb-4">
          <input
            type="text"
            name="techContact"
            value={formData.techContact}
            onChange={handleChange}
            placeholder="Technical Contact Full Name"
            className="w-full p-3 border border-gray-300 rounded text-base bg-white"
          />
        </div>

        {/* Technical Email */}
        <div className="mb-4">
          <input
            type="email"
            name="techEmail"
            value={formData.techEmail}
            onChange={handleChange}
            placeholder="Technical Email"
            className="w-full p-3 border border-gray-300 rounded text-base bg-white"
          />
        </div>

        {/* Technical Phone Number */}
        <div className="mb-10">
          <div className="text-gray-400 text-sm mb-1">
            Technical Phone Number
          </div>
          <input
            type="tel"
            name="techPhone"
            value={formData.techPhone}
            onChange={handleChange}
            placeholder="+1 (202)-524-1390"
            className="w-full p-3 border border-gray-300 rounded text-base bg-white"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 pt-5">
          <button
            onClick={handleCancel}
            className="px-6 py-3 bg-transparent text-[#03A1C0] border-none rounded text-base cursor-pointer font-medium hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          
          <button
            onClick={handleNext}
            className="px-6 py-3 bg-[#03A1C0] text-white border-none rounded text-base cursor-pointer font-medium hover:bg-[#03A1C0]/80 transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrgSetupForm;