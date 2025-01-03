import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { updatePulseBalance } from '../services/pulse/pulseService';
import { supabase } from '../lib/supabase';

const useSubscription = () => {
  const { session } = useAuth();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [lastAwardDate, setLastAwardDate] = useState<Date | null>(null);
  const [pulseAward, setPulseAward] = useState(0);
  const [subscriptionId, setSubscriptionId] = useState<string | null>(null);

  const getPulseAward = (tier: string) => {
    switch (tier) {
      case 'basic':
        return 1000;
      case 'premium':
        return 2500;
      case 'elite':
        return 5000;
      default:
        return 0;
    }
  };

  const getTierPrice = (tier: string) => {
    switch (tier) {
      case 'basic':
        return '5.00';
      case 'premium':
        return '15.00';
      case 'elite':
        return '25.00';
      default:
        return '0.00';
    }
  };

  const awardPulse = async (amount: number) => {
    if (!session?.user?.id) {
      console.error("User not logged in");
      return;
    }
    try {
      await updatePulseBalance(session.user.id, amount);
      setLastAwardDate(new Date());
      if (subscriptionId) {
        await supabase
          .from('subscriptions')
          .update({ last_award_date: new Date().toISOString() })
          .eq('id', subscriptionId);
      }
      alert(`Successfully awarded ${amount} pulse!`);
    } catch (error) {
      console.error("Error awarding pulse:", error);
      alert("Error awarding pulse. Please try again later.");
    }
  };

  useEffect(() => {
    const fetchSubscription = async () => {
      if (!session?.user?.id) return;
      try {
        const { data, error } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', session.user.id)
          .single();

        if (error) {
          if (error.code !== 'PGRST116') {
            console.error("Error fetching subscription:", error);
          }
          return;
        }

        setIsSubscribed(true);
        setLastAwardDate(data.last_award_date ? new Date(data.last_award_date) : null);
        setPulseAward(getPulseAward(data.tier));
        setSubscriptionId(data.id);
      } catch (error) {
        console.error("Error fetching subscription:", error);
      }
    };

    fetchSubscription();
  }, [session]);

  const subscribe = async (tier: string) => {
    if (!session?.user?.id) {
      console.error("User not logged in");
      return;
    }

    try {
      // Initialize PayPal payment
      const paypalResponse = await fetch('https://api-m.sandbox.paypal.com/v1/oauth2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${btoa(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`)}`
        },
        body: 'grant_type=client_credentials'
      });

      const { access_token } = await paypalResponse.json();

      // Create PayPal order
      const orderResponse = await fetch('https://api-m.sandbox.paypal.com/v2/checkout/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access_token}`,
          'PayPal-Request-Id': process.env.PAYPAL_APP_NAME
        },
        body: JSON.stringify({
          intent: 'CAPTURE',
          purchase_units: [{
            amount: {
              currency_code: 'USD',
              value: getTierPrice(tier)
            }
          }]
        })
      });

      const order = await orderResponse.json();
      
      // Redirect to PayPal approval URL
      if (order.links && order.links[1] && order.links[1].href) {
        window.location.href = order.links[1].href;
      }

      // If payment is successful, create subscription
      const { data, error } = await supabase
        .from('subscriptions')
        .insert({
          user_id: session.user.id,
          tier,
          paypal_order_id: order.id,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating subscription:", error);
        return;
      }

      setIsSubscribed(true);
      setPulseAward(getPulseAward(tier));
      setSubscriptionId(data.id);
      awardPulse(getPulseAward(tier));
    } catch (error) {
      console.error("Error creating subscription:", error);
    }
  };

  const unsubscribe = async () => {
    if (!session?.user?.id || !subscriptionId) {
      console.error("User not logged in or no subscription found");
      return;
    }
    try {
      const { error } = await supabase
        .from('subscriptions')
        .delete()
        .eq('id', subscriptionId);

      if (error) {
        console.error("Error deleting subscription:", error);
        return;
      }

      setIsSubscribed(false);
      setLastAwardDate(null);
      setPulseAward(0);
      setSubscriptionId(null);
    } catch (error) {
      console.error("Error deleting subscription:", error);
    }
  };

  useEffect(() => {
    if (isSubscribed && session?.user?.id && pulseAward > 0) {
      const now = new Date();
      if (lastAwardDate) {
        const timeDiff = now.getTime() - lastAwardDate.getTime();
        const daysDiff = timeDiff / (1000 * 3600 * 24);
        if (daysDiff >= 30) {
          awardPulse(pulseAward);
        }
      } else {
        awardPulse(pulseAward);
      }
    }
  }, [isSubscribed, lastAwardDate, session, pulseAward, subscriptionId]);

  return { isSubscribed, subscribe, unsubscribe };
};

export default useSubscription;