import { useState } from "react";
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
      console.log("Starting profile update...");
      console.log("Form data:", formData);
      console.log("Current profile:", profile);

      // Check if username is already taken
      if (formData.username !== profile?.username) {
        console.log("Checking username availability...");
        const { data: existingUser, error: usernameError } = await supabase
          .from("profiles")
          .select("username")
          .eq("username", formData.username)
          .single();

        if (usernameError) {
          console.error("Username check error:", usernameError);
          throw usernameError;
        }

        if (existingUser) {
          console.log("Username is already taken");
          throw new Error("Username is already taken");
        }
      }

      console.log("Updating profile in database...");
      const { data, error: updateError } = await supabase
        .from("profiles")
        .update({
          full_name: formData.fullName,
          username: formData.username.toLowerCase(),
          bio: formData.bio,
          website: formData.website,
          avatar_url: formData.avatarUrl,
          email_notifications: formData.emailNotifications,
          visibility: formData.profileVisibility,
          theme: formData.theme,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)
        .select();

      if (updateError) {
        console.error("Supabase update error:", updateError);
        throw updateError;
      }

      console.log("Profile update successful:", data);
      setSuccess("Profile updated successfully!");
      setTimeout(() => setSuccess(""), 3000);

      return { success: true };
    } catch (error) {
      console.error("Profile update failed:", error);
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
