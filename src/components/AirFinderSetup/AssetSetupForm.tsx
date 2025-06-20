import { useState } from 'react';

interface AssetSetupFormProps {
  data: any;
  onFinish: (data: any) => void;
  onBack: () => void;
  onCancel: () => void;
}

type AssetView = 'selection' | 'import' | 'add';

function AssetSetupForm({ data, onFinish, onBack, onCancel }: AssetSetupFormProps) {
  const [currentView, setCurrentView] = useState<AssetView>('selection');
  const [formData, setFormData] = useState({
    assetName: '',
    macAddress: '',
    category: '',
    group: '',
    field1: '',
    field2: '',
    addAnother: false,
    ...data
  });

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev: any) => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleFinish = () => {
    if (!formData.assetName || !formData.macAddress) {
      alert("Please fill in all required fields.");
      return;
    }
    onFinish(formData);
  };

  const handleImportAssets = () => {
    // For now, just show a placeholder - you can implement file upload later
    alert("Import Assets functionality to be implemented");
    onFinish({ importMode: true });
  };

  const handleAddCategory = () => {
    alert("Add Category functionality to be implemented");
  };

  const handleAddGroup = () => {
    alert("Add Group functionality to be implemented");
  };

  // Initial selection view
  if (currentView === 'selection') {
    return (
      <div className="max-w-lg mx-auto bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="bg-[#46A0BF] text-white p-5 text-2xl font-light">
          Add Assets
        </div>

        {/* Button Selection */}
        <div className="p-8 flex flex-col items-center">
          <div className="flex gap-4 mb-8">
            <button
              onClick={() => setCurrentView('import')}
              className="px-8 py-4 bg-gray-200 text-gray-700 border-none rounded text-base cursor-pointer font-medium hover:bg-gray-300 transition-colors"
            >
              Import Assets
            </button>
            
            <button
              onClick={() => setCurrentView('add')}
              className="px-8 py-4 bg-gray-200 text-gray-700 border-none rounded text-base cursor-pointer font-medium hover:bg-gray-300 transition-colors"
            >
              Add Asset
            </button>

            <button
              onClick={() => setCurrentView('add')}
              className="px-8 py-4 bg-gray-200 text-gray-700 border-none rounded text-base cursor-pointer font-medium hover:bg-gray-300 transition-colors"
            >
              Automatically Add Assets
            </button>
          </div>

          {/* Navigation buttons */}
          <div className="flex justify-between w-full pt-8">
            <button
              onClick={onBack}
              className="px-6 py-3 bg-transparent text-[#03A1C0] border-none rounded text-base cursor-pointer font-medium hover:bg-gray-100 transition-colors"
            >
              Back
            </button>
            
            <button
              onClick={onCancel}
              className="px-6 py-3 bg-transparent text-[#03A1C0] border-none rounded text-base cursor-pointer font-medium hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Import Assets view
  if (currentView === 'import') {
    return (
      <div className="max-w-4xl mx-auto bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="bg-[#46A0BF] text-white p-5 text-2xl font-light flex justify-between items-center">
          <span>Import Assets</span>
          <button
            onClick={() => setCurrentView('selection')}
            className="w-8 h-8 bg-transparent border-none text-white text-2xl cursor-pointer hover:bg-white/20 rounded transition-colors flex items-center justify-center"
          >
            ×
          </button>
        </div>

        {/* Import Content */}
        <div className="p-8">
          {/* Drag and Drop Area */}
          <div className="border-2 border-dashed border-gray-400 rounded-lg p-16 mb-8 text-center bg-white">
            <div className="flex flex-col items-center gap-4">
              {/* Upload Icon */}
              <svg className="w-16 h-16 text-[#46A0BF]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                <path d="M12,11L16,15H13V19H11V15H8L12,11Z" />
              </svg>
              
              <div className="text-gray-600">
                <span>Drag and drop CSV file or</span>
              </div>
              
              <button className="px-6 py-2 border-2 border-[#46A0BF] text-[#46A0BF] bg-transparent rounded hover:bg-[#46A0BF]/10 transition-colors font-medium">
                Browse
              </button>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="flex justify-between items-center">
            {/* Left side - CSV Template */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#46A0BF] rounded-full flex items-center justify-center">
                <span className="text-white text-lg font-bold">!</span>
              </div>
              <button className="px-6 py-2 border-2 border-[#46A0BF] text-[#46A0BF] bg-transparent rounded hover:bg-[#46A0BF]/10 transition-colors font-medium">
                Download CSV Template
              </button>
            </div>

            {/* Right side - Action buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => setCurrentView('selection')}
                className="px-6 py-3 bg-transparent text-[#03A1C0] border-none rounded text-base cursor-pointer font-medium hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              
              <button
                onClick={handleImportAssets}
                className="px-6 py-3 bg-[#46A0BF] text-white border-none rounded text-base cursor-pointer font-medium hover:bg-[#46A0BF]/80 transition-colors"
              >
                Complete Import
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Add Asset form view
  return (
    <div className="max-w-lg mx-auto bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-[#46A0BF] text-white p-5 text-2xl font-light">
        Add Asset Name
      </div>

      {/* Form Content */}
      <div className="p-5">
        {/* Asset Name */}
        <div className="mb-6">
          <input
            type="text"
            name="assetName"
            value={formData.assetName}
            onChange={handleChange}
            placeholder="Asset Name *"
            className="w-full p-3 border border-gray-300 rounded text-base bg-white placeholder-gray-500"
          />
        </div>

        {/* MAC Address */}
        <div className="mb-6">
          <input
            type="text"
            name="macAddress"
            value={formData.macAddress}
            onChange={handleChange}
            placeholder="MAC Address *"
            className="w-full p-3 border border-gray-300 rounded text-base bg-white placeholder-gray-500"
          />
        </div>

        {/* Category and Group Row */}
        <div className="flex gap-2.5 mb-6">
          <div className="flex-1 relative">
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`w-full p-3 border border-gray-300 rounded text-base bg-white ${
                formData.category ? 'text-black' : 'text-gray-500'
              }`}
            >
              <option value="" disabled>Category</option>
              <option value="vehicle">Vehicle</option>
              <option value="equipment">Equipment</option>
              <option value="trailer">Trailer</option>
              <option value="container">Container</option>
            </select>
            <button
              type="button"
              onClick={handleAddCategory}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-[#46A0BF] text-white rounded-full text-sm hover:bg-[#46A0BF]/80 transition-colors flex items-center justify-center"
            >
              +
            </button>
          </div>

          <div className="flex-1 relative">
            <select
              name="group"
              value={formData.group}
              onChange={handleChange}
              className={`w-full p-3 border border-gray-300 rounded text-base bg-white ${
                formData.group ? 'text-black' : 'text-gray-500'
              }`}
            >
              <option value="" disabled>Group</option>
              <option value="fleet1">Fleet 1</option>
              <option value="fleet2">Fleet 2</option>
              <option value="warehouse">Warehouse</option>
              <option value="field">Field</option>
            </select>
            <button
              type="button"
              onClick={handleAddGroup}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-[#46A0BF] text-white rounded-full text-sm hover:bg-[#46A0BF]/80 transition-colors flex items-center justify-center"
            >
              +
            </button>
          </div>
        </div>

        {/* Field 1 and Field 2 Row */}
        <div className="flex gap-2.5 mb-6">
          <input
            type="text"
            name="field1"
            value={formData.field1}
            onChange={handleChange}
            placeholder="Field 1"
            className="flex-1 p-3 border border-gray-300 rounded text-base bg-white placeholder-gray-500"
          />

          <input
            type="text"
            name="field2"
            value={formData.field2}
            onChange={handleChange}
            placeholder="Field 2"
            className="flex-1 p-3 border border-gray-300 rounded text-base bg-white placeholder-gray-500"
          />
        </div>

        {/* Add Another Checkbox */}
        <div className="mb-8">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="addAnother"
              checked={formData.addAnother}
              onChange={handleChange}
              className="w-4 h-4 text-[#46A0BF] border-2 border-gray-300 rounded focus:ring-[#46A0BF] focus:ring-2"
            />
            <span className="text-gray-700 text-sm">Add another</span>
          </label>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 pt-5">
          <button
            onClick={() => setCurrentView('selection')}
            className="px-6 py-3 bg-transparent text-[#03A1C0] border-none rounded text-base cursor-pointer font-medium hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          
          <button
            onClick={handleFinish}
            className="px-6 py-3 bg-[#46A0BF] text-white border-none rounded text-base cursor-pointer font-medium hover:bg-[#46A0BF]/80 transition-colors"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

export default AssetSetupForm;