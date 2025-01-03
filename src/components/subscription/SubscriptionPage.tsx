import React, { useRef, useState } from 'react';
import { Button } from '../ui/button';
import HeroSection from '../subscription/components/HeroSection';
import PricingSection from '../subscription/components/PricingSection';
import CommunityImpact from '../subscription/components/CommunityImpact';
import TestimonialsSection from '../subscription/components/TestimonialsSection';
import usePaypalIntegration from './utils/usePaypalIntegration';
import { useToast } from '../ui/use-toast';

const SubscriptionPage = () => {
  const paypalButtonContainer = useRef(null);
  const { toast } = useToast();
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const handlePaymentSuccess = (pulseAmount: number) => {
    toast({
      title: (
        <div className="flex items-center gap-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>Payment Successful!</span>
        </div>
      ),
      description: `🎉 ${pulseAmount} Pulse has been added to your account. You can start using it immediately!`,
      duration: 5000,
      className: 'bg-green-500 text-white border-green-600',
    });
  };

  const handlePaymentError = (errorType?: string) => {
    let description = 'There was an issue processing your payment. Please try again.';
    
    if (errorType === 'pulse') {
      description = 'Payment was successful but we encountered an issue adding your Pulse. Please contact support.';
    } else if (errorType === 'network') {
      description = 'We encountered a network issue. Please check your connection and try again.';
    }

    toast({
      title: (
        <div className="flex items-center gap-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Payment Error</span>
        </div>
      ),
      description,
      duration: 7000,
      className: 'bg-red-500 text-white border-red-600',
      variant: 'destructive',
      action: (
        <Button 
          variant="outline" 
          className="text-red-500 bg-white hover:bg-gray-100"
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      ),
    });
  };

  const handlePaymentProcessing = (isProcessing: boolean) => {
    setIsProcessingPayment(isProcessing);
    if (isProcessing) {
      toast({
        title: 'Processing Payment...',
        description: 'Please wait while we process your payment.',
        duration: 3000,
        className: 'bg-blue-500 text-white border-blue-600',
      });
    }
  };

  const { updateSelectedAmount } = usePaypalIntegration({
    containerRef: paypalButtonContainer,
    onPaymentSuccess: handlePaymentSuccess,
    onPaymentError: handlePaymentError,
    onPaymentProcessing: handlePaymentProcessing
  });

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
        <PricingSection 
          paypalButtonContainer={paypalButtonContainer}
          updateSelectedAmount={updateSelectedAmount}
          isProcessingPayment={isProcessingPayment}
        />
        <CommunityImpact />
        <TestimonialsSection />
      </div>
    </div>
  );
};

export default SubscriptionPage;