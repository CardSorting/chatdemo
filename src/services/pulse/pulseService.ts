import { supabase } from '../../lib/supabase';
import { ProfileWithPulse } from '../../types/profile';
import { Database } from '../../types/supabase';

export const getPulseBalance = async (userId: string): Promise<number> => {

  if (!userId || typeof userId !== 'string') {
    throw new Error('Invalid user ID');
  }

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('pulse_balance')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return (data?.pulse_balance as number) || 0;
  } catch (error) {
    console.error('Error fetching Pulse balance:', error);
    return 0;
  }
};

export const updatePulseBalance = async (
  userId: string,
  amount: number
): Promise<number> => {

  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({ pulse_balance: amount })
      .eq('id', userId)
      .select('pulse_balance')
      .single();

    if (error) throw error;
    return data.pulse_balance;
  } catch (error) {
    console.error('Error updating Pulse balance:', error);
    throw error;
  }
};

export const sendTip = async (
  senderId: string,
  recipientId: string,
  amount: number
): Promise<{ success: boolean; message: string }> => {

  if (amount <= 0) {
    return { success: false, message: 'Tip amount must be positive' };
  }

  try {
    // Get sender's balance
    const senderBalance = await getPulseBalance(senderId);
    if (senderBalance < amount) {
      return { success: false, message: 'Insufficient Pulse balance' };
    }

    // Get recipient's balance
    const recipientBalance = await getPulseBalance(recipientId);

    // Update balances
    await updatePulseBalance(senderId, senderBalance - amount);
    await updatePulseBalance(recipientId, recipientBalance + amount);
    
    return { 
      success: true, 
      message: `Successfully sent ${amount} Pulse to ${recipientId}` 
    };
  } catch (error) {
    console.error('Error sending tip:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Failed to send tip' 
    };
  }
};

export const getProfileWithPulse = async (
  userId: string
): Promise<ProfileWithPulse> => {

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return {
      id: data.id,
      full_name: data.full_name,
      username: data.username,
      bio: data.bio,
      website: data.website,
      avatar_url: data.avatar_url,
      email: data.email,
      role: data.role,
      email_notifications: data.email_notifications,
      visibility: data.visibility,
      theme: data.theme,
      created_at: data.created_at,
      updated_at: data.updated_at,
      pulse_balance: data.pulse_balance
    } as ProfileWithPulse;
  } catch (error) {
    console.error('Error fetching profile with Pulse:', error);
    throw error;
  }
};
