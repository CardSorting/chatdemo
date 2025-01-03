import React from 'react';
import { Button } from '../ui/button';
import HeroSection from '../subscription/components/HeroSection';
import PricingSection from '../subscription/components/PricingSection';
import CommunityImpact from '../subscription/components/CommunityImpact';
import TestimonialsSection from '../subscription/components/TestimonialsSection';
import usePaypalIntegration from './utils/usePaypalIntegration';

const SubscriptionPage = () => {
  const { paypalButtonContainer } = usePaypalIntegration();

  return (
    <div className="min-h-screen bg-gray-950">
      <HeroSection />
      
      {/* Sticky CTA */}
      <div className="sticky bottom-0 z-50 bg-gray-950/95 backdrop-blur-sm border-t border-gray-800 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-white">Ready to join?</h3>
            <p className="text-sm text-gray-300">Choose your membership level</p>
          </div>
          <Button 
            className="bg-gradient-to-r from-green-400 to-blue-400 hover:from-green-500 hover:to-blue-500 text-gray-950 font-bold"
            onClick={() => window.scrollTo({ top: 600, behavior: 'smooth' })}
          >
            View Plans
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <PricingSection paypalButtonContainer={paypalButtonContainer} />
        <CommunityImpact />
        <TestimonialsSection />
      </div>
    </div>
  );
};

export default SubscriptionPage;