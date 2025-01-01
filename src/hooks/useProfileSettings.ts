import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { ProfileFormData, ProfileUpdateResponse } from "@/types/profile";

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
      // Check if username is already taken
      if (formData.username !== profile?.username) {
        const { data: existingUser } = await supabase
          .from("profiles")
          .select("username")
          .eq("username", formData.username)
          .single();

        if (existingUser) {
          throw new Error("Username is already taken");
        }
      }

      const { error } = await supabase
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
        .eq("id", user.id);

      if (error) throw error;

      setSuccess("Profile updated successfully!");
      setTimeout(() => setSuccess(""), 3000);

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
