import { supabase } from '../../lib/supabase';
import { Pulse, ProfileWithPulse } from '../../types/profile';
import { useAuth } from '../../lib/auth';

export const getPulseBalance = async (userId: string): Promise<number> => {
  const { session } = useAuth();
  
  if (!session) {
    throw new Error('User not authenticated');
  }

  if (!userId || typeof userId !== 'string') {
    throw new Error('Invalid user ID');
  }

  try {
    const { data, error } = await supabase
      .from('pulse')
      .select('balance')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') { // No rows found
        return 0;
      }
      throw error;
    }
    return data?.balance || 0;
  } catch (error) {
    console.error('Error fetching Pulse balance:', error);
    return 0;
  }
};

export const updatePulseBalance = async (
  userId: string,
  amount: number
): Promise<Pulse> => {
  const { session } = useAuth();
  
  if (!session) {
    throw new Error('User not authenticated');
  }

  try {
    const { data, error } = await supabase
      .from('pulse')
      .upsert({ 
        user_id: userId, 
        balance: amount 
      }, {
        onConflict: 'user_id'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating Pulse balance:', error);
    throw error;
  }
};

export const getProfileWithPulse = async (
  userId: string
): Promise<ProfileWithPulse> => {
  const { session } = useAuth();
  
  if (!session) {
    throw new Error('User not authenticated');
  }

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*, pulse!inner(*)')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching profile with Pulse:', error);
    throw error;
  }
};