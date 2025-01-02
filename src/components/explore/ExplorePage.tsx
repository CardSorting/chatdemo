import React from "react";
import MainNav from "../layout/MainNav";
import CompanionFilterSidebar from "./CompanionFilterSidebar";
import Gallery from "../landing/Gallery";
import Footer from "../landing/Footer";

const ExplorePage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-black overflow-x-hidden">
      {/* Matrix-style background overlay with animated rain effect */}
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjEiIGZpbGw9InJnYmEoMCwyNTUsMCwwLjEpIi8+PC9nPjwvc3ZnPg==')] opacity-20 pointer-events-none animate-matrix-rain" />

      {/* Animated grid overlay */}
      <div className="fixed inset-0 bg-[linear-gradient(transparent_1px,_#000_1px),linear-gradient(90deg,transparent_1px,_#000_1px)] bg-[size:30px_30px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-30 pointer-events-none" />

      {/* Header */}
      <MainNav />

      {/* Main content area: let this fill the vertical space */}
      <div className="grid grid-cols-[256px_1fr] flex-1 pt-16 pb-8">
        {/* Companion Filter Sidebar: wrap in a relative/sticky parent */}
        <div className="border-r border-green-500/10 relative">
          <div className="sticky top-16 h-full overflow-y-auto">
            <CompanionFilterSidebar />
          </div>
        </div>

        {/* Gallery */}
        <main className="overflow-y-auto">
          <Gallery />
        </main>
      </div>

      {/* Footer at the bottom */}
      <Footer />
    </div>
  );
};

export default ExplorePage;
