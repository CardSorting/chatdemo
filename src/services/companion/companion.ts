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
    .select("*", { count: "exact" })
    .ilike("name", `%${query}%`)
    .range(offset, offset + pageSize - 1);

  if (error) throw error;

  return {
    data: data || [],
    total: count || 0,
    page,
    hasMore: (count || 0) > offset + pageSize,
    query,
    timestamp: new Date().toISOString(),
  };
};
