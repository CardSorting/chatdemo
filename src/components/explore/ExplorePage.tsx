import React from "react";
import Header from "../landing/Header";
import Gallery from "../landing/Gallery";
import Footer from "../landing/Footer";

const ExplorePage = () => {
  return (
    <div className="min-h-screen w-full bg-black overflow-x-hidden">
      {/* Matrix-style background overlay with animated rain effect */}
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjEiIGZpbGw9InJnYmEoMCwyNTUsMCwwLjEpIi8+PC9nPjwvc3ZnPg==')] opacity-20 pointer-events-none animate-matrix-rain" />

      {/* Animated grid overlay */}
      <div className="fixed inset-0 bg-[linear-gradient(transparent_1px,_#000_1px),linear-gradient(90deg,transparent_1px,_#000_1px)] bg-[size:30px_30px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-30 pointer-events-none" />

      {/* Header */}
      <Header />

      {/* Main content */}
      <main className="relative z-10 pt-16">
        <Gallery />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ExplorePage;
