import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Profile, ProfileStats } from "@/services/profile/profileTypes";
import { SocialStats } from "@/lib/social";
import { Companion } from "@/lib/companions";
import { Achievement } from "@/lib/achievements";

interface UseProfileReturn {
  profile: Profile | null;
  stats: ProfileStats | null;
  socialStats: SocialStats | null;
  companions: Companion[];
  achievements: Achievement[];
  loading: boolean;
  error: string | null;
  refreshProfile: () => Promise<void>;
}

export const useProfile = (userId: string): UseProfileReturn => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [stats, setStats] = useState<ProfileStats | null>(null);
  const [socialStats, setSocialStats] = useState<SocialStats | null>(null);
  const [companions, setCompanions] = useState<Companion[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load profile
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (profileError) throw new Error("Failed to load profile");
      setProfile(profileData);

      // Load stats
      const { data: statsData, error: statsError } = await supabase
        .rpc("get_user_stats", { user_id: userId })
        .single();

      if (statsError) {
        console.error("Stats error:", statsError);
        // Don't throw here, just set stats to null
        setStats(null);
      } else {
        setStats(statsData);
      }

      // Load social stats
      const { data: socialData, error: socialError } = await supabase.rpc(
        "get_user_social_stats",
        { user_id: userId },
      );

      if (socialError) {
        console.error("Social stats error:", socialError);
        // Don't throw here, just set socialStats to null
        setSocialStats(null);
      } else {
        setSocialStats(socialData);
      }

      // Load companions
      const { data: companionsData, error: companionsError } = await supabase
        .from("companions")
        .select("*")
        .eq("creator_id", userId)
        .eq("status", "approved");

      if (companionsError) {
        console.error("Companions error:", companionsError);
        // Don't throw here, just set companions to empty array
        setCompanions([]);
      } else {
        setCompanions(companionsData || []);
      }

      // Load achievements
      const { data: achievementsData, error: achievementsError } =
        await supabase.rpc("check_and_award_achievements", { user_id: userId });

      if (achievementsError) {
        console.error("Achievements error:", achievementsError);
        // Don't throw here, just set achievements to empty array
        setAchievements([]);
      } else {
        setAchievements(achievementsData || []);
      }
    } catch (err) {
      console.error("Error loading profile:", err);
      setError(err instanceof Error ? err.message : "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      loadProfile();
    }
  }, [userId]);

  return {
    profile,
    stats,
    socialStats,
    companions,
    achievements,
    loading,
    error,
    refreshProfile: loadProfile,
  };
};
