import React from 'react';
import { Button } from './ui/button';
import { useAuth } from '../hooks/useAuth';
import { updatePulseBalance } from '../services/pulse/pulseService';
import useSubscription from '../hooks/useSubscription';

const SubscriptionPage = () => {
  const { session } = useAuth();
  const { isSubscribed, subscribe, unsubscribe } = useSubscription();

  const handleSubscribe = async (tier: string) => {
    if (!session?.user?.id) {
      console.error("User not logged in");
      return;
    }

    // Placeholder for PayPal integration
    alert(`Initiating PayPal payment for ${tier} tier.`);

    subscribe(tier);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black/90">
      <div className="w-full max-w-md p-8 space-y-8 bg-black/80 rounded-lg border border-green-500/20">
        <h1 className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-blue-500">
          Subscription Page
        </h1>
        {isSubscribed ? (
          <div className="text-center">
            <h2 className="text-xl font-semibold text-white">You are subscribed!</h2>
            <Button onClick={unsubscribe}>Unsubscribe</Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-white">Basic</h2>
              <p className="text-gray-400">1000 Pulse per month</p>
              <Button onClick={() => handleSubscribe('basic')}>Subscribe</Button>
            </div>
            <div className="text-center">
              <h2 className="text-xl font-semibold text-white">Premium</h2>
              <p className="text-gray-400">2500 Pulse per month</p>
              <Button onClick={() => handleSubscribe('premium')}>Subscribe</Button>
            </div>
            <div className="text-center">
              <h2 className="text-xl font-semibold text-white">Elite</h2>
              <p className="text-gray-400">5000 Pulse per month</p>
              <Button onClick={() => handleSubscribe('elite')}>Subscribe</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionPage;