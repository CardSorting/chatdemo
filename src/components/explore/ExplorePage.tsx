import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../landing/Footer";
import { fetchCompanions } from "../../services/companion/companion";
import Gallery from "../landing/Gallery";
import CompanionFilterSidebar from "./CompanionFilterSidebar";
import { Card } from "../ui/card";
import LoadingSpinner from "../ui/loading-spinner";
import { Bot, Star, Compass } from "lucide-react";
import { Badge } from "../ui/badge";

const ExplorePage = () => {
  const [companions, setCompanions] = useState([]);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchPaginatedCompanions = async (page: number) => {
    try {
      const data = await fetchCompanions("popular", page);
      return data;
    } catch (error) {
      console.error("Error fetching companions:", error);
      return [];
    }
  };

  useEffect(() => {
    const fetchInitialCompanions = async () => {
      setLoading(true);
      try {
        const data = await fetchPaginatedCompanions(1);
        setCompanions(data);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialCompanions();
  }, []);

  const handleFiltersChange = (filters: string[]) => {
    setActiveFilters(filters);
  };

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

          <div className="flex-1">
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-semibold text-white flex items-center gap-3">
                    <Star className="w-6 h-6 text-green-400" />
                    Explore Companions
                  </h2>
                  <Badge variant="secondary" className="bg-green-500/10 text-green-400">
                    {companions.length} companions
                  </Badge>
                </div>
                
                {loading ? (
                  <div className="flex flex-col items-center justify-center p-8 space-y-4">
                    <LoadingSpinner className="w-12 h-12 text-green-400 animate-spin" />
                    <p className="text-gray-400">Loading companions...</p>
                  </div>
                ) : (
                  <Gallery 
                    fetchCompanions={fetchPaginatedCompanions} 
                    activeFilters={activeFilters} 
                  />
                )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ExplorePage;
