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
  try {
    const { data, error } = await supabase
      .rpc('increment_likes', { p_companion_id: companionId });

    if (error) {
      console.error('Error liking companion:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Detailed error in likeCompanion:', {
      companionId,
      error
    });
    throw error;
  }
};

export const bookmarkCompanion = async (companionId: string) => {
  try {
    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser();

    if (userError) throw userError;
    if (!user) throw new Error('No user found');

    const { data, error } = await supabase
      .from('bookmarks')
      .upsert({
        user_id: user.id,
        companion_id: companionId,
        created_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,companion_id',
        ignoreDuplicates: true
      })
      .select()
      .single();

    if (error) {
      if (error.code !== '23505') {
        console.error('Error bookmarking companion:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        });
        throw error;
      }
    }

    return data;
  } catch (error) {
    console.error('Detailed error in bookmarkCompanion:', {
      companionId,
      error
    });
    throw error;
  }
};

export const getBookmarkedCompanions = async () => {
  try {
    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser();

    if (userError) throw userError;
    if (!user) throw new Error('No user found');

    const { data, error } = await supabase
      .from('bookmarks')
      .select('companion_id')
      .eq('user_id', user.id);

    if (error) throw error;

    const companionIds = data.map(b => b.companion_id);

    if (companionIds.length === 0) return [];

    const { data: companions, error: companionsError } = await supabase
      .from('companions')
      .select('*')
      .in('id', companionIds);

    if (companionsError) throw companionsError;

    return companions;
  } catch (error) {
    console.error('Error fetching bookmarked companions:', error);
    throw error;
  }
};