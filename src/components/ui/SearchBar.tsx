import { useState, useEffect, useRef, useCallback } from "react";
import { Search } from "lucide-react";
import { Input } from "./input";
import LoadingSpinner from "./loading-spinner";
import { useSearch } from "../../hooks/useSearch";
import { Tables } from "../../types/supabase";

interface SearchBarProps {
  onSelect: (companionId: string) => void;
}

const highlightText = (text: string, matches: { start: number; end: number }[]) => {
  if (!matches.length) return text;

  let highlightedText = [];
  let lastIndex = 0;

  matches.forEach((match) => {
    // Add text before the match
    highlightedText.push(text.slice(lastIndex, match.start));
    // Add highlighted match
    highlightedText.push(
      <span className="bg-green-500/20 text-green-400" key={match.start}>
        {text.slice(match.start, match.end)}
      </span>
    );
    lastIndex = match.end;
  });

  // Add remaining text after last match
  highlightedText.push(text.slice(lastIndex));

  return highlightedText;
};

export const SearchBar = ({ onSelect }: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { 
    data, 
    isLoading, 
    isError, 
    isFetching, 
    fetchNextPage, 
    hasNextPage 
  } = useSearch(query);
  
  const results = data?.pages.flatMap(page => page.data) || [];
  const totalResults = data?.pages[0]?.total || 0;
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleScroll = useCallback(() => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 50 && hasNextPage && !isFetching) {
        fetchNextPage();
      }
    }
  }, [hasNextPage, isFetching, fetchNextPage]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="relative" role="search">
      <div className="flex items-center">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-400" aria-hidden="true" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search companions..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 100)}
          className="pl-10 w-64 bg-gray-800/50 border-gray-700/50 focus:border-green-500 focus:ring-green-500 text-white"
          aria-label="Search companions"
        />
      </div>

      {isOpen && query.length > 2 && (
        <div 
          className="absolute mt-2 w-96 bg-gray-900/95 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden z-50"
          role="listbox"
          aria-labelledby="search-results"
        >
          <div 
            className="max-h-96 overflow-y-auto"
            ref={containerRef}
            onScroll={handleScroll}
          >
            {isLoading ? (
              <div className="p-4 flex items-center justify-center">
                <LoadingSpinner className="w-6 h-6 text-green-400" />
              </div>
            ) : isError ? (
              <div className="p-4 text-red-400 text-center">
                Failed to load search results
              </div>
            ) : results.length > 0 ? (
              results.map((companion, index) => {
                const highlights = data?.pages
                  .flatMap(page => page.highlightedResults)
                  .find(hr => hr.field === "name" && hr.matches.length > 0);

                return (
                  <div
                    key={companion.id}
                    role="option"
                    aria-selected="false"
                    className="p-3 hover:bg-gray-800/50 cursor-pointer transition-colors"
                    onClick={() => {
                      onSelect(companion.id);
                      setIsOpen(false);
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={companion.avatar_url}
                        alt={companion.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="text-white font-medium">
                          {highlights ? 
                            highlightText(companion.name, highlights.matches) :
                            companion.name
                          }
                        </h3>
                        <p className="text-sm text-white">
                          {companion.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-4 text-gray-400 text-center">
                No results found
              </div>
            )}
            {isFetching && hasNextPage && (
              <div className="p-4 flex items-center justify-center">
                <LoadingSpinner className="w-6 h-6 text-green-400" />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};