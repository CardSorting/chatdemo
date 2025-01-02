import React, { useState, useEffect } from "react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Heart, MessageCircle, Sparkles } from "lucide-react";
import { Companion, fetchCompanions } from "../../services/companion/companion";

const FeaturedCompanions = () => {
  const navigate = useNavigate();
  const [companions, setCompanions] = useState<Companion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCompanions = async () => {
      try {
        const data = await fetchCompanions();
        // Randomly select 3 companions
        const shuffled = [...data].sort(() => 0.5 - Math.random());
        setCompanions(shuffled.slice(0, 3));
      } catch (error) {
        console.error("Error loading companions:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCompanions();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[400px]">
        <div className="animate-pulse text-green-500">
          Loading companions...
        </div>
      </div>
    );
  }

  return (
    <section className="w-full bg-black py-24 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-matrix-grid bg-matrix-cell opacity-5" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-500/5 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 animate-text-shimmer bg-clip-text text-transparent bg-[linear-gradient(to_right,#22c55e,#3b82f6,#22c55e)] bg-[length:200%_auto]">
            Featured Companions
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Meet some of our most engaging AI companions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {companions.map((companion) => (
            <Card
              key={companion.id}
              className="group relative bg-black/40 backdrop-blur-sm border-green-500/20 hover:border-green-500/40 transition-all duration-500 overflow-hidden transform hover:scale-[1.02] hover:-translate-y-1"
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

                <div className="flex items-center justify-between pt-4 border-t border-green-500/20">
                  <div className="flex items-center gap-4">
                    <span className="text-gray-400 flex items-center gap-2">
                      <Heart className="w-4 h-4" />
                      {companion.likes_count}
                    </span>
                    <span className="text-gray-400 flex items-center gap-2">
                      <MessageCircle className="w-4 h-4" />
                      {companion.messages_count}
                    </span>
                  </div>
                  <Button
                    onClick={() => navigate(`/chat/${companion.id}`)}
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

        <div className="flex justify-center">
          <Button
            onClick={() => navigate("/explore")}
            className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-8 py-6 text-lg"
            size="lg"
          >
            Explore All Companions
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCompanions;
