import { supabase } from "./supabase";

export interface Achievement {
  achievement_id: string;
  name: string;
  description: string;
  icon: string;
  tier: "bronze" | "silver" | "gold" | "diamond";
  category: "creation" | "engagement" | "interaction" | "specialization";
  just_earned?: boolean;
}

export const checkAchievements = async (userId: string) => {
  const { data, error } = await supabase.rpc("check_and_award_achievements", {
    user_id: userId,
  });

  if (error) throw error;
  return data as Achievement[];
};

export const getTierColor = (tier: Achievement["tier"]) => {
  switch (tier) {
    case "bronze":
      return "from-amber-600 to-amber-800";
    case "silver":
      return "from-gray-300 to-gray-500";
    case "gold":
      return "from-yellow-400 to-yellow-600";
    case "diamond":
      return "from-blue-400 via-blue-500 to-purple-500";
    default:
      return "from-green-500 to-blue-500";
  }
};

export const getCategoryColor = (category: Achievement["category"]) => {
  switch (category) {
    case "creation":
      return "from-green-500 to-emerald-600";
    case "engagement":
      return "from-blue-500 to-indigo-600";
    case "interaction":
      return "from-purple-500 to-pink-600";
    case "specialization":
      return "from-yellow-500 to-orange-600";
    default:
      return "from-green-500 to-blue-500";
  }
};

export const getCategoryIcon = (category: Achievement["category"]) => {
  switch (category) {
    case "creation":
      return "Bot";
    case "engagement":
      return "Star";
    case "interaction":
      return "MessageCircle";
    case "specialization":
      return "Trophy";
    default:
      return "Medal";
  }
};

export const getNextTier = (currentTier: Achievement["tier"]) => {
  const tiers: Achievement["tier"][] = ["bronze", "silver", "gold", "diamond"];
  const currentIndex = tiers.indexOf(currentTier);
  return currentIndex < tiers.length - 1 ? tiers[currentIndex + 1] : null;
};

export const getProgressToNextTier = (achievement: Achievement, stats: any) => {
  const requirements = {
    bronze: { companions: 1, likes: 100, messages: 100 },
    silver: { companions: 5, likes: 500, messages: 1000 },
    gold: { companions: 15, likes: 2000, messages: 5000 },
    diamond: { companions: 30, likes: 10000, messages: 20000 },
  };

  const nextTier = getNextTier(achievement.tier);
  if (!nextTier) return 100;

  const req = requirements[nextTier];
  let progress = 0;

  switch (achievement.category) {
    case "creation":
      progress = (stats.total_companions / req.companions) * 100;
      break;
    case "engagement":
      progress = (stats.total_likes / req.likes) * 100;
      break;
    case "interaction":
      progress = (stats.total_messages / req.messages) * 100;
      break;
    default:
      progress = 0;
  }

  return Math.min(Math.round(progress), 100);
};
