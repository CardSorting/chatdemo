import React, { useState } from 'react';
import { Card } from '../../ui/card';
import { PayPalCheckout } from './PayPalCheckout';
import { useCheckout } from '../hooks/useCheckout';

interface PricingSectionProps {
  onPaymentSuccess: (pulseAmount: number) => void;
}

const PULSE_OPTIONS = [
  { amount: 500, price: '5.00', label: 'Starter' },
  { amount: 1000, price: '10.00', label: 'Popular', featured: true },
  { amount: 2000, price: '18.00', label: 'Pro', savings: '10% off' },
  { amount: 5000, price: '40.00', label: 'Ultimate', savings: '20% off' }
];

const PricingSection: React.FC<PricingSectionProps> = ({ onPaymentSuccess }) => {
  const [selectedOption, setSelectedOption] = useState(PULSE_OPTIONS[1]); // Default to Popular
  const { 
    isProcessing,
    error, 
    showSuccess,
    handlePaymentSuccess,
    handlePaymentError
  } = useCheckout({
    pulseAmount: selectedOption.amount,
    onSuccess: onPaymentSuccess
  });

  return (
    <div>
      {showSuccess && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg z-50 flex items-center gap-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>Success! {selectedOption.amount} Pulse added to your account</span>
        </div>
      )}

      <div className="mb-8">
        <div className="grid grid-cols-2 gap-2 mb-6">
          {PULSE_OPTIONS.map((option) => (
            <button
              key={option.amount}
              onClick={() => setSelectedOption(option)}
              className={`relative p-4 rounded-xl border-2 transition-all ${
                selectedOption.amount === option.amount
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-gray-800 hover:border-gray-700'
              }`}
            >
              {option.featured && (
                <div className="absolute -top-2 -right-2">
                  <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                    Popular
                  </div>
                </div>
              )}
              <div className="text-sm font-medium text-gray-400 mb-1">
                {option.label}
              </div>
              <div className="text-xl font-bold text-white mb-1">
                {option.amount} Pulse
              </div>
              <div className="flex items-baseline gap-2">
                <div className="text-lg font-bold text-white">
                  ${option.price}
                </div>
                {option.savings && (
                  <div className="text-xs text-green-400">
                    {option.savings}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
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
          amount={selectedOption.price}
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
        />
      </div>

      <div className="mt-6 text-center text-sm text-gray-400">
        Secure payment powered by PayPal
      </div>
    </div>
  );
};

export default PricingSection;
