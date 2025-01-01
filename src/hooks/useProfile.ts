import { useState, useEffect } from "react";
import { profileService } from "../services/profile/profileService";
import { Profile, ProfileUpdateData } from "../types/profile";
import { useAuth } from "./useAuth";
import { useToast } from "../components/ui/use-toast";

export const useProfile = (userId?: string) => {
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchProfile = async (id: string) => {
    setLoading(true);
    setError("");
    try {
      const profileData = await profileService.getProfile(id);
      if (!profileData) {
        setError("Profile not found");
        return;
      }
      setProfile(profileData);
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

  useEffect(() => {
    if (userId) {
      fetchProfile(userId);
    }
  }, [userId]);

  return {
    profile,
    loading,
    error,
    updateProfile,
    refreshProfile: () => userId ? fetchProfile(userId) : Promise.resolve(),
  };
};
