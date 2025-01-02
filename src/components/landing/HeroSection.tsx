import React from "react";
import { Button } from "../ui/button";
import { ArrowRight, Sparkles, Terminal, Zap } from "lucide-react";

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  onCtaClick?: () => void;
}

const HeroSection = ({
  title = "Welcome to Matrix Mingle AI",
  subtitle = "Your personal AI companion in the digital realm. Experience natural conversations, deep learning, and personalized interactions like never before.",
  ctaText = "Get Started",
  onCtaClick = () => console.log("CTA clicked"),
}: HeroSectionProps) => {
  return (
    <section className="relative min-h-screen w-full bg-black flex items-center px-4 md:px-8 lg:px-16 py-24 overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,0,0.1)_0%,transparent_100%)] animate-pulse-slow" />
      <div className="absolute inset-0 bg-matrix-grid bg-matrix-cell opacity-5" />

      <div className="max-w-7xl mx-auto w-full text-center space-y-8 relative">
        {/* Floating Elements */}
        <Terminal className="absolute -top-10 left-1/4 w-8 h-8 text-green-500 animate-float-slow opacity-50" />
        <Zap className="absolute top-20 right-1/4 w-6 h-6 text-blue-500 animate-float-slow-reverse opacity-50" />
        <Sparkles className="absolute bottom-20 left-1/3 w-5 h-5 text-purple-500 animate-float-slow opacity-50" />

        {/* Main Content */}
        <div className="relative space-y-6">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold animate-text-shimmer bg-clip-text text-transparent bg-[linear-gradient(to_right,#22c55e,#3b82f6,#22c55e)] bg-[length:200%_auto] leading-tight relative inline-block">
            {title}
            <div className="absolute -top-6 -right-6 transform rotate-12">
              <Sparkles className="w-8 h-8 text-green-500 animate-pulse-slow" />
            </div>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center pt-8">
          <Button
            size="lg"
            onClick={onCtaClick}
            className="relative group bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-black font-semibold px-8 py-6 text-lg transform transition-all duration-300 hover:scale-105 hover:rotate-1"
          >
            <span className="relative z-10 flex items-center gap-2">
              {ctaText}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="border-2 border-green-500 text-green-500 hover:bg-green-500/10 px-8 py-6 text-lg transform transition-all duration-300 hover:scale-105 hover:-rotate-1"
          >
            Learn More
          </Button>
        </div>

        {/* Social Proof */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mt-12">
          <div className="flex -space-x-4 animate-float-slow">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="relative group">
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=user${i}`}
                  alt={`User ${i}`}
                  className="w-10 h-10 rounded-full border-2 border-green-500 transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12"
                />
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-500 to-blue-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
              </div>
            ))}
          </div>
          <p className="text-gray-400 flex items-center gap-2">
            <span className="text-green-500 font-bold animate-pulse-slow">
              1,000+
            </span>
            companions created
          </p>
        </div>

        {/* Enhanced Background Elements */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-float-slow-reverse" />
      </div>
    </section>
  );
};

export default HeroSection;
