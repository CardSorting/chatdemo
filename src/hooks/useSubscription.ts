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

  const subscribe = async (tier: string) => {
    if (!session?.user?.id) {
      console.error("User not logged in");
      return;
    }
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .insert({
          user_id: session.user.id,
          tier,
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