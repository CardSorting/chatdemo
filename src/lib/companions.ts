import { supabase } from './supabase';

export interface Companion {
  id: string;
  name: string;
  description: string;
  avatar_url: string;
  creator_name: string;
  tags: string[];
  likes_count: number;
  messages_count: number;
  chat_url: string;
  created_at: string;
  updated_at: string;
}

export const fetchCompanions = async (page = 1, pageSize = 6) => {
  const { data, error } = await supabase
    .from('companions')
    .select('*')
    .order('created_at', { ascending: false })
    .range((page - 1) * pageSize, page * pageSize - 1);

  if (error) throw error;
  return data as Companion[];
};

export const fetchCompanionCount = async () => {
  const { count, error } = await supabase
    .from('companions')
    .select('*', { count: 'exact', head: true });

  if (error) throw error;
  return count || 0;
};

export const fetchLikedStatuses = async (companionIds: string[], userId: string) => {
  const { data, error } = await supabase
    .from('likes')
    .select('companion_id')
    .in('companion_id', companionIds)
    .eq('user_id', userId);

  if (error) throw error;
  
  const likedMap: Record<string, boolean> = {};
  data.forEach((like) => {
    likedMap[like.companion_id] = true;
  });
  return likedMap;
};

export const toggleCompanionLike = async (companionId: string, userId: string) => {
  // Check if already liked
  const { data: existingLike } = await supabase
    .from('likes')
    .select()
    .eq('companion_id', companionId)
    .eq('user_id', userId)
    .single();

  if (existingLike) {
    // Unlike
    const { error } = await supabase
      .from('likes')
      .delete()
      .eq('companion_id', companionId)
      .eq('user_id', userId);
    if (error) throw error;
    return false;
  } else {
    // Like
    const { error } = await supabase
      .from('likes')
      .insert({ companion_id: companionId, user_id: userId });
    if (error) throw error;
    return true;
  }
};

export const trackCompanionAction = async (companionId: string, action: 'chat' | 'view') => {
  const { error } = await supabase
    .from('companion_actions')
    .insert({ companion_id: companionId, action });
  if (error) throw error;
};

export const createCompanion = async (companion: {
  name: string;
  description: string;
  avatar_url: string;
  creator_name: string;
  tags: string[];
  chat_url: string;
}) => {
  const { data, error } = await supabase
    .from('companions')
    .insert(companion)
    .select()
    .single();

  if (error) throw error;
  return data as Companion;
};
