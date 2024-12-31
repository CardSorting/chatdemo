import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Heart,
  MessageCircle,
  Share2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Companion, fetchCompanions } from "@/lib/companions";

interface GalleryProps {
  itemsPerPage?: number;
}

const Gallery = ({ itemsPerPage = 3 }: GalleryProps) => {
  const [companions, setCompanions] = useState<Companion[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCompanions();
  }, []);

  const loadCompanions = async () => {
    try {
      const data = await fetchCompanions();
      setCompanions(data);
    } catch (error) {
      console.error("Error loading companions:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(companions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = companions.slice(startIndex, endIndex);

  const nextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const prevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleChat = (chatUrl: string) => {
    window.open(chatUrl, "_blank");
  };

  return (
    <section className="w-full bg-black py-16 px-4 md:px-8 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-matrix-grid bg-matrix-cell opacity-10" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-500/5 to-transparent" />

      <div className="max-w-7xl mx-auto relative">
        <div className="text-center mb-12 relative">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 animate-text-shimmer bg-clip-text text-transparent bg-[linear-gradient(to_right,#22c55e,#3b82f6,#22c55e)] bg-[length:200%_auto]">
            Popular Companions
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Explore our collection of unique AI companions created by the
            community.
            <br />
            Each one has their own personality, interests, and way of seeing the
            world.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentItems.map((companion) => (
            <Card
              key={companion.id}
              className={`group relative bg-black/40 backdrop-blur-sm border-green-500/20 hover:border-green-500/40 transition-all duration-500 overflow-hidden transform hover:scale-[1.02] ${hoveredCard === companion.id ? "ring-2 ring-green-500/50" : ""}`}
              onMouseEnter={() => setHoveredCard(companion.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 via-green-500/5 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="p-6 space-y-4 relative">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={companion.avatar_url}
                      alt={companion.name}
                      className="w-16 h-16 rounded-full border-2 border-green-500/50 group-hover:border-green-500 transition-colors duration-300"
                    />
                    <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white group-hover:text-green-400 transition-colors duration-300">
                      {companion.name}
                    </h3>
                    <p className="text-sm text-gray-400">
                      Created by {companion.creator_name}
                    </p>
                  </div>
                </div>

                <p className="text-gray-300 group-hover:text-gray-200 transition-colors duration-300">
                  {companion.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {companion.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-xs rounded-full bg-green-500/10 text-green-500 border border-green-500/20 group-hover:bg-green-500/20 group-hover:border-green-500/30 transition-all duration-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-green-500/20">
                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-green-500 gap-2 group/btn"
                    >
                      <Heart className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                      {companion.likes_count.toLocaleString()}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleChat(companion.chat_url)}
                      className="text-gray-400 hover:text-green-500 gap-2 group/btn"
                    >
                      <MessageCircle className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                      {companion.messages_count.toLocaleString()}
                    </Button>
                  </div>
                  <Button
                    onClick={() => handleChat(companion.chat_url)}
                    className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white gap-2 group/btn"
                    size="sm"
                  >
                    Chat
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Enhanced Pagination Controls */}
        <div className="flex justify-center items-center gap-6 mt-12">
          <Button
            variant="outline"
            size="lg"
            onClick={prevPage}
            disabled={currentPage === 1}
            className="border-green-500 text-green-500 hover:bg-green-500/10 disabled:opacity-50 transition-all duration-300 group"
          >
            <ChevronLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Previous
          </Button>

          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/50 border border-green-500/20">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${currentPage === i + 1 ? "bg-green-500 w-4" : "bg-green-500/20 hover:bg-green-500/40"}`}
              />
            ))}
          </div>

          <Button
            variant="outline"
            size="lg"
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className="border-green-500 text-green-500 hover:bg-green-500/10 disabled:opacity-50 transition-all duration-300 group"
          >
            Next
            <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Gallery;
