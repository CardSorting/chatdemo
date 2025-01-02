import { Tables } from "../../types/supabase";
import { supabase } from "../../lib/supabase";
import { SearchResponse } from "../../types/search";

export const getCompanions = async (
  query: string,
  page: number,
  pageSize = 10
): Promise<SearchResponse> => {
  const offset = (page - 1) * pageSize;
  
  const { data, count, error } = await supabase
    .from("companions")
    .select("*, profiles!inner(name)", { count: "exact" })
    .ilike("name", `%${query}%`)
    .range(offset, offset + pageSize - 1);

  if (error) throw error;

  return {
    data: data?.map(companion => ({
      ...companion,
      creator_name: companion.profiles.name,
      messages_count: companion.messages_count || 0
    })) || [],
    total: count || 0,
    page,
    hasMore: (count || 0) > offset + pageSize,
    query,
    timestamp: new Date().toISOString(),
  };
};

export const fetchCompanions = async (
  activeTab: string,
  page: number = 1,
  pageSize: number = 10
): Promise<Tables<"companions">[]> => {
  const offset = (page - 1) * pageSize;
  let query = supabase.from("companions")
    .select("*, profiles!inner(name)");

  if (activeTab === "newest") {
    query = query.order("created_at", { ascending: false });
  } else if (activeTab === "featured") {
    query = query.eq("is_featured", true);
  }
  
  const { data, error } = await query
    .range(offset, offset + pageSize - 1);

  if (error) throw error;

  return data?.map(companion => ({
    ...companion,
    creator_name: companion.profiles.name,
    messages_count: companion.messages_count || 0
  })) || [];
};

export const createCompanion = async (companion: Tables<"companions">): Promise<Tables<"companions"> | null> => {
  const { data, error } = await supabase
    .from("companions")
    .insert([companion])
    .select()
    .single();

  if (error) throw error;

  return data;
};

export const getAvailableFilters = async (): Promise<string[]> => {
    const { data, error } = await supabase
        .from('categories')
        .select('name');

    if (error) throw error;

    return data?.map(item => item.name) || [];
};

export const deleteCompanion = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from("companions")
    .delete()
    .eq("id", id);

  if (error) throw error;

  return true;
};

export const moderateCompanion = async (id: string, is_moderated: boolean): Promise<boolean> => {
    const { error } = await supabase
      .from("companions")
      .update({ is_moderated })
      .eq("id", id);
  
    if (error) throw error;
  
    return true;
  };

  export const updateCompanion = async (id: string, updates: Partial<Tables<"companions">>): Promise<boolean> => {
    const { error } = await supabase
      .from("companions")
      .update(updates)
      .eq("id", id);
  
    if (error) throw error;
  
    return true;
  };
