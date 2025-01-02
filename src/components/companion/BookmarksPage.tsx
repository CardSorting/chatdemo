import { useQuery } from "@tanstack/react-query";
import { getBookmarkedCompanions } from "@services/companion/companionService";
import CompanionCard from "@components/landing/CompanionCard";
import { Bot, BookmarkIcon, Search, Compass, Star, SlidersHorizontal } from "lucide-react";
import { Button } from "@components/ui/button";
import { useNavigate } from "react-router-dom";
import { Input } from "@components/ui/input";
import { useState } from "react";
import { Skeleton } from "@components/ui/skeleton";
import CompanionFilterSidebar from "@components/explore/CompanionFilterSidebar";
import { ScrollArea } from "@components/ui/scroll-area";
import { Separator } from "@components/ui/separator";
import { Badge } from "@components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@components/ui/tabs";

type SortOption = "recent" | "name";

const BookmarksPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("recent");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const { data: companions, isLoading } = useQuery({
    queryKey: ["bookmarked-companions"],
    queryFn: getBookmarkedCompanions
  });

  const filteredCompanions = companions?.filter(companion => 
    companion.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (activeFilters.length === 0 || activeFilters.includes(companion.category))
  ) || [];

    const sortedCompanions = [...filteredCompanions].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      default:
        return new Date(b.bookmarkedAt).getTime() - new Date(a.bookmarkedAt).getTime();
    }
  });

  const hasCompanions = sortedCompanions.length > 0;
  const recentCompanions = sortedCompanions.slice(0, 3);
  const otherCompanions = sortedCompanions.slice(3);

  const handleFiltersChange = (filters: string[]) => {
    setActiveFilters(filters);
  };

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
        {/* Rest of loading skeleton remains the same */}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-20">
      {/* Hero Section with Stats */}
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
          {/* Filter Sidebar */}
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

          {/* Main Content */}
          <div className="flex-1 space-y-8">
            {/* Controls Bar */}
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center justify-between gap-4">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-400" />
                  <Input
                    type="text"
                    placeholder="Search bookmarked companions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-gray-800/50 border-gray-700/50 focus:border-green-500 focus:ring-green-500"
                  />
                </div>

                {/* Sort Tabs */}
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
              {hasCompanions ? (
                <>
                  {/* Recent Bookmarks Section */}
                  {sortedCompanions.slice(0, 3).length > 0 && (
                    <section className="mb-12">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-semibold text-white flex items-center gap-3">
                          <Star className="w-6 h-6 text-green-400" />
                          Recently Bookmarked
                        </h2>
                        <Badge variant="secondary" className="bg-green-500/10 text-green-400">
                          {sortedCompanions.slice(0, 3).length} companions
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {sortedCompanions.slice(0, 3).map((companion) => (
                          <div 
                            key={companion.id} 
                            className="group relative"
                          >
                            <div className="absolute -inset-2 bg-gradient-to-r from-green-500/10 to-green-400/10 rounded-xl blur-xl group-hover:blur-2xl transition-all opacity-0 group-hover:opacity-100" />
                            <div className="relative transform hover:scale-[1.02] transition-all duration-300">
                              <CompanionCard companion={companion} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* All Bookmarks Section */}
                  {sortedCompanions.slice(3).length > 0 && (
                    <section>
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-semibold text-white flex items-center gap-3">
                          <Bot className="w-6 h-6 text-green-400" />
                          All Bookmarked Companions
                        </h2>
                        <Badge variant="secondary" className="bg-green-500/10 text-green-400">
                          {sortedCompanions.slice(3).length} companions
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {sortedCompanions.slice(3).map((companion) => (
                          <div 
                            key={companion.id} 
                            className="group relative"
                          >
                            <div className="absolute -inset-2 bg-gradient-to-r from-green-500/10 to-green-400/10 rounded-xl blur-xl group-hover:blur-2xl transition-all opacity-0 group-hover:opacity-100" />
                            <div className="relative transform hover:scale-[1.02] transition-all duration-300">
                              <CompanionCard companion={companion} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}
                </>
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