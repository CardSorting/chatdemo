import { useQuery } from "@tanstack/react-query";
import { getBookmarkedCompanions } from "@services/companion/companionService";
import CompanionCard from "@components/landing/CompanionCard";
import { Bot, BookmarkIcon, Search, Compass } from "lucide-react";
import { Button } from "@components/ui/button";
import { useNavigate } from "react-router-dom";
import { Input } from "@components/ui/input";
import { useState, useEffect } from "react";
import { Skeleton } from "@components/ui/skeleton";
import CompanionFilterSidebar from "@components/explore/CompanionFilterSidebar";

const BookmarksPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState({});
  const { data: companions, isLoading } = useQuery({
    queryKey: ["bookmarked-companions"],
    queryFn: getBookmarkedCompanions
  });

  const filteredCompanions = companions?.filter(companion => {
    const categoryMatch = Object.keys(selectedCategories).every(categoryId => {
      if (!selectedCategories[categoryId]) return true;
      return companion.category === categoryId;
    });
    
    return (
      companion.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      categoryMatch
    );
  }) || [];

  const hasCompanions = filteredCompanions.length > 0;
  const recentCompanions = filteredCompanions.slice(0, 3);
  const otherCompanions = filteredCompanions.slice(3);

  useEffect(() => {
    if (companions) {
      const initialCategories = companions.reduce((acc, companion) => {
        acc[companion.category] = false;
        return acc;
      }, {});
      setSelectedCategories(initialCategories);
    }
  }, [companions]);

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white pt-20">
        <div className="bg-gradient-to-b from-green-500/10 to-transparent py-12 mb-8">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3 mb-4">
              <Skeleton className="w-8 h-8 rounded-full" />
              <Skeleton className="h-8 w-64" />
            </div>
            <Skeleton className="h-4 w-96" />
          </div>
        </div>
        <div className="container mx-auto px-4 space-y-12">
          <div className="space-y-4">
            <Skeleton className="h-6 w-48 mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-96 rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-green-500/10 to-transparent py-12 mb-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <BookmarkIcon className="w-8 h-8 text-green-400" />
            <h1 className="text-3xl font-bold text-white">Your Bookmarked Companions</h1>
          </div>
          <p className="text-gray-400 max-w-2xl">
            Access your favorite AI companions and continue your conversations right where you left off.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex gap-8">
          {/* Filter Sidebar */}
          <div className="w-72 shrink-0">
            <CompanionFilterSidebar />
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-12">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search bookmarked companions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-900 border-gray-800 focus:border-green-500 focus:ring-green-500"
              />
            </div>

            {hasCompanions ? (
              <>
                {/* Recent Bookmarks Section */}
                {recentCompanions.length > 0 && (
                  <section>
                    <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                      <Bot className="w-5 h-5 text-green-400" />
                      Recently Bookmarked
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {recentCompanions.map((companion) => (
                        <div key={companion.id} className="hover:scale-[1.02] transition-transform duration-200">
                          <CompanionCard companion={companion} />
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* All Bookmarks Section */}
                {otherCompanions.length > 0 && (
                  <section>
                    <h2 className="text-xl font-semibold text-white mb-6">All Bookmarked Companions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {otherCompanions.map((companion) => (
                        <div key={companion.id} className="hover:scale-[1.02] transition-transform duration-200">
                          <CompanionCard companion={companion} />
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 px-4">
                <div className="bg-green-500/5 rounded-full p-4 mb-4 animate-pulse">
                  <BookmarkIcon className="w-8 h-8 text-green-400" />
                </div>
                <h2 className="text-xl font-semibold text-white mb-2">No bookmarked companions yet</h2>
                <p className="text-gray-400 text-center mb-6 max-w-md">
                  Start exploring our collection of AI companions and bookmark your favorites to access them quickly.
                </p>
                <Button
                  onClick={() => navigate("/explore")}
                  className="bg-green-500 hover:bg-green-600 text-white transition-colors duration-200"
                >
                  <Compass className="w-4 h-4 mr-2" />
                  Explore Companions
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookmarksPage;