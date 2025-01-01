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
