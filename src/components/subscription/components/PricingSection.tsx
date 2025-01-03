import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card } from '../../ui/card';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import usePaypalIntegration from '../utils/usePaypalIntegration';

interface PricingSectionProps {
  onPaymentSuccess: (pulseAmount: number) => void;
}

const PricingSection: React.FC<PricingSectionProps> = ({ 
  onPaymentSuccess
}) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [pulseAmount, setPulseAmount] = useState(0);
  const [progress, setProgress] = useState(0);
  const paypalButtonContainer = useRef<HTMLDivElement>(null);
  const isMounted = useRef(true);

  const handlePaymentSuccess = useCallback((amount: number) => {
    console.log('[PricingSection] Handling payment success with amount:', amount);
    setPulseAmount(amount);
    setShowSuccess(true);
    onPaymentSuccess(amount);
  }, [onPaymentSuccess]);

  const { 
    initializePayPalButton,
    isInitializing,
    initializationError
  } = usePaypalIntegration({
    onPaymentSuccess: handlePaymentSuccess,
    onPaymentError: () => console.error('Payment error occurred')
  });

  useEffect(() => {
    console.log('[PricingSection] showSuccess changed:', showSuccess);
    if (showSuccess) {
      const interval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 1, 100));
      }, 20);

      const timer = setTimeout(() => {
        setShowSuccess(false);
        setProgress(0);
      }, 5000);

      return () => {
        clearInterval(interval);
        clearTimeout(timer);
      };
    }
  }, [showSuccess]);

  // Initialize PayPal button on mount
  useEffect(() => {
    if (!paypalButtonContainer.current) return;

    console.log('Initializing PayPal button');
    
    if (paypalButtonContainer.current && document.body.contains(paypalButtonContainer.current)) {
      initializePayPalButton(paypalButtonContainer.current);
    }

    // Cleanup function
    return () => {
      if (paypalButtonContainer.current && document.body.contains(paypalButtonContainer.current)) {
        console.log('Cleaning up PayPal button container');
        while (paypalButtonContainer.current.firstChild) {
          paypalButtonContainer.current.removeChild(paypalButtonContainer.current.firstChild);
        }
      }
    };
  }, [initializePayPalButton]);

  // Component unmount cleanup
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  return (
    <div className="relative">
      {showSuccess && (
        <>
          <Confetti 
            width={window.innerWidth}
            height={window.innerHeight}
            recycle={false}
            numberOfPieces={500}
            initialVelocityY={20}
            colors={['#22c55e', '#3b82f6', '#f59e0b', '#ec4899']}
            confettiSource={{ x: window.innerWidth / 2, y: window.innerHeight, w: 0, h: 0 }}
          />
          <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg z-50 flex items-center gap-2">
            <svg className="w-6 h-6 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>🎉 Success! {pulseAmount} Pulse added to your account</span>
          </div>
        </>
      )}

      {initializationError && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-full shadow-lg z-50 flex items-center gap-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{initializationError}</span>
        </div>
      )}

      <div className="max-w-md mx-auto">
        <motion.div
          whileHover={{ y: -10 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <Card className="relative p-8 rounded-lg bg-gray-900 border border-gray-800">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white">Premium Access</h2>
              <p className="mt-4 text-4xl font-bold text-white">$10.00</p>
              <p className="mt-2 text-gray-300">1000 Pulse</p>
            </div>
            
            <div className="mt-8 space-y-4">
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-300">Unlimited access to premium features</span>
              </div>
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-300">Priority support</span>
              </div>
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-300">Exclusive content</span>
              </div>
            </div>

            <div className="mt-8">
              <div 
                ref={paypalButtonContainer} 
                id="paypal-button-container"
                className="relative"
              >
                {isInitializing && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                  </div>
                )}
                {showSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="absolute -top-8 left-0 right-0 text-center text-green-400 font-bold"
                  >
                    Payment Successful!
                  </motion.div>
                )}
              </div>
              <div id="result-message" className="text-white mt-4"></div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default PricingSection;