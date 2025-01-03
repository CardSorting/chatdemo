import React from 'react';
import { Card } from '../../ui/card';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import { PayPalCheckout } from './PayPalCheckout';
import { useCheckout } from '../hooks/useCheckout';

interface PricingSectionProps {
  onPaymentSuccess: (pulseAmount: number) => void;
}

const PULSE_AMOUNT = 1000;
const PRICE_AMOUNT = '10.00';

const PricingSection: React.FC<PricingSectionProps> = ({ onPaymentSuccess }) => {
  const { 
    isProcessing,
    error, 
    showSuccess,
    handlePaymentSuccess,
    handlePaymentError
  } = useCheckout({
    pulseAmount: PULSE_AMOUNT,
    onSuccess: onPaymentSuccess
  });

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
            <span>🎉 Success! {PULSE_AMOUNT} Pulse added to your account</span>
          </div>
        </>
      )}

      <div className="max-w-md mx-auto">
        <motion.div
          whileHover={{ y: -10 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <Card className="relative p-8 rounded-lg bg-gray-900 border border-gray-800">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white">Premium Access</h2>
              <p className="mt-4 text-4xl font-bold text-white">${PRICE_AMOUNT}</p>
              <p className="mt-2 text-gray-300">{PULSE_AMOUNT} Pulse</p>
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
                className="relative"
              >
                {isProcessing && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg z-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                  </div>
                )}
                {error && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg z-10">
                    <div className="text-red-500 text-sm text-center px-4">
                      {error}
                    </div>
                  </div>
                )}
                <PayPalCheckout
                  amount={PRICE_AMOUNT}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default PricingSection;
