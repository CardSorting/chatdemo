import React from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Trophy,
  Star,
  Medal,
  Crown,
  Bot,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import {
  Achievement,
  getTierColor,
  getCategoryColor,
  getProgressToNextTier,
} from "@/lib/achievements";

interface AchievementBadgeProps {
  achievement: Achievement;
  size?: "sm" | "md" | "lg";
  showDetails?: boolean;
  showProgress?: boolean;
  stats?: any;
}

const AchievementBadge = ({
  achievement,
  size = "md",
  showDetails = true,
  showProgress = false,
  stats,
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

  const getIcon = () => {
    switch (achievement.icon) {
      case "Trophy":
        return <Trophy />;
      case "Star":
        return <Star />;
      case "Medal":
        return <Medal />;
      case "Crown":
        return <Crown />;
      case "Bot":
        return <Bot />;
      case "MessageCircle":
        return <MessageCircle />;
      default:
        return <Sparkles />;
    }
  };

  const progress =
    showProgress && stats ? getProgressToNextTier(achievement, stats) : null;

  return (
    <div className="group relative inline-block">
      {/* Achievement Badge */}
      <div
        className={`${sizeClasses[size]} relative rounded-full p-0.5 transition-all duration-300 transform hover:scale-110 ${achievement.just_earned ? "animate-bounce" : ""}`}
      >
        {/* Animated gradient border */}
        <div
          className={`absolute inset-0 rounded-full bg-gradient-to-r ${getTierColor(achievement.tier)} animate-spin-slow opacity-75`}
        />

        {/* Inner content with glow effect */}
        <div className="absolute inset-0.5 rounded-full bg-black/90 backdrop-blur-sm flex items-center justify-center overflow-hidden">
          {/* Glow effect */}
          <div
            className={`absolute inset-0 bg-gradient-to-r ${getTierColor(achievement.tier)} opacity-20 group-hover:opacity-30 transition-opacity duration-300 blur-md`}
          />

          {/* Icon */}
          <div
            className={`${iconSizes[size]} relative z-10 text-transparent bg-clip-text bg-gradient-to-r ${getTierColor(achievement.tier)} group-hover:scale-110 transition-transform duration-300`}
          >
            {getIcon()}
          </div>
        </div>

        {/* Just earned indicator */}
        {achievement.just_earned && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-ping" />
        )}
      </div>

      {/* Tooltip */}
      {showDetails && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50">
          <Card className="p-4 bg-black/90 backdrop-blur-sm border-green-500/20">
            {/* Category indicator */}
            <div className="flex items-center justify-between mb-2">
              <span
                className={`text-xs px-2 py-0.5 rounded-full bg-gradient-to-r ${getCategoryColor(achievement.category)} text-white`}
              >
                {achievement.category.charAt(0).toUpperCase() +
                  achievement.category.slice(1)}
              </span>
              <span
                className={`text-xs font-semibold bg-clip-text text-transparent bg-gradient-to-r ${getTierColor(achievement.tier)}`}
              >
                {achievement.tier.charAt(0).toUpperCase() +
                  achievement.tier.slice(1)}
              </span>
            </div>

            {/* Achievement details */}
            <h4
              className={`text-sm font-semibold bg-clip-text text-transparent bg-gradient-to-r ${getTierColor(achievement.tier)} mb-1`}
            >
              {achievement.name}
            </h4>
            <p className="text-xs text-gray-400 mb-2">
              {achievement.description}
            </p>

            {/* Progress bar */}
            {showProgress && progress !== null && (
              <div className="space-y-1">
                <Progress
                  value={progress}
                  className="h-1 bg-green-500/10"
                  indicatorClassName={`bg-gradient-to-r ${getTierColor(achievement.tier)}`}
                />
                <p className="text-xs text-gray-500 text-right">{progress}%</p>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
};

export default AchievementBadge;
