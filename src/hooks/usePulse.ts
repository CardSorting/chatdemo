import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export const usePulse = (userId: string) => {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      if (!userId) return;

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('pulse_balance')
          .eq('id', userId)
          .single();

        if (error) throw error;
        if (data) setBalance(data.pulse_balance);
      } catch (err) {
        console.error('Error fetching pulse balance:', err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, [userId]);

  const addPulse = async (amount: number) => {
    if (!userId) {
      throw new Error('User ID is required to add Pulse');
    }

    try {
      // Get current balance
      const { data: currentData, error: currentError } = await supabase
        .from('profiles')
        .select('pulse_balance')
        .eq('id', userId)
        .single();

      if (currentError) throw currentError;
      if (!currentData) throw new Error('User profile not found');

      const newBalance = currentData.pulse_balance + amount;

      // Update balance in profiles table
      const { data: updatedData, error: updateError } = await supabase
        .from('profiles')
        .update({ pulse_balance: newBalance })
        .eq('id', userId)
        .select()
        .single();

      if (updateError) throw updateError;

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
      setBalance(newBalance);
      return newBalance;
    } catch (err) {
      console.error('Error adding Pulse:', err);
      setError(err as Error);
      throw err;
    }
  };

  const deductPulse = async (amount: number) => {
    if (!userId) {
      throw new Error('User ID is required to deduct Pulse');
    }

    try {
      // Get current balance
      const { data: currentData, error: currentError } = await supabase
        .from('profiles')
        .select('pulse_balance')
        .eq('id', userId)
        .single();

      if (currentError) throw currentError;
      if (!currentData) throw new Error('User profile not found');

      const newBalance = currentData.pulse_balance - amount;

      // Update balance in profiles table
      const { data: updatedData, error: updateError } = await supabase
        .from('profiles')
        .update({ pulse_balance: newBalance })
        .eq('id', userId)
        .select()
        .single();

      if (updateError) throw updateError;

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
      setBalance(newBalance);
      return newBalance;
    } catch (err) {
      console.error('Error deducting Pulse:', err);
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