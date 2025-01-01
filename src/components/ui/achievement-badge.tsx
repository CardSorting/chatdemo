import React from "react";
import { cn } from "@/lib/utils";
import { Achievement, getTierColor } from "@/lib/achievements";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
    sm: "w-8 h-8 text-lg",
    md: "w-12 h-12 text-2xl",
    lg: "w-16 h-16 text-3xl",
  };

  const badge = (
    <div
      className={cn(
        "relative group flex items-center justify-center rounded-full transition-all duration-300",
        sizeClasses[size],
        "bg-black/50 backdrop-blur-sm border-2",
        `hover:border-${getTierColor(achievement.tier).split(" ")[0].replace("from-", "")}`,
      )}
    >
      {/* Glow effect */}
      <div
        className={cn(
          "absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur",
          `bg-gradient-to-r ${getTierColor(achievement.tier)}`,
        )}
      />

      {/* Icon */}
      <div className="relative z-10">{achievement.icon}</div>

      {/* Border gradient */}
      <div
        className={cn(
          "absolute inset-0 rounded-full border-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
          `bg-gradient-to-r ${getTierColor(achievement.tier)}`,
        )}
      />
    </div>
  );

  if (!showDetails) {
    return badge;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{badge}</TooltipTrigger>
        <TooltipContent
          side="top"
          className="bg-black/90 border-green-500/20 backdrop-blur-sm"
        >
          <div className="text-center">
            <h3
              className={cn(
                "font-semibold bg-clip-text text-transparent",
                `bg-gradient-to-r ${getTierColor(achievement.tier)}`,
              )}
            >
              {achievement.name}
            </h3>
            <p className="text-sm text-gray-400">{achievement.description}</p>
            <p
              className={cn(
                "text-xs font-medium mt-1",
                `text-${getTierColor(achievement.tier).split(" ")[0].replace("from-", "")}`,
              )}
            >
              {achievement.tier.charAt(0).toUpperCase() +
                achievement.tier.slice(1)}{" "}
              Tier
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default AchievementBadge;
