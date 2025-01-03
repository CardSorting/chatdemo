import React, { useState } from 'react';
import { Card } from '../../ui/card';
import { Button } from '../../ui/button';
import { motion } from 'framer-motion';
import { purchaseTiers } from '../utils/data';
import { PayPalButtonContainerRef } from '../types/subscription';

interface PricingSectionProps {
  paypalButtonContainer: PayPalButtonContainerRef;
}

const PricingSection: React.FC<PricingSectionProps> = ({ paypalButtonContainer }) => {
  const handlePayment = async (tier: string) => {
    if (!paypalButtonContainer.current) {
      console.error("PayPal button container not found");
      return;
    }
    // Placeholder for PayPal integration
    alert(`Initiating PayPal payment for ${tier} tier.`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {purchaseTiers.map((tier, index) => (
        <motion.div
          key={index}
          whileHover={{ y: -10 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <Card className={`relative p-8 rounded-lg bg-gray-900 border ${
            tier.popular 
              ? 'border-green-400/50 shadow-lg shadow-green-400/20' 
              : 'border-gray-800'
          }`}>
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

            <div className="mt-8">
              <div ref={paypalButtonContainer} id="paypal-button-container"></div>
              <div id="result-message" className="text-white mt-4"></div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default PricingSection;