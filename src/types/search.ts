import { Tables } from "./supabase";

export interface SearchResponse {
  data: Tables<"companions">[];
  total: number;
  page: number;
  hasMore: boolean;
  query: string;
  timestamp: string;
  highlightedResults?: HighlightedResult[];
}

export interface HighlightedResult {
  field: string;
  matches: {
    start: number;
    end: number;
    text: string;
  }[];
}

export interface SearchError {
  message: string;
  code: number;
  retryable: boolean;
}

export interface SearchState {
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  error?: SearchError;
  isSuccess: boolean;
  isIdle: boolean;
}

export interface SearchParams {
  query: string;
  page: number;
  pageSize?: number;
  fields?: string[];
  highlight?: boolean;
}