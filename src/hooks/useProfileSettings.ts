import { useState, useEffect } from "react";
import { useAuth } from "../lib/auth";
import { supabase } from "../lib/supabase";
import { ProfileFormData, ProfileUpdateResponse } from "../types/profile";

export const useProfileSettings = () => {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState<ProfileFormData>({
    fullName: profile?.full_name || "",
    username: profile?.username || "",
    bio: profile?.bio || "",
    website: profile?.website || "",
    avatarUrl: profile?.avatar_url || "",
    emailNotifications: profile?.email_notifications || false,
    profileVisibility: profile?.visibility || "public",
    theme: profile?.theme || "dark",
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        fullName: profile.full_name || "",
        username: profile.username || "",
        bio: profile.bio || "",
        website: profile.website || "",
        avatarUrl: profile.avatar_url || "",
        emailNotifications: profile.email_notifications || false,
        profileVisibility: profile.visibility || "public",
        theme: profile.theme || "dark",
      });
    }
  }, [profile]);

  const handleFormDataChange = (key: keyof ProfileFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^a-zA-Z0-9_]/g, "").toLowerCase();
    handleFormDataChange("username", value);
  };

  const updateProfile = async (): Promise<ProfileUpdateResponse> => {
    if (!user) return { success: false, error: "No user found" };

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Validate required fields
      if (!formData.fullName.trim() || !formData.username.trim()) {
        throw new Error("Full name and username are required");
      }

      // Check if username is already taken
      if (formData.username !== profile?.username) {
        const { data: existingUser, error: usernameError } = await supabase
          .from("profiles")
          .select("username")
          .eq("username", formData.username)
          .single();

        if (usernameError && usernameError.code !== "PGRST116") {
          throw new Error("Error checking username availability");
        }

        if (existingUser) {
          throw new Error("Username is already taken");
        }
      }

      // Prepare update data
      const updateData = {
        full_name: formData.fullName.trim(),
        username: formData.username.toLowerCase().trim(),
        bio: formData.bio?.trim() || null,
        website: formData.website?.trim() || null,
        avatar_url: formData.avatarUrl?.trim() || null,
        email_notifications: formData.emailNotifications,
        visibility: formData.profileVisibility,
        theme: formData.theme,
        updated_at: new Date().toISOString(),
      };

      // Update profile in database
      const { data, error: updateError } = await supabase
        .from("profiles")
        .update(updateData)
        .eq("id", user.id)
        .select();

      if (updateError) {
        throw new Error(updateError.message || "Failed to update profile");
      }

      if (!data) {
        throw new Error("No data returned from profile update");
      }

      setSuccess("Profile updated successfully!");
      return { success: true };
    } catch (error) {
      const errorMessage = error.message || "Failed to update profile";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    loading,
    error,
    success,
    handleFormDataChange,
    handleUsernameChange,
    updateProfile,
  };
};
