import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PricingSection from './components/PricingSection';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from '../ui/loading-spinner';
import { PayPalButtonProvider } from './contexts/PayPalButtonContext';

const SubscriptionPage = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login', { state: { from: '/subscription' } });
    }
  }, [user, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner className="scale-150" message="Loading account..." />
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-8">Subscription Plans</h1>
      <PayPalButtonProvider>
        <PricingSection onPaymentSuccess={(amount) => {
          console.log('Payment successful, pulse added:', amount);
        }} />
      </PayPalButtonProvider>
    </div>
  );
};

export default SubscriptionPage;
