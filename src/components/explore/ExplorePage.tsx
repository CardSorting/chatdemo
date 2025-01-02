import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../landing/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { getCompanions } from "../../services/companion/companion";
import Gallery from "../landing/Gallery";
import CompanionFilterSidebar from "./CompanionFilterSidebar";
import { Card } from "../ui/card";
import LoadingSpinner from "../ui/loading-spinner";
import { Bot, Star, Compass } from "lucide-react";
import { Badge } from "../ui/badge";

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
    return activeFilters.length === 0 || activeFilters.includes(companion.category);
  }) || [];

  return (
    <div className="min-h-screen bg-black text-white pt-20">
      <div className="relative bg-gradient-to-b from-green-500/10 via-green-500/5 to-transparent py-16 mb-8 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-green-500/10 via-transparent to-transparent opacity-50 animate-pulse-slow" />
        <div className="container mx-auto px-4 relative">
          <div className="flex items-start gap-6 mb-8">
            <div className="bg-green-500/10 p-4 rounded-xl backdrop-blur-sm">
              <Compass className="w-8 h-8 text-green-400" />
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">
                Explore AI Companions
              </h1>
              <p className="text-gray-400 text-lg max-w-2xl leading-relaxed">
                Discover and interact with a wide variety of AI companions tailored to your interests and needs.
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
                  <Compass className="w-5 h-5 text-green-400" />
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
          <div className="flex-1">
            {/* Tabs */}
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-4">
              <Tabs
                defaultValue="popular"
                className="w-full"
                onValueChange={(value) => setActiveTab(value)}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-semibold text-white flex items-center gap-3">
                    <Star className="w-6 h-6 text-green-400" />
                    Explore Companions
                  </h2>
                  <Badge variant="secondary" className="bg-green-500/10 text-green-400">
                    {filteredCompanions.length} companions
                  </Badge>
                </div>
                
                <TabsList className="grid w-full grid-cols-3 gap-2 bg-gray-800/50 p-1 rounded-lg">
                  <TabsTrigger 
                    value="popular"
                    className="data-[state=active]:bg-green-500 data-[state=active]:text-white"
                  >
                    Popular
                  </TabsTrigger>
                  <TabsTrigger 
                    value="newest"
                    className="data-[state=active]:bg-green-500 data-[state=active]:text-white"
                  >
                    Newest
                  </TabsTrigger>
                  <TabsTrigger 
                    value="featured"
                    className="data-[state=active]:bg-green-500 data-[state=active]:text-white"
                  >
                    Featured
                  </TabsTrigger>
                </TabsList>

                {/* Tab Contents */}
                <TabsContent value="popular" className="mt-6">
                  {loading ? (
                    <div className="flex flex-col items-center justify-center p-8 space-y-4">
                      <LoadingSpinner className="w-12 h-12 text-green-400 animate-spin" />
                      <p className="text-gray-400">Loading companions...</p>
                    </div>
                  ) : filteredCompanions.length > 0 ? (
                    <Gallery fetchCompanions={async () => filteredCompanions} />
                  ) : (
                    <Card className="p-8 text-center bg-gray-900/50 backdrop-blur-sm">
                      <div className="max-w-md mx-auto">
                        <img 
                          src="/images/empty-state.svg" 
                          alt="No companions found"
                          className="w-48 h-48 mx-auto mb-4"
                        />
                        <h3 className="text-xl font-semibold mb-2 text-white">No companions found</h3>
                        <p className="text-gray-400 mb-4">
                          Try adjusting your filters or check back later for new companions.
                        </p>
                        <button
                          onClick={() => setActiveFilters([])}
                          className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                        >
                          Clear Filters
                        </button>
                      </div>
                    </Card>
                  )}
                </TabsContent>

                {/* Repeat similar structure for other tabs */}
              </Tabs>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ExplorePage;
