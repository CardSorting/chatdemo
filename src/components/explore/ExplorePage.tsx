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
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompanions = async () => {
      const data = await getCompanions(activeTab);
      setCompanions(data);
    };
    fetchCompanions();
  }, [activeTab]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* If the header is fixed, add enough padding to the main area */}
      <main className="flex-1 pt-16">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[300px_1fr]">
            <CompanionFilterSidebar />

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
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {companions.map((companion) => (
                      <div
                        key={companion.id}
                        className="cursor-pointer"
                        onClick={() => navigate(`/companion/${companion.id}`)}
                      >
                        <CompanionCard companion={companion} />
                      </div>
                    ))}
                  </div>
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