import { useState, useEffect } from 'react';
import OrgSetupForm from './OrgSetupForm';
import SiteSetupForm from './SiteSetupForm';
import AssetSetupForm from './AssetSetupForm';

type Step = 'organization' | 'site' | 'asset';

function AirFinderSetup({ data, setData, onNavigate, stepConfig }: any) {
  const [currentStep, setCurrentStep] = useState<Step>('organization');
  const [formData, setFormData] = useState({
    organization: {},
    site: {},
    asset: {},
    ...data[stepConfig.id]
  });

  useEffect(() => {
    // Keep formData in sync if global data for this step changes
    setFormData({
      organization: {},
      site: {},
      asset: {},
      ...data[stepConfig.id]
    });
  }, [data, stepConfig.id]);

  const handleOrgNext = (orgData: any) => {
    setFormData(prev => ({ ...prev, organization: orgData }));
    setCurrentStep('site');
  };

  const handleSiteNext = (siteData: any) => {
    setFormData(prev => ({ ...prev, site: siteData }));
    setCurrentStep('asset');
  };

  const handleAssetFinish = (assetData: any) => {
    const completedData = { 
      ...formData, 
      asset: assetData 
    };
    
    // Save to global data
    setData((prevData: any) => ({ 
      ...prevData, 
      [stepConfig.id]: completedData 
    }));
    
    // Navigate to next step or complete
    if (stepConfig.nextStepId) {
      onNavigate(stepConfig.nextStepId);
    } else {
      alert("AirFinder setup completed successfully!");
    }
  };

  const handleSiteBack = () => {
    setCurrentStep('organization');
  };

  const handleAssetBack = () => {
    setCurrentStep('site');
  };

  const handleCancel = () => {
    // Reset all form data
    setFormData({
      organization: {},
      site: {},
      asset: {}
    });
    setCurrentStep('organization');
    
    // Optional: navigate away or close modal
    if (stepConfig.previousStepId) {
      onNavigate(stepConfig.previousStepId);
    }
  };

  // Render the appropriate step component
  switch (currentStep) {
    case 'organization':
      return (
        <OrgSetupForm
          data={formData.organization}
          onNext={handleOrgNext}
          onCancel={handleCancel}
        />
      );
    
    case 'site':
      return (
        <SiteSetupForm
          data={formData.site}
          onNext={handleSiteNext}
          onBack={handleSiteBack}
          onCancel={handleCancel}
        />
      );
    
    case 'asset':
      return (
        <AssetSetupForm
          data={formData.asset}
          onFinish={handleAssetFinish}
          onBack={handleAssetBack}
          onCancel={handleCancel}
        />
      );
    
    default:
      return <div>Invalid step</div>;
  }
}

export default AirFinderSetup;
