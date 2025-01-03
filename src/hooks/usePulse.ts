import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export interface AddPulseResponse {
  success: boolean;
  error?: string;
  newBalance?: number;
}

export const usePulse = (userId: string) => {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      setLoading(true);
      
      // Reset balance if no userId
      if (!userId) {
        setBalance(0);
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching balance for userId:', userId);
        // First verify the user exists
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError) {
          console.error('Error getting user:', userError);
          throw userError;
        }
        
        if (!userData.user) {
          console.log('No authenticated user found');
          setBalance(0);
          return;
        }

        // Then fetch the profile with pulse balance
        const { data, error } = await supabase
          .from('profiles')
          .select('pulse_balance')
          .eq('id', userId)
          .limit(1)
          .maybeSingle();

        console.log('Profile query result:', { data, error });

        console.log('Fetch result:', { data, error });

        if (error) {
          console.error('Error fetching profile:', error);
          if (error.code === 'PGRST116') { // No rows found
            console.log('No profile found, setting balance to 0');
            setBalance(0);
          } else {
            console.error('Database error:', error.message, error.details, error.hint);
            setError(error);
          }
        } else if (!data) {
          console.log('No profile data found, setting balance to 0');
          setBalance(0);
        } else {
          const newBalance = data.pulse_balance ?? 0;
          console.log('Setting new balance:', newBalance, 'from data:', data);
          setBalance(newBalance);
        }
      } catch (err) {
        console.error('Error fetching pulse balance:', err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    console.log('useEffect triggered with userId:', userId);
    // Only fetch if we have a userId
    if (userId) {
      console.log('Starting balance fetch for userId:', userId);
      fetchBalance();
    } else {
      console.log('No userId provided, setting balance to 0');
      setBalance(0);
      setLoading(false);
    }
  }, [userId]);

  const addPulse = async (amount: number): Promise<AddPulseResponse> => {
    if (!userId || userId === '') {
      return {
        success: false,
        error: 'User ID is required to add Pulse'
      };
    }

    try {
      // Get current balance
      const { data: currentData, error: currentError } = await supabase
        .from('profiles')
        .select('pulse_balance')
        .eq('id', userId)
        .single();

      if (currentError) throw currentError;

      const newBalance = (currentData?.pulse_balance || 0) + amount;

      // Update balance in profiles table
      const { data: updatedData, error: updateError } = await supabase
        .from('profiles')
        .update({ pulse_balance: newBalance })
        .eq('id', userId)
        .select('pulse_balance')
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
      return {
        success: true,
        newBalance: newBalance
      };
    } catch (err) {
      console.error('Error adding Pulse:', err);
      setError(err as Error);
      return {
        success: false,
        error: (err as Error).message
      };
    }
  };

  const deductPulse = async (amount: number): Promise<AddPulseResponse> => {
    if (!userId || userId === '') {
      return {
        success: false,
        error: 'User ID is required to deduct Pulse'
      };
    }

    try {
      // Get current balance
      const { data: currentData, error: currentError } = await supabase
        .from('profiles')
        .select('pulse_balance')
        .eq('id', userId)
        .single();

      if (currentError) throw currentError;
      if (!currentData) throw new Error('Profile not found');

      if ((currentData.pulse_balance || 0) < amount) {
        return {
          success: false,
          error: 'Insufficient balance'
        };
      }

      const newBalance = currentData.pulse_balance - amount;

      // Update balance in profiles table
      const { data: updatedData, error: updateError } = await supabase
        .from('profiles')
        .update({ pulse_balance: newBalance })
        .eq('id', userId)
        .select('pulse_balance')
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
      return {
        success: true,
        newBalance: newBalance
      };
    } catch (err) {
      console.error('Error deducting Pulse:', err);
      setError(err as Error);
      return {
        success: false,
        error: (err as Error).message
      };
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
