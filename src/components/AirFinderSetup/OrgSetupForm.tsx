import { useState } from 'react';

interface OrgSetupFormProps {
  data: any;
  onNext: (data: any) => void;
  onCancel?: () => void;
}

function OrgSetupForm({ data, onNext, onCancel }: OrgSetupFormProps) {
  const [formData, setFormData] = useState({
    organization: '',
    address: '',
    address2: '',
    country: '',
    state: '',
    city: '',
    postalCode: '',
    contactFullName: '',
    email: '',
    phoneNumber: '',
    ...data
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    setFormData({
      organization: '',
      address: '',
      address2: '',
      country: '',
      state: '',
      city: '',
      postalCode: '',
      contactFullName: '',
      email: '',
      phoneNumber: ''
    });
    if (onCancel) onCancel();
  };

  const handleNext = () => {
    // Validate required fields
    if (!formData.organization || !formData.address || !formData.contactFullName || !formData.email) {
      alert("Please fill in all required fields.");
      return;
    }
    
    onNext(formData);
  };

  return (
    <div className="max-w-lg mx-auto bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-[#46A0BF] text-white p-5 text-2xl font-light">
        Add Organization
      </div>

      {/* Form Content */}
      <div className="p-5">
        {/* Organization */}
        <div className="mb-4">
          <input
            type="text"
            name="organization"
            value={formData.organization}
            onChange={handleChange}
            placeholder="Organization"
            className="w-full p-3 border border-gray-300 rounded text-base bg-white"
          />
        </div>

        {/* Address */}
        <div className="mb-4">
          <input
            type="text"
            name="address"
            value={formData.address}
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
          <select
            name="country"
            value={formData.country}
            onChange={handleChange}
            className={`flex-1 p-3 border border-gray-300 rounded text-base bg-white ${
              formData.country ? 'text-black' : 'text-gray-400'
            }`}
          >
            <option value="" disabled>Country</option>
            <option value="US">United States</option>
            <option value="CA">Canada</option>
            <option value="MX">Mexico</option>
          </select>

          <select
            name="state"
            value={formData.state}
            onChange={handleChange}
            className={`flex-1 p-3 border border-gray-300 rounded text-base bg-white ${
              formData.state ? 'text-black' : 'text-gray-400'
            }`}
          >
            <option value="" disabled>State</option>
            <option value="AL">Alabama</option>
            <option value="CA">California</option>
            <option value="FL">Florida</option>
            <option value="NY">New York</option>
            <option value="TX">Texas</option>
          </select>
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
            name="postalCode"
            value={formData.postalCode}
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
            name="contactFullName"
            value={formData.contactFullName}
            onChange={handleChange}
            placeholder="Contact Full Name"
            className="w-full p-3 border border-gray-300 rounded text-base bg-white"
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
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
            name="phoneNumber"
            value={formData.phoneNumber}
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