import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PricingSection from './components/PricingSection';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from '../ui/loading-spinner';
import { PayPalButtonProvider } from './contexts/PayPalButtonContext';

export const SubscriptionPage = () => {
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
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900 via-gray-900 to-black">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      <div className="container mx-auto px-4 py-16 relative">
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-blue-500/10 text-blue-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Limited Time Offer
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
            Upgrade Your Experience
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Get unlimited access to premium features and take your conversations to the next level
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-16">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-200" />
            <div className="relative bg-gray-900 rounded-2xl p-8">
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 mb-6">What's Included</h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-white">Unlimited Conversations</h3>
                    <p className="text-gray-400">Chat without restrictions and explore deeper conversations</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-white">Priority Support</h3>
                    <p className="text-gray-400">Get faster responses and dedicated assistance</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-white">Advanced Features</h3>
                    <p className="text-gray-400">Access to premium features and exclusive content</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-200" />
            <div className="relative bg-gray-900 rounded-2xl p-8">
              <PayPalButtonProvider>
                <PricingSection onPaymentSuccess={(amount) => {
                  console.log('Payment successful, pulse added:', amount);
                }} />
              </PayPalButtonProvider>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-x-0 h-px -top-px bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-30" />
          <div className="text-center py-8">
            <p className="text-gray-400">
              Questions? <button className="text-blue-400 hover:text-blue-300 font-medium">Contact support</button>
            </p>
          </div>
          <div className="absolute inset-x-0 h-px -bottom-px bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-30" />
        </div>
      </div>
    </div>
  );
};
