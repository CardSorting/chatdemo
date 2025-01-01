import React from "react";
import MainNav from "./layout/MainNav";
import HeroSection from "./landing/HeroSection";
import ValueProps from "./landing/ValueProps";
import TopCreators from "./landing/TopCreators";
import Footer from "./landing/Footer";
import ChatDemo from "./landing/ChatDemo";
import FeaturedCompanions from "./landing/FeaturedCompanions";

const Home = () => {
  return (
    <div className="min-h-screen w-full bg-black overflow-x-hidden">
      {/* Matrix-style background overlay with animated rain effect */}
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjEiIGZpbGw9InJnYmEoMCwyNTUsMCwwLjEpIi8+PC9nPjwvc3ZnPg==')] opacity-20 pointer-events-none animate-matrix-rain" />

      {/* Animated grid overlay */}
      <div className="fixed inset-0 bg-[linear-gradient(transparent_1px,_#000_1px),linear-gradient(90deg,transparent_1px,_#000_1px)] bg-[size:30px_30px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-30 pointer-events-none" />

      {/* Header */}
      <MainNav />

      {/* Main content */}
      <main className="relative z-10 pt-16">
        {/* Hero Section with Chat Demo */}
        <div className="relative min-h-screen">
          <div className="max-w-7xl mx-auto px-4 lg:px-8 flex flex-col lg:flex-row items-center gap-12 py-16">
            {/* Hero Content */}
            <div className="flex-1 text-center lg:text-left">
              <HeroSection
                title="Experience Next-Gen AI Companionship"
                subtitle="Step into a world where AI companions understand, learn, and grow with you. Create your perfect digital friend today."
              />
            </div>

            {/* Chat Demo */}
            <div className="flex-1 relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-green-500/20 to-blue-500/20 blur-3xl opacity-50 animate-pulse-slow" />
              <div className="relative transform hover:scale-[1.01] hover:rotate-1 transition-all duration-500">
                <ChatDemo />
              </div>
            </div>
          </div>
        </div>

        {/* Featured Companions Section */}
        <div className="relative z-20">
          <FeaturedCompanions />
        </div>

        {/* Value Props Section */}
        <div className="relative z-20">
          <ValueProps />
        </div>

        {/* Top Creators Section */}
        <div className="relative z-20">
          <TopCreators />
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Enhanced decorative elements */}
      <div className="fixed top-0 left-0 w-1/2 h-screen bg-gradient-to-r from-green-500/5 via-green-500/2 to-transparent pointer-events-none animate-pulse-slow" />
      <div className="fixed top-0 right-0 w-1/2 h-screen bg-gradient-to-l from-blue-500/5 via-blue-500/2 to-transparent pointer-events-none animate-pulse-slow" />

      {/* Glowing orbs */}
      <div className="fixed top-1/4 left-1/4 w-32 h-32 rounded-full bg-green-500/10 blur-3xl animate-float-slow pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/4 w-32 h-32 rounded-full bg-blue-500/10 blur-3xl animate-float-slow-reverse pointer-events-none" />
    </div>
  );
};

export default Home;
