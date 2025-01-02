import { Tables } from "./supabase";

export interface SearchResponse {
  data: Tables<"companions">[];
  total: number;
  page: number;
  hasMore: boolean;
}