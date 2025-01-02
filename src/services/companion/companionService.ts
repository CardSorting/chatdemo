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
    // Get the current user
    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser();

    if (userError) throw userError;
    if (!user) throw new Error('No user found');

    // Try to create the bookmark
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
      // If the error is not a duplicate entry error
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