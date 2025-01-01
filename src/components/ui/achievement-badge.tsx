import React from "react";
import { Card } from "@/components/ui/card";
import { Trophy, Star, Medal, Crown } from "lucide-react";
import { Achievement, getTierColor } from "@/lib/achievements";

interface AchievementBadgeProps {
  achievement: Achievement;
  size?: "sm" | "md" | "lg";
  showDetails?: boolean;
}

const AchievementBadge = ({
  achievement,
  size = "md",
  showDetails = true,
}: AchievementBadgeProps) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  return (
    <div className="group relative inline-block">
      <div
        className={`${sizeClasses[size]} relative rounded-full p-0.5 transition-all duration-300 ${achievement.just_earned ? "animate-pulse" : ""}`}
      >
        {/* Gradient border */}
        <div
          className={`absolute inset-0 rounded-full bg-gradient-to-r ${getTierColor(achievement.tier)}`}
        />

        {/* Inner content */}
        <div className="absolute inset-0.5 rounded-full bg-black flex items-center justify-center">
          <div
            className={`${iconSizes[size]} text-transparent bg-clip-text bg-gradient-to-r ${getTierColor(achievement.tier)}`}
          >
            {achievement.icon === "Trophy" && <Trophy />}
            {achievement.icon === "Star" && <Star />}
            {achievement.icon === "Medal" && <Medal />}
            {achievement.icon === "Crown" && <Crown />}
          </div>
        </div>
      </div>

      {/* Tooltip */}
      {showDetails && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <Card className="p-3 bg-black/90 backdrop-blur-sm border-green-500/20 text-center">
            <h4
              className={`text-sm font-semibold bg-clip-text text-transparent bg-gradient-to-r ${getTierColor(achievement.tier)}`}
            >
              {achievement.name}
            </h4>
            <p className="text-xs text-gray-400 mt-1">
              {achievement.description}
            </p>
            <div
              className={`text-xs mt-1 font-semibold bg-clip-text text-transparent bg-gradient-to-r ${getTierColor(achievement.tier)}`}
            >
              {achievement.tier.charAt(0).toUpperCase() +
                achievement.tier.slice(1)}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AchievementBadge;
