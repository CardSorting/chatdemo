import React, { useState, useEffect } from 'react';
import { Card } from '../../ui/card';
import { motion } from 'framer-motion';
import { purchaseTiers } from '../utils/data';
import { PayPalButtonContainerRef } from '../types/subscription';
import Confetti from 'react-confetti';

interface PricingSectionProps {
  paypalButtonContainer: PayPalButtonContainerRef;
  updateSelectedAmount: (amount: string) => void;
  onPaymentSuccess: (pulseAmount: number) => void;
}

const PricingSection: React.FC<PricingSectionProps> = ({ 
  paypalButtonContainer,
  updateSelectedAmount,
  onPaymentSuccess
}) => {
  const [selectedTier, setSelectedTier] = useState<number | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [pulseAmount, setPulseAmount] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (showSuccess) {
      // Animate progress bar
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

  const handleTierSelect = (index: number) => {
    setSelectedTier(index);
    // Update PayPal amount based on selected tier
    const amount = index === 0 ? '10.00' : index === 1 ? '30.00' : '50.00';
    updateSelectedAmount(amount);
  };

  const handlePaymentSuccess = (amount: number) => {
    setPulseAmount(amount);
    setShowSuccess(true);
    onPaymentSuccess(amount); // Call the parent success handler
  };

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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {purchaseTiers.map((tier, index) => (
          <motion.div
            key={index}
            whileHover={{ y: -10 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <Card 
              className={`relative p-8 rounded-lg bg-gray-900 border ${
                tier.popular 
                  ? 'border-green-400/50 shadow-lg shadow-green-400/20' 
                  : 'border-gray-800'
              } ${
                selectedTier === index ? 'ring-2 ring-blue-400' : ''
              } ${
                showSuccess && selectedTier === index ? 'animate-glow' : ''
              }`}
              onClick={() => handleTierSelect(index)}
            >
              {showSuccess && selectedTier === index && (
                <>
                  <div className="absolute inset-0 bg-green-500/10 flex items-center justify-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ 
                        type: 'spring', 
                        stiffness: 260, 
                        damping: 20,
                        repeat: 3,
                        repeatDelay: 0.5
                      }}
                      className="bg-green-500 rounded-full p-4"
                    >
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </motion.div>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800">
                    <div 
                      className="h-full bg-green-500 transition-all duration-1000 ease-out"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </>
              )}

              {tier.popular && (
                <div className="absolute top-0 right-0 -mt-4 -mr-4 bg-green-400 text-gray-950 px-3 py-1 rounded-full text-xs font-bold">
                  Most Popular
                </div>
              )}
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white">{tier.name}</h2>
                <p className="mt-4 text-4xl font-bold text-white">
                  {tier.price}
                </p>
                <p className="mt-2 text-gray-300">{tier.pulse}</p>
              </div>
              
              <div className="mt-8 space-y-4">
                {tier.benefits.map((benefit, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-300">{benefit}</span>
                  </div>
                ))}
              </div>

              {selectedTier === index && (
                <div className="mt-8">
                  <div 
                    ref={paypalButtonContainer} 
                    id="paypal-button-container"
                    className="relative"
                  >
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
              )}
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PricingSection;