import { supabase } from '../../lib/supabase';
import { Pulse, ProfileWithPulse } from '../../types/profile';

export const getPulseBalance = async (userId: string): Promise<number> => {
  const { data, error } = await supabase
    .from('pulse')
    .select('balance')
    .eq('user_id', userId)
    .single();

  if (error) throw error;
  return data?.balance || 0;
};

export const updatePulseBalance = async (
  userId: string,
  amount: number
): Promise<Pulse> => {
  const { data, error } = await supabase
    .from('pulse')
    .upsert({ user_id: userId, balance: amount })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getProfileWithPulse = async (
  userId: string
): Promise<ProfileWithPulse> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*, pulse!inner(*)')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
};