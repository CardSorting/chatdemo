import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../landing/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { getCompanions } from "../../services/companion/companion";
import CompanionCard from "../landing/CompanionCard";
import CompanionFilterSidebar from "./CompanionFilterSidebar";

const ExplorePage = () => {
  const [companions, setCompanions] = useState([]);
  const [activeTab, setActiveTab] = useState("popular");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompanions = async () => {
      const data = await getCompanions(activeTab);
      setCompanions(data);
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
      {/* If the header is fixed, add enough padding to the main area */}
      <main className="flex-1 pt-16">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[300px_1fr]">
            <CompanionFilterSidebar onFiltersChange={handleFiltersChange} />

            <div>
              <Tabs
                defaultValue="popular"
                className="w-full"
                onValueChange={(value) => setActiveTab(value)}
              >
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="popular">Popular</TabsTrigger>
                  <TabsTrigger value="newest">Newest</TabsTrigger>
                  <TabsTrigger value="featured">Featured</TabsTrigger>
                </TabsList>

                {/* Each Tab Content */}
                <TabsContent value="popular">
                  {filteredCompanions.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {filteredCompanions.map((companion) => (
                        <div
                          key={companion.id}
                          className="cursor-pointer"
                          onClick={() => navigate(`/companion/${companion.id}`)}
                        >
                          <CompanionCard companion={companion} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-gray-500">No companions found matching your filters.</div>
                  )}
                </TabsContent>
                {/* Other Tabs ... */}
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