import { useInfiniteQuery } from "@tanstack/react-query";
import { getCompanions } from "../services/companion/companion";
import { useDebounce } from "./useDebounce";
import { SearchResponse, SearchError, SearchState } from "../types/search";

export const useSearch = (query: string) => {
  const debouncedQuery = useDebounce(query, 300);

  return useInfiniteQuery<SearchResponse, SearchError>({
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
      if (error.code === 404) return false;
      return failureCount < 3;
    },
    select: (data) => ({
      ...data,
      pages: data.pages.map(page => ({
        ...page,
        highlightedResults: highlightMatches(page.data, debouncedQuery)
      }))
    })
  });
};

const highlightMatches = (data: any[], query: string) => {
  if (!query) return [];
  
  return data.map(item => ({
    field: "name",
    matches: findMatches(item.name, query)
  }));
};

const findMatches = (text: string, query: string) => {
  const matches = [];
  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  
  let index = lowerText.indexOf(lowerQuery);
  while (index !== -1) {
    matches.push({
      start: index,
      end: index + query.length,
      text: text.slice(index, index + query.length)
    });
    index = lowerText.indexOf(lowerQuery, index + query.length);
  }
  
  return matches;
};