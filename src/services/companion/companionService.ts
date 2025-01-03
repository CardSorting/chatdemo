import { supabase } from "../../lib/supabase";

export const getCompanionById = async (companionId: string) => {
  const { data, error } = await supabase
    .from('companions')
    .select('*')
    .eq('id', companionId)
    .single();

  if (error) {
    console.error('Error fetching companion:', error);
    throw error;
  }

  return data;
};

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

export const getCompanionsByUser = async (userId: string) => {
  const { data, error } = await supabase
    .from('companions')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching user companions:', error);
    throw error;
  }

  return data;
};

export const getBookmarkedCompanions = async ({
  page = 1,
  pageSize = 10,
  search = "",
  filters = [],
  sort = "recent"
}) => {
  try {
    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser();

    if (userError) throw userError;
    if (!user) throw new Error('No user found');

    const offset = (page - 1) * pageSize;

    // Get total count of bookmarks
    const { count: totalCount } = await supabase
      .from('bookmarks')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    // Get bookmarked companion IDs
    let query = supabase
      .from('bookmarks')
      .select('companion_id, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: sort === 'recent' ? false : true })
      .range(offset, offset + pageSize - 1);

    const { data: bookmarks, error: bookmarksError } = await query;

    if (bookmarksError) throw bookmarksError;

    const companionIds = bookmarks.map(b => b.companion_id);

    if (companionIds.length === 0) {
      return {
        data: [],
        hasMore: false
      };
    }

    // Get companion details
    let companionsQuery = supabase
      .from('companions')
      .select('*')
      .in('id', companionIds);

    if (search) {
      companionsQuery = companionsQuery.ilike('name', `%${search}%`);
    }

    if (filters.length > 0) {
      companionsQuery = companionsQuery.in('category', filters);
    }

    const { data: companions, error: companionsError } = await companionsQuery;

    if (companionsError) throw companionsError;

    return {
      data: companions.map(companion => ({
        ...companion,
        bookmarkedAt: bookmarks.find(b => b.companion_id === companion.id)?.created_at
      })),
      hasMore: totalCount ? offset + pageSize < totalCount : false
    };
  } catch (error) {
    console.error('Error fetching bookmarked companions:', error);
    throw error;
  }
};
