import { supabase } from "./supabase";

export interface Companion {
  id: string;
  name: string;
  description: string;
  avatar_url: string;
  creator_id: string;
  creator_name: string;
  likes_count: number;
  messages_count: number;
  tags: string[];
  chat_url: string;
  created_at: string;
  updated_at: string;
  status: "pending" | "approved" | "rejected";
  moderation_feedback?: string;
  moderated_at?: string;
  moderated_by?: string;
}

export interface CompanionAnalytics {
  id: string;
  name: string;
  creator_id: string;
  unique_likes: number;
  unique_chatters: number;
  unique_viewers: number;
  total_messages: number;
  total_views: number;
}

export const createCompanion = async (
  companion: Omit<
    Companion,
    | "id"
    | "created_at"
    | "updated_at"
    | "status"
    | "moderation_feedback"
    | "moderated_at"
    | "moderated_by"
  >,
) => {
  const { data, error } = await supabase
    .from("companions")
    .insert({ ...companion, status: "pending" })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateCompanion = async (
  id: string,
  updates: Partial<Companion>,
) => {
  const { data, error } = await supabase
    .from("companions")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteCompanion = async (id: string) => {
  const { error } = await supabase.from("companions").delete().eq("id", id);

  if (error) throw error;
};

export const fetchCompanions = async (options?: { includeAll?: boolean }) => {
  let query = supabase.from("companions").select("*");

  if (!options?.includeAll) {
    query = query.eq("status", "approved");
  }

  const { data, error } = await query.order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

export const moderateCompanion = async (
  id: string,
  status: "approved" | "rejected",
  feedback?: string,
  moderatorId?: string,
) => {
  const updates: Partial<Companion> = {
    status,
    moderation_feedback: feedback,
    moderated_at: new Date().toISOString(),
    moderated_by: moderatorId,
  };

  return updateCompanion(id, updates);
};

// Stats tracking functions
export const trackCompanionAction = async (
  companionId: string,
  actionType: "like" | "chat" | "view",
) => {
  const { error } = await supabase.from("companion_stats").insert({
    companion_id: companionId,
    action_type: actionType,
  });

  if (error) throw error;
};

export const isCompanionLiked = async (companionId: string) => {
  const { data, error } = await supabase
    .from("companion_stats")
    .select("id")
    .eq("companion_id", companionId)
    .eq("action_type", "like")
    .eq("user_id", supabase.auth.getUser())
    .single();

  if (error && error.code !== "PGRST116") throw error;
  return !!data;
};

export const toggleCompanionLike = async (companionId: string) => {
  const isLiked = await isCompanionLiked(companionId);

  if (isLiked) {
    const { error } = await supabase
      .from("companion_stats")
      .delete()
      .eq("companion_id", companionId)
      .eq("action_type", "like")
      .eq("user_id", supabase.auth.getUser());

    if (error) throw error;
  } else {
    await trackCompanionAction(companionId, "like");
  }

  return !isLiked;
};

export const fetchCompanionAnalytics = async (companionId: string) => {
  const { data, error } = await supabase
    .from("companion_analytics")
    .select("*")
    .eq("id", companionId)
    .single();

  if (error) throw error;
  return data as CompanionAnalytics;
};
