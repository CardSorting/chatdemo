import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AchievementBadge from "@/components/ui/achievement-badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trophy, Medal, Star, Crown, Bot, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

interface CreatorStats {
  creator_id: string;
  creator_name: string;
  avatar_url?: string;
  total_companions: number;
  total_likes: number;
  total_messages: number;
  categories: string[];
  top_category: string;
  achievements: Achievement[];
  rank: number;
}

const TopCreators = () => {
  const navigate = useNavigate();
  const [creators, setCreators] = useState<CreatorStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = [
    "all",
    "Entertainment",
    "Education",
    "Productivity",
    "Creativity",
    "Wellness",
    "Technology",
  ];

  useEffect(() => {
    loadCreators();
  }, [selectedCategory]);

  const loadCreators = async () => {
    try {
      const { data, error } = await supabase
        .rpc("get_top_creators", { category_filter: selectedCategory })
        .limit(10);

      if (error) throw error;
      setCreators(data);
    } catch (error) {
      console.error("Error loading creators:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-400" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-300" />;
      case 3:
        return <Star className="w-6 h-6 text-amber-600" />;
      default:
        return <Crown className="w-6 h-6 text-green-500 opacity-50" />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[400px]">
        <div className="animate-pulse text-green-500">Loading creators...</div>
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
            Top Creators
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Meet our most prolific AI companion creators
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex justify-center gap-2 mb-12 overflow-x-auto pb-4">
          {categories.map((category) => (
            <Button
              key={category}
              variant="outline"
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={`${selectedCategory === category ? "bg-green-500/20 border-green-500 text-green-500" : "border-green-500/20 text-gray-400 hover:text-green-500 hover:border-green-500"}`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Button>
          ))}
        </div>

        {/* Creators Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {creators.map((creator) => (
            <Card
              key={creator.creator_id}
              className="group relative bg-black/40 backdrop-blur-sm border-green-500/20 hover:border-green-500/40 transition-all duration-500 overflow-hidden transform hover:scale-[1.02] hover:-translate-y-1"
            >
              {/* Rank Badge */}
              <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm rounded-full p-2 border border-green-500/20">
                {getRankIcon(creator.rank)}
              </div>

              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 via-green-500/5 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="p-6 space-y-4 relative">
                <div className="flex items-center gap-4">
                  <img
                    src={
                      creator.avatar_url ||
                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${creator.creator_name}`
                    }
                    alt={creator.creator_name}
                    className="w-16 h-16 rounded-full border-2 border-green-500/50 group-hover:border-green-500 transition-colors duration-300"
                  />
                  <div>
                    <h3 className="text-xl font-semibold text-white group-hover:text-green-400 transition-colors duration-300">
                      {creator.creator_name}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {creator.total_companions} companions created
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Top Category</span>
                    <span className="text-green-400">
                      {creator.top_category}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Total Likes</span>
                    <span className="text-green-400">
                      {creator.total_likes.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Total Messages</span>
                    <span className="text-green-400">
                      {creator.total_messages.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Achievements */}
                <div className="flex flex-wrap gap-2 justify-center">
                  {creator.achievements?.map((achievement) => (
                    <AchievementBadge
                      key={achievement.achievement_id}
                      achievement={achievement}
                      size="sm"
                    />
                  ))}
                </div>

                <div className="pt-4 border-t border-green-500/20">
                  <ScrollArea className="h-[40px]">
                    <div className="flex gap-2">
                      {creator.categories.map((category) => (
                        <span
                          key={category}
                          className="px-2 py-1 text-xs rounded-full bg-green-500/10 border border-green-500/20 text-green-500"
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                  </ScrollArea>
                </div>

                <Button
                  onClick={() => navigate(`/creator/${creator.creator_id}`)}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 mt-4"
                >
                  <Bot className="w-4 h-4 mr-2" />
                  View Companions
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopCreators;
