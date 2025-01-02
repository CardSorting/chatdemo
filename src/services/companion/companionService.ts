import { supabase } from "../../lib/supabase";

export const getAvailableFilters = async () => {
  const { data: categories, error: categoriesError } = await supabase
    .from('categories')
    .select('*');

  if (categoriesError) {
    console.error('Error fetching categories:', categoriesError);
    throw categoriesError;
  }

  return {
    categories
  };
};

export const getCompanionStats = async (companionId: string) => {
  const { data, error } = await supabase
    .from('companions')
    .select('likes_count, messages_count')
    .eq('id', companionId)
    .single();

  if (error) {
    console.error('Error fetching companion stats:', error);
    throw error;
  }

  return {
    likesCount: data.likes_count,
    messagesCount: data.messages_count
  };
};

export const likeCompanion = async (companionId: string) => {
  const { data, error } = await supabase
    .rpc('increment_likes', { companion_id: companionId });

  if (error) {
    console.error('Error liking companion:', error);
    throw error;
  }

  return data;
};