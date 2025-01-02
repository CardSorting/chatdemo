import { useInfiniteQuery } from "@tanstack/react-query";
import { getBookmarkedCompanions } from "@services/companion/companionService";
import CompanionCard from "@components/landing/CompanionCard";
import { Bot, BookmarkIcon, Compass, Star, SlidersHorizontal } from "lucide-react";
import { Button } from "@components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Skeleton } from "@components/ui/skeleton";
import CompanionFilterSidebar from "@components/explore/CompanionFilterSidebar";
import { ScrollArea } from "@components/ui/scroll-area";
import { Separator } from "@components/ui/separator";
import { Badge } from "@components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@components/ui/tabs";
import SearchBar from "./SearchBar";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import type { Companion } from "@lib/companions";

type SortOption = "recent" | "name";

interface BookmarksResponse {
  data: Companion[];
  hasMore: boolean;
}

const BookmarksPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("recent");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const { ref, inView } = useInView();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error
  } = useInfiniteQuery<BookmarksResponse>({
    queryKey: ["bookmarked-companions", searchQuery, activeFilters, sortBy],
    queryFn: ({ pageParam = 1 }) => 
      getBookmarkedCompanions({
        page: pageParam as number,
        pageSize: 10,
        search: searchQuery,
        filters: activeFilters,
        sort: sortBy
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.hasMore ? allPages.length + 1 : undefined;
    }
  });

  const companions = data?.pages.flatMap(page => page.data) || [];

  const sortedCompanions = [...companions].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      default:
        return new Date(b.bookmarkedAt!).getTime() - new Date(a.bookmarkedAt!).getTime();
    }
  });

  const handleFiltersChange = (filters: string[]) => {
    setActiveFilters(filters);
  };

  // Infinite scroll trigger
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white pt-20">
        <div className="relative bg-gradient-to-b from-green-500/10 via-green-500/5 to-transparent py-16 mb-8">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3 mb-4">
              <Skeleton className="w-10 h-10 rounded-full" />
              <Skeleton className="h-10 w-72" />
            </div>
            <Skeleton className="h-5 w-96 max-w-full" />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-8">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-24 rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-black text-white pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-red-400">
            Error loading bookmarks: {error.message}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-20">
      <div className="relative bg-gradient-to-b from-green-500/10 via-green-500/5 to-transparent py-16 mb-8 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-green-500/10 via-transparent to-transparent opacity-50 animate-pulse-slow" />
        <div className="container mx-auto px-4 relative">
          <div className="flex items-start gap-6 mb-8">
            <div className="bg-green-500/10 p-4 rounded-xl backdrop-blur-sm">
              <BookmarkIcon className="w-8 h-8 text-green-400" />
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">
                Your Bookmarked Companions
              </h1>
              <p className="text-gray-400 text-lg max-w-2xl leading-relaxed">
                Access your favorite AI companions and continue your conversations right where you left off.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-80 shrink-0">
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl overflow-hidden sticky top-24">
              <div className="p-6 border-b border-gray-800">
                <div className="flex items-center gap-2 mb-4">
                  <SlidersHorizontal className="w-5 h-5 text-green-400" />
                  <h3 className="text-lg font-semibold text-white">Filters</h3>
                </div>
                <CompanionFilterSidebar 
                  onFiltersChange={handleFiltersChange}
                  activeFilters={activeFilters}
                />
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-8">
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center justify-between gap-4">
                <SearchBar
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="Search bookmarked companions..."
                />
                <Tabs value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                  <TabsList className="bg-gray-800/50">
                    <TabsTrigger value="recent" className="data-[state=active]:bg-green-500">
                      Most Recent
                    </TabsTrigger>
                    <TabsTrigger value="name" className="data-[state=active]:bg-green-500">
                      Name
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>

            <ScrollArea className="h-[calc(100vh-320px)] pr-6">
              {sortedCompanions.length > 0 ? (
                <div className="space-y-12">
                  <section>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {sortedCompanions.map((companion, index) => (
                        <motion.div
                          key={companion.id}
                          initial={{ opacity: 0, y: 50 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          viewport={{ once: true }}
                        >
                          <div className="group relative">
                            <div className="absolute -inset-2 bg-gradient-to-r from-green-500/10 to-green-400/10 rounded-xl blur-xl group-hover:blur-2xl transition-all opacity-0 group-hover:opacity-100" />
                            <div className="relative transform hover:scale-[1.02] transition-all duration-300">
                              <CompanionCard companion={companion} />
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </section>

                  {hasNextPage && (
                    <div ref={ref} className="h-20">
                      {isFetchingNextPage && (
                        <div className="text-center text-gray-400">Loading more companions...</div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center py-24 px-4">
                  <p className="text-gray-400 text-center text-lg leading-relaxed">
                    No bookmarked companions found matching your filters.
                  </p>
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookmarksPage;