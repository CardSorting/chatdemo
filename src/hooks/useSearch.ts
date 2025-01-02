import { useInfiniteQuery } from "@tanstack/react-query";
import { getCompanions } from "../services/companion/companion";
import { useDebounce } from "./useDebounce";
import { SearchResponse } from "../types/search";

export const useSearch = (query: string) => {
  const debouncedQuery = useDebounce(query, 300);

  return useInfiniteQuery<SearchResponse, Error>({
    queryKey: ["search-companions", debouncedQuery],
    queryFn: ({ pageParam = 1 }) => {
      const page = typeof pageParam === 'number' ? pageParam : 1;
      return getCompanions(debouncedQuery, page);
    },
    initialPageParam: 1,
    enabled: debouncedQuery.length > 2,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.page + 1 : undefined;
    },
    retry: (failureCount, error) => {
      if (error.message.includes("404")) return false;
      return failureCount < 3;
    },
  });
};