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
  created_at: string;
  updated_at: string;
}

export const createCompanion = async (
  companion: Omit<Companion, "id" | "created_at" | "updated_at">,
) => {
  const { data, error } = await supabase
    .from("companions")
    .insert(companion)
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

export const fetchCompanions = async () => {
  const { data, error } = await supabase
    .from("companions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};
