import { useState, useEffect } from "react";
import { ProfileService } from "@/services/profile/profileService";
import { Profile, ProfileStats } from "@/services/profile/profileTypes";
import { SocialStats, getUserSocialStats } from "@/lib/social";
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

      const [
        profileData,
        statsData,
        socialData,
        companionsData,
        achievementsData,
      ] = await Promise.all([
        ProfileService.getProfile(userId),
        ProfileService.getProfileStats(userId),
        getUserSocialStats(userId),
        supabase
          .from("companions")
          .select("*")
          .eq("creator_id", userId)
          .eq("status", "approved"),
        supabase.rpc("check_and_award_achievements", { user_id: userId }),
      ]);

      setProfile(profileData);
      setStats(statsData);
      setSocialStats(socialData);
      setCompanions(companionsData.data || []);
      setAchievements(achievementsData.data || []);
    } catch (err) {
      console.error("Error loading profile:", err);
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
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
