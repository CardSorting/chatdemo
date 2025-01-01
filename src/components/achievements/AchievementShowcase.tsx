import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import AchievementBadge from "@/components/ui/achievement-badge";
import { Achievement, getCategoryColor } from "@/lib/achievements";
import { Trophy, Star, MessageCircle, Crown } from "lucide-react";

interface AchievementShowcaseProps {
  achievements: Achievement[];
  stats: any;
}

const AchievementShowcase = ({
  achievements,
  stats,
}: AchievementShowcaseProps) => {
  const [selectedCategory, setSelectedCategory] =
    useState<Achievement["category"]>("creation");

  const categories: Achievement["category"][] = [
    "creation",
    "engagement",
    "interaction",
    "specialization",
  ];

  const getCategoryIcon = (category: Achievement["category"]) => {
    switch (category) {
      case "creation":
        return <Trophy className="w-4 h-4" />;
      case "engagement":
        return <Star className="w-4 h-4" />;
      case "interaction":
        return <MessageCircle className="w-4 h-4" />;
      case "specialization":
        return <Crown className="w-4 h-4" />;
    }
  };

  const filteredAchievements = achievements.filter(
    (achievement) => achievement.category === selectedCategory,
  );

  return (
    <Card className="p-6 bg-black/50 backdrop-blur-sm border-green-500/20">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Achievements</h2>
        <p className="text-gray-400">
          Track your progress and unlock new achievements
        </p>
      </div>

      <Tabs
        defaultValue={selectedCategory}
        onValueChange={(value) =>
          setSelectedCategory(value as Achievement["category"])
        }
      >
        <TabsList className="grid grid-cols-4 bg-black/50">
          {categories.map((category) => (
            <TabsTrigger
              key={category}
              value={category}
              className="group relative overflow-hidden"
            >
              <div className="flex items-center gap-2">
                {getCategoryIcon(category)}
                <span className="hidden md:inline">
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </span>
              </div>
              {/* Active indicator gradient line */}
              <div
                className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r ${getCategoryColor(category)} transform scale-x-0 group-data-[state=active]:scale-x-100 transition-transform duration-300`}
              />
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category} value={category} className="mt-6">
            <ScrollArea className="h-[400px] pr-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredAchievements.map((achievement) => (
                  <Card
                    key={achievement.achievement_id}
                    className="p-4 bg-black/30 border-green-500/10 hover:border-green-500/30 transition-colors duration-300"
                  >
                    <div className="flex items-start gap-4">
                      <AchievementBadge
                        achievement={achievement}
                        showDetails={false}
                        size="lg"
                      />
                      <div className="flex-1">
                        <h3
                          className={`text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r ${getCategoryColor(category)}`}
                        >
                          {achievement.name}
                        </h3>
                        <p className="text-sm text-gray-400 mb-2">
                          {achievement.description}
                        </p>
                        {stats && (
                          <div className="mt-2">
                            <div className="h-1 w-full bg-green-500/10 rounded-full overflow-hidden">
                              <div
                                className={`h-full bg-gradient-to-r ${getCategoryColor(category)} transition-all duration-1000`}
                                style={{
                                  width: `${Math.min(
                                    (stats[achievement.category] || 0) * 100,
                                    100,
                                  )}%`,
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        ))}
      </Tabs>
    </Card>
  );
};

export default AchievementShowcase;
