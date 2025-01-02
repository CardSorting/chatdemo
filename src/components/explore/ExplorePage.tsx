import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../landing/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { getCompanions } from "../../services/companion/companion";
import CompanionCard from "../landing/CompanionCard";
import CompanionFilterSidebar from "./CompanionFilterSidebar";
import { Card } from "../ui/card";
import LoadingSpinner from "../ui/loading-spinner";

const ExplorePage = () => {
  const [companions, setCompanions] = useState([]);
  const [activeTab, setActiveTab] = useState("popular");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompanions = async () => {
      setLoading(true);
      try {
        const data = await getCompanions(activeTab);
        setCompanions(data);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanions();
  }, [activeTab]);

  const handleFiltersChange = (filters: string[]) => {
    setActiveFilters(filters);
  };

  const filteredCompanions = companions?.filter(companion => {
    return (activeFilters.length === 0 || activeFilters.includes(companion.category))
  }) || [];

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 pt-16">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[300px_1fr]">
            <CompanionFilterSidebar 
              onFiltersChange={handleFiltersChange}
              activeFilters={activeFilters}
            />

            <div>
              <Tabs
                defaultValue="popular"
                className="w-full"
                onValueChange={(value) => setActiveTab(value)}
              >
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">Explore Companions</h2>
                  <TabsList className="grid w-full grid-cols-3 gap-2 bg-gray-100 p-1 rounded-lg">
                    <TabsTrigger 
                      value="popular"
                      className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary data-[state=active]:font-semibold transition-colors duration-200"
                    >
                      Popular
                    </TabsTrigger>
                    <TabsTrigger 
                      value="newest"
                      className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary data-[state=active]:font-semibold transition-colors duration-200"
                    >
                      Newest
                    </TabsTrigger>
                    <TabsTrigger 
                      value="featured"
                      className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary data-[state=active]:font-semibold transition-colors duration-200"
                    >
                      Featured
                    </TabsTrigger>
                  </TabsList>
                </div>

                {/* Each Tab Content */}
                <TabsContent value="popular">
                  {loading ? (
                    <div className="flex flex-col items-center justify-center p-8 space-y-4">
                      <LoadingSpinner className="w-12 h-12 text-primary animate-spin" />
                      <p className="text-gray-600">Loading companions...</p>
                    </div>
                  ) : filteredCompanions.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {filteredCompanions.map((companion) => (
                        <div
                          key={companion.id}
                          className="cursor-pointer transform transition-transform duration-200 hover:scale-105"
                          onClick={() => navigate(`/companion/${companion.id}`)}
                        >
                          <CompanionCard companion={companion} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Card className="p-8 text-center">
                      <div className="max-w-md mx-auto">
                        <img 
                          src="/images/empty-state.svg" 
                          alt="No companions found"
                          className="w-48 h-48 mx-auto mb-4"
                        />
                        <h3 className="text-xl font-semibold mb-2">No companions found</h3>
                        <p className="text-gray-600 mb-4">
                          Try adjusting your filters or check back later for new companions.
                        </p>
                        <button
                          onClick={() => setActiveFilters([])}
                          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                        >
                          Clear Filters
                        </button>
                      </div>
                    </Card>
                  )}
                </TabsContent>
                <TabsContent value="newest">
                  {loading ? (
                    <div className="flex flex-col items-center justify-center p-8 space-y-4">
                      <LoadingSpinner className="w-12 h-12 text-primary animate-spin" />
                      <p className="text-gray-600">Loading companions...</p>
                    </div>
                  ) : filteredCompanions.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {filteredCompanions.map((companion) => (
                        <div
                          key={companion.id}
                          className="cursor-pointer transform transition-transform duration-200 hover:scale-105"
                          onClick={() => navigate(`/companion/${companion.id}`)}
                        >
                          <CompanionCard companion={companion} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Card className="p-8 text-center">
                      <div className="max-w-md mx-auto">
                        <img 
                          src="/images/empty-state.svg" 
                          alt="No companions found"
                          className="w-48 h-48 mx-auto mb-4"
                        />
                        <h3 className="text-xl font-semibold mb-2">No companions found</h3>
                        <p className="text-gray-600 mb-4">
                          Try adjusting your filters or check back later for new companions.
                        </p>
                        <button
                          onClick={() => setActiveFilters([])}
                          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                        >
                          Clear Filters
                        </button>
                      </div>
                    </Card>
                  )}
                </TabsContent>
                <TabsContent value="featured">
                  {loading ? (
                    <div className="flex flex-col items-center justify-center p-8 space-y-4">
                      <LoadingSpinner className="w-12 h-12 text-primary animate-spin" />
                      <p className="text-gray-600">Loading companions...</p>
                    </div>
                  ) : filteredCompanions.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {filteredCompanions.map((companion) => (
                        <div
                          key={companion.id}
                          className="cursor-pointer transform transition-transform duration-200 hover:scale-105"
                          onClick={() => navigate(`/companion/${companion.id}`)}
                        >
                          <CompanionCard companion={companion} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Card className="p-8 text-center">
                      <div className="max-w-md mx-auto">
                        <img 
                          src="/images/empty-state.svg" 
                          alt="No companions found"
                          className="w-48 h-48 mx-auto mb-4"
                        />
                        <h3 className="text-xl font-semibold mb-2">No companions found</h3>
                        <p className="text-gray-600 mb-4">
                          Try adjusting your filters or check back later for new companions.
                        </p>
                        <button
                          onClick={() => setActiveFilters([])}
                          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                        >
                          Clear Filters
                        </button>
                      </div>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ExplorePage;
