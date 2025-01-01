import { useState, useEffect } from "react";
import { profileService } from "../services/profile/profileService";
import { Profile, ProfileUpdateData } from "../types/profile";
import { useAuth } from "./useAuth";

export const useProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchProfile = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const profileData = await profileService.getProfile(user.id);
      setProfile(profileData);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updateData: ProfileUpdateData) => {
    if (!user) return;

    setLoading(true);
    setError("");
    try {
      const updatedProfile = await profileService.updateProfile(user.id, updateData);
      setProfile(updatedProfile);
      return true;
    } catch (error) {
      setError(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  return {
    profile,
    loading,
    error,
    updateProfile,
    refreshProfile: fetchProfile,
  };
};
