import { useState, useEffect } from "react";
import { profileService } from "../services/profile/profileService";
import { Profile, ProfileUpdateData } from "../types/profile";
import { useAuth } from "./useAuth";
import { useToast } from "../components/ui/use-toast";

export const useProfile = (userId?: string) => {
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchProfile = async (id: string) => {
    setLoading(true);
    setError("");
    try {
      const [profileData, userAchievements] = await Promise.all([
        profileService.getProfile(id),
        profileService.getUserAchievements(id)
      ]);

      if (!profileData) {
        setError("Profile not found");
        return;
      }

      setProfile(profileData);
      setAchievements(userAchievements);
    } catch (error) {
      setError(error.message);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updateData: ProfileUpdateData) => {
    if (!currentUser) {
      setError("User not authenticated");
      return false;
    }

    setLoading(true);
    setError("");
    try {
      const updatedProfile = await profileService.updateProfile(currentUser.id, updateData);
      if (!updatedProfile) {
        setError("Failed to update profile");
        return false;
      }
      setProfile(updatedProfile);
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      return true;
    } catch (error) {
      setError(error.message);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateAchievementProgress = async (achievementId: string, progress: number) => {
    if (!currentUser) {
      setError("User not authenticated");
      return false;
    }

    setLoading(true);
    setError("");
    try {
      const updatedAchievement = await profileService.updateAchievementProgress(
        currentUser.id,
        achievementId,
        progress
      );
      if (!updatedAchievement) {
        setError("Failed to update achievement progress");
        return false;
      }
      
      // Update local achievements state
      setAchievements(prev => prev.map(a => 
        a.achievement_id === achievementId ? updatedAchievement : a
      ));
      
      return true;
    } catch (error) {
      setError(error.message);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchProfile(userId);
    }
  }, [userId]);

  return {
    profile,
    achievements,
    loading,
    error,
    updateProfile,
    updateAchievementProgress,
    refreshProfile: () => userId ? fetchProfile(userId) : Promise.resolve(),
  };
};
