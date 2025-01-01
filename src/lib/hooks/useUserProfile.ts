import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Companion } from "@/lib/companions";
import { Achievement } from "@/lib/achievements";
import { SocialStats, getUserSocialStats } from "@/lib/social";

interface UserStats {
  total_companions: number;
  total_likes: number;
  total_messages: number;
  achievements_count: number;
  rank: number;
  top_category: string;
}

interface UseUserProfileReturn {
  profile: any;
  companions: Companion[];
  achievements: Achievement[];
  stats: UserStats | null;
  socialStats: SocialStats | null;
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
}

export const useUserProfile = (userId: string): UseUserProfileReturn => {
  const [profile, setProfile] = useState<any>(null);
  const [companions, setCompanions] = useState<Companion[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [socialStats, setSocialStats] = useState<SocialStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUserData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [
        profileData,
        companionsData,
        achievementsData,
        statsData,
        socialData,
      ] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", userId).single(),
        supabase
          .from("companions")
          .select("*")
          .eq("creator_id", userId)
          .eq("status", "approved"),
        supabase.rpc("check_and_award_achievements", { user_id: userId }),
        supabase.rpc("get_user_stats", { user_id: userId }).single(),
        getUserSocialStats(userId),
      ]);

      setProfile(profileData.data);
      setCompanions(companionsData.data || []);
      setAchievements(achievementsData.data || []);
      setStats(statsData.data);
      setSocialStats(socialData);
    } catch (err) {
      console.error("Error loading user data:", err);
      setError("Failed to load user profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserData();
  }, [userId]);

  return {
    profile,
    companions,
    achievements,
    stats,
    socialStats,
    loading,
    error,
    refreshData: loadUserData,
  };
};
