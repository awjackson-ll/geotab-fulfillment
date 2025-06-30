import { useState, useRef } from 'react';
import * as XLSX from 'xlsx';

interface AssetSetupFormProps {
  data: any;
  onFinish: (data: any) => void;
  onBack: () => void;
  onCancel: () => void;
}

type AssetView = 'selection' | 'import' | 'add' | 'automatic';

function AssetSetupForm({ data, onFinish, onBack, onCancel }: AssetSetupFormProps) {
  const [currentView, setCurrentView] = useState<AssetView>('selection');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState([{
    assetName: '',
    macAddress: '',
    category: '',
    group: '',
    field1: '',
    field2: '',
    addAnother: false,
    // ...data
  }]);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev: any) => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleImportAssets = () => {
    if (selectedFile) {
      // Process the uploaded file here
      console.log('Processing file:', selectedFile.name);
      // You can add XLSX parsing logic here
      onFinish(formData);
    } else {
      alert("Please select a file to import");
    }
  };

  const isMACAddress = (value: string): boolean => {
    if (!value || typeof value !== 'string') return false;
    
    const macPatterns = [
      /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/, // 00:1A:2B:3C:4D:5E or 00-1A-2B-3C-4D-5E
      /^([0-9A-Fa-f]{12})$/, // 001A2B3C4D5E
      /^([0-9A-Fa-f]{4}\.){2}([0-9A-Fa-f]{4})$/ // 001A.2B3C.4D5E
    ];
    
    return macPatterns.some(pattern => pattern.test(value.toString().trim()));
  };

  const isProductCode = (value: string): boolean => {
    if (!value || typeof value !== 'string') return false;
    
    // Placeholder product codes - update this array with actual Link Labs product codes
    const productCodes = [
      "ATK02",
      "ATK42",
      "RTK02",
      "E9",
      "E7",
      "E8",
      "C10",
      "S1",
      "S4",
      "V",
    ];
    
    const valueStr = value.toString().trim().toUpperCase();
    return productCodes.some(code => valueStr.includes(code));
  };

  const parseXLSXFile = async (file: File): Promise<{ assets: Array<{macAddress: string, productCode: string, rowIndex: number}>, allData: any[][] }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          
          // Get the first worksheet
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          
          // Convert to JSON array
          const jsonData: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1, blankrows: false });
          
          console.log('Parsed XLSX data:', jsonData);
          
          const assets: Array<{macAddress: string, productCode: string, rowIndex: number}> = [];
          
          // Analyze data row by row to find MAC addresses and product codes
          jsonData.forEach((row, rowIndex) => {
            if (Array.isArray(row)) {
              let macAddress = '';
              let productCode = '';
              
              // Look for MAC address and product code in the same row
              row.forEach((cell) => {
                if (cell) {
                  const cellValue = cell.toString().trim();
                  
                  // Check for MAC address
                  if (isMACAddress(cellValue) && !macAddress) {
                    macAddress = cellValue;
                  }
                  
                  // Check for product code
                  if (isProductCode(cellValue) && !productCode) {
                    productCode = cellValue;
                  }
                }
              });
              
              // If we found a MAC address in this row, create an asset object
              if (macAddress) {
                assets.push({
                  macAddress,
                  productCode: productCode || '', // Use empty string if no product code found in same row
                  rowIndex: rowIndex + 1
                });
                console.log(`Found asset at row ${rowIndex + 1}: MAC=${macAddress}, Product=${productCode || 'Not found'}`);
              }
            }
          });
          
          resolve({ assets, allData: jsonData });
        } catch (error) {
          console.error('Error parsing XLSX file:', error);
          reject(error);
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      reader.readAsArrayBuffer(file);
    });
  };

  const mapAssetsToFormData = (assets: Array<{macAddress: string, productCode: string, rowIndex: number}>) => {
    return assets.map((asset, index) => ({
      assetName: asset.macAddress,
      macAddress: asset.macAddress,
      category: '',
      group: '',
      field1: '',
      field2: asset.productCode, // Map product code to field2
      addAnother: index < assets.length - 1, // Set addAnother to true for all but the last entry
    }));
  };

  const handleFileSelect = async (file: File) => {
    // Validate file type (XLSX)
    if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.name.endsWith('.xlsx')) {
      setSelectedFile(file);
      console.log('File selected:', file.name);
      
      try {
        // Parse the XLSX file
        const parseResult = await parseXLSXFile(file);
        console.log('Parse result:', parseResult);
        
        // Update formData with parsed assets array
        if (parseResult.assets.length > 0) {
          // Map each asset to a formData entry
          const mappedFormData = mapAssetsToFormData(parseResult.assets);
          
          setFormData(mappedFormData);
          
          // Log what was found and mapped
          console.log(`Found ${parseResult.assets.length} assets in XLSX file:`);
          parseResult.assets.forEach((asset, index) => {
            console.log(`Asset ${index + 1}: MAC=${asset.macAddress}, Product=${asset.productCode}, Row=${asset.rowIndex}`);
          });
          
          console.log('Mapped form data:', mappedFormData);
          
        } else {
          console.log('No MAC addresses found in the XLSX file');
          alert('No MAC addresses detected in the file. Please verify the file content contains MAC addresses.');
        }
        
      } catch (error) {
        console.error('Error processing XLSX file:', error);
        alert('Error processing XLSX file. Please ensure it is a valid Excel file.');
      }
    } else {
      alert('Please select an XLSX file');
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleAddCategory = () => {
    alert("Add Category functionality to be implemented");
  };

  const handleAddGroup = () => {
    alert("Add Group functionality to be implemented");
  };

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
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx"
            onChange={handleFileInputChange}
            style={{ display: 'none' }}
          />
          
          {/* Drag and Drop Area */}
          <div 
            className={`border-2 border-dashed rounded-lg p-16 mb-8 text-center bg-white transition-colors ${
              isDragOver 
                ? 'border-[#46A0BF] bg-[#46A0BF]/5' 
                : 'border-gray-400'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center gap-4">
              {/* Upload Icon */}
              <svg className="w-16 h-16 text-[#46A0BF]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                <path d="M12,11L16,15H13V19H11V15H8L12,11Z" />
              </svg>
              
              {selectedFile ? (
                <div className="text-center">
                  <div className="text-green-600 font-medium mb-2">
                    File Selected: {selectedFile.name}
                  </div>
                  <div className="text-gray-500 text-sm">
                    Size: {(selectedFile.size / 1024).toFixed(1)} KB
                  </div>
                  <button
                    onClick={() => setSelectedFile(null)}
                    className="mt-2 text-red-500 hover:text-red-700 text-sm underline"
                  >
                    Remove file
                  </button>
                </div>
              ) : (
                <>
                  <div className="text-gray-600">
                    <span>Drag and drop XLSX file or</span>
                  </div>
                  
                  <button 
                    onClick={handleBrowseClick}
                    className="px-6 py-2 border-2 border-[#46A0BF] text-[#46A0BF] bg-transparent rounded hover:bg-[#46A0BF]/10 transition-colors font-medium"
                  >
                    Browse
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Bottom Section */}
          <div className="flex justify-between items-center">
            {/* Left side - XLSX Template */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#46A0BF] rounded-full flex items-center justify-center">
                <span className="text-white text-lg font-bold">!</span>
              </div>
              <button className="px-6 py-2 border-2 border-[#46A0BF] text-[#46A0BF] bg-transparent rounded hover:bg-[#46A0BF]/10 transition-colors font-medium">
                Download XLSX Template
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
            value={formData[0].assetName}
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
            value={formData[0].macAddress}
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
              value={formData[0].category}
              onChange={handleChange}
              className={`w-full p-3 border border-gray-300 rounded text-base bg-white ${
                formData[0].category ? 'text-black' : 'text-gray-500'
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
              value={formData[0].group}
              onChange={handleChange}
              className={`w-full p-3 border border-gray-300 rounded text-base bg-white ${
                formData[0].group ? 'text-black' : 'text-gray-500'
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
            value={formData[0].field1}
            onChange={handleChange}
            placeholder="Field 1"
            className="flex-1 p-3 border border-gray-300 rounded text-base bg-white placeholder-gray-500"
          />

          <input
            type="text"
            name="field2"
            value={formData[0].field2}
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
              checked={formData[0].addAnother}
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
            onClick={() => onFinish(formData)}
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