import React from 'react';
import PricingSection from './components/PricingSection';
import { usePulse } from '../../hooks/usePulse';
import { useAuth } from '../../hooks/useAuth';

const SubscriptionPage = () => {
  const { user } = useAuth();
  const { addPulse } = usePulse(user?.id || '');

  const handlePaymentSuccess = (pulseAmount: number) => {
    console.log('Payment successful, adding pulse:', pulseAmount);
    addPulse(pulseAmount);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-8">Subscription Plans</h1>
      <PricingSection onPaymentSuccess={handlePaymentSuccess} />
    </div>
  );
};

export default SubscriptionPage;