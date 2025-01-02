import React, { useState } from "react";
import MainNav from "../layout/MainNav";
import CompanionFilterSidebar from "./CompanionFilterSidebar";
import Gallery from "../landing/Gallery";
import Footer from "../landing/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { getCompanions } from "../../lib/companions";

const ExplorePage = () => {
  const [activeTab, setActiveTab] = useState("trending");

  const fetchCompanions = async (sortBy: string) => {
    try {
      const companions = await getCompanions(sortBy);
      return companions;
    } catch (error) {
      console.error("Error fetching companions:", error);
      return [];
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-black overflow-x-hidden">
      {/* Matrix-style background overlay with animated rain effect */}
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjEiIGZpbGw9InJnYmEoMCwyNTUsMCwwLjEpIi8+PC9nPjwvc3ZnPg==')] opacity-20 pointer-events-none animate-matrix-rain" />

      {/* Animated grid overlay */}
      <div className="fixed inset-0 bg-[linear-gradient(transparent_1px,_#000_1px),linear-gradient(90deg,transparent_1px,_#000_1px)] bg-[size:30px_30px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-30 pointer-events-none" />

      {/* Header */}
      <MainNav />

      {/* Main content area */}
      <div className="flex flex-1 pt-16 min-h-[calc(100vh-4rem)] pb-8">
        {/* Companion Filter Sidebar */}
        <div className="w-64 shrink-0">
          <CompanionFilterSidebar />
        </div>

        {/* Gallery content */}
        <main className="flex-1 px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 bg-black/50 border border-green-500/20 mb-4">
              <TabsTrigger value="trending" className="data-[state=active]:bg-green-500/10">
                Trending
              </TabsTrigger>
              <TabsTrigger value="newest" className="data-[state=active]:bg-green-500/10">
                Newest
              </TabsTrigger>
              <TabsTrigger value="most-liked" className="data-[state=active]:bg-green-500/10">
                Most Liked
              </TabsTrigger>
            </TabsList>

            <TabsContent value="trending">
              <Gallery fetchCompanions={() => fetchCompanions("trending")} />
            </TabsContent>
            <TabsContent value="newest">
              <Gallery fetchCompanions={() => fetchCompanions("newest")} />
            </TabsContent>
            <TabsContent value="most-liked">
              <Gallery fetchCompanions={() => fetchCompanions("most-liked")} />
            </TabsContent>
          </Tabs>
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ExplorePage;
