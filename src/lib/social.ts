import { supabase } from "./supabase";

export interface SocialStats {
  followers_count: number;
  following_count: number;
  total_likes: number;
}

export const getUserSocialStats = async (
  userId: string,
): Promise<SocialStats> => {
  const { data, error } = await supabase.rpc("get_user_social_stats", {
    user_id: userId,
  });

  if (error) throw error;
  return data;
};

export const followUser = async (userId: string) => {
  const { error } = await supabase.from("followers").insert({
    follower_id: (await supabase.auth.getUser()).data.user?.id,
    following_id: userId,
  });

  if (error) throw error;
};

export const unfollowUser = async (userId: string) => {
  const { error } = await supabase
    .from("followers")
    .delete()
    .match({
      follower_id: (await supabase.auth.getUser()).data.user?.id,
      following_id: userId,
    });

  if (error) throw error;
};

export const isFollowing = async (userId: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from("followers")
    .select("*")
    .match({
      follower_id: (await supabase.auth.getUser()).data.user?.id,
      following_id: userId,
    })
    .single();

  if (error && error.code !== "PGRST116") throw error;
  return !!data;
};
