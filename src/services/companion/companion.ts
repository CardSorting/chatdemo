import { supabase } from '../../lib/supabase';
import { Database } from '../../types/supabase';

// We assume the "companions" table exists with these columns
export type Companion = Database['public']['Tables']['companions']['Row'] & {
  creator_name: string;
  likes_count: number;
  messages_count: number;
  chat_url: string;
  status?: 'active' | 'pending' | 'suspended';
};

/**
 * Fetch a paginated list of companions,
 * ordered by created_at descending.
 */
export const fetchCompanions = async (page = 1, pageSize = 6) => {
  const { data, error } = await supabase
    .from('companions')
    .select('*')
    .order('created_at', { ascending: false })
    .range((page - 1) * pageSize, page * pageSize - 1);

  if (error) throw error;
  return data as Companion[];
};

/**
 * Fetch all companions sorted by "sortBy" param:
 * - "trending": by messages_count
 * - "newest": by created_at
 * - "most-liked": by likes_count
 */
export const getCompanions = async (sortBy: string) => {
  let query = supabase
    .from('companions')
    .select('*');

  switch (sortBy) {
    case 'trending':
      query = query.order('messages_count', { ascending: false });
      break;
    case 'newest':
      query = query.order('created_at', { ascending: false });
      break;
    case 'most-liked':
      query = query.order('likes_count', { ascending: false });
      break;
    default:
      query = query.order('created_at', { ascending: false });
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as Companion[];
};

/**
 * Fetch the total count of companions (for pagination, etc.).
 */
export const getAvailableFilters = async () => {
    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true });

    if (error) throw error;
    return data;
};

export const fetchCompanionCount = async () => {
  const { count, error } = await supabase
    .from('companions')
    .select('*', { count: 'exact', head: true });

  if (error) throw error;
  return count || 0;
};

/**
 * Increment the likes_count column for a given companion.
 * (Direct Update Version)
 */
// export const incrementLikes = async (companionId: string) => {
//   const { data, error } = await supabase
//     .from('companions')
//     .update({ likes_count: supabase.raw('likes_count + 1') })
//     .eq('id', companionId)
//     .select()
//     .single();
// 
//   if (error) throw error;
//   return data as Companion;
// };

/**
 * OR (RPC Version)
 * 
 * If you've created a Postgres function increment_likes(p_companion_id uuid):
 *
 * CREATE OR REPLACE FUNCTION public.increment_likes(
 *   p_companion_id uuid
 * )
 * RETURNS void
 * LANGUAGE plpgsql
 * AS $$
 * BEGIN
 *   UPDATE companions
 *      SET likes_count = likes_count + 1
 *    WHERE id = p_companion_id;
 * END;
 * $$;
 */
export const incrementLikes = async (companionId: string) => {
  const { data, error } = await supabase
    .rpc('increment_likes', { p_companion_id: companionId });

  if (error) throw error;
  return data;
};

/**
 * Track actions like "chat" or "view" if desired.
 * (Assumes a companion_actions table)
 */
export const trackCompanionAction = async (companionId: string, action: 'chat' | 'view') => {
  const { error } = await supabase
    .from('companion_actions')
    .insert({ companion_id: companionId, action });
  if (error) throw error;
};

/**
 * Create a new companion row.
 */
export const createCompanion = async (companion: {
  name: string;
  description: string;
  avatar_url: string;
  creator_name: string;
  chat_url: string;
  categories: string[];
}) => {
  const { data, error } = await supabase
    .from('companions')
    .insert(companion)
    .select()
    .single();

  if (error) throw error;
  return data as Companion;
};

/**
 * Delete an existing companion row.
 */
export const deleteCompanion = async (companionId: string) => {
  const { error } = await supabase
    .from('companions')
    .delete()
    .eq('id', companionId);

  if (error) throw error;
  return true;
};

/**
 * Update the "status" field of a companion (moderation).
 */
export const moderateCompanion = async (companionId: string, status: 'active' | 'pending' | 'suspended') => {
  const { data, error } = await supabase
    .from('companions')
    .update({ status })
    .eq('id', companionId)
    .select()
    .single();

  if (error) throw error;
  return data as Companion;
};

/**
 * General-purpose companion update (partial fields).
 */
export const updateCompanion = async (companionId: string, updates: Partial<Companion>) => {
  const { data, error } = await supabase
    .from('companions')
    .update(updates)
    .eq('id', companionId)
    .select()
    .single();

  if (error) throw error;
  return data as Companion;
};
