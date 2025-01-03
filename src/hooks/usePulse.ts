import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export const usePulse = (userId: string) => {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('pulse_balance')
          .eq('id', userId)
          .single();

        if (error) throw error;
        setBalance(data.pulse_balance);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, [userId]);

  const addPulse = async (amount: number) => {
    try {
      // Update balance in profiles table
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .update({ pulse_balance: balance + amount })
        .eq('id', userId)
        .select()
        .single();

      if (profileError) throw profileError;

      // Create transaction record
      const { error: transactionError } = await supabase
        .from('pulse_transactions')
        .insert({
          user_id: userId,
          amount: amount,
          transaction_type: 'purchase',
          description: 'Pulse purchase'
        });

      if (transactionError) throw transactionError;

      // Update local state
      setBalance(profileData.pulse_balance);
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const deductPulse = async (amount: number) => {
    try {
      // Update balance in profiles table
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .update({ pulse_balance: balance - amount })
        .eq('id', userId)
        .select()
        .single();

      if (profileError) throw profileError;

      // Create transaction record
      const { error: transactionError } = await supabase
        .from('pulse_transactions')
        .insert({
          user_id: userId,
          amount: amount,
          transaction_type: 'usage',
          description: 'Pulse usage'
        });

      if (transactionError) throw transactionError;

      // Update local state
      setBalance(profileData.pulse_balance);
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  return {
    balance,
    loading,
    error,
    addPulse,
    deductPulse,
  };
};