import { supabase } from "../../lib/supabase";
import { Profile, ProfileUpdateData } from "../../types/profile";

class ProfileService {
  async getProfile(userId: string): Promise<Profile | null> {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        if (error.code === "PGRST116") { // No rows found
          throw new Error("Profile not found");
        }
        throw error;
      }

      if (!data) {
        throw new Error("Profile not found");
      }

      return data;
    } catch (error) {
      console.error("Error fetching profile:", error);
      throw error;
    }
  }

  async updateProfile(userId: string, updateData: ProfileUpdateData): Promise<Profile> {
    // Validate required fields
    if (!updateData.full_name?.trim() || !updateData.username?.trim()) {
      throw new Error("Full name and username are required");
    }

    // Check username availability if changed
    if (updateData.username) {
      const { data: existingUser, error: usernameError } = await supabase
        .from("profiles")
        .select("username")
        .eq("username", updateData.username)
        .neq("id", userId)
        .single();

      if (usernameError && usernameError.code !== "PGRST116") {
        throw new Error("Error checking username availability");
      }

      if (existingUser) {
        throw new Error("Username is already taken");
      }
    }

    // Prepare update data
    const dataToUpdate = {
      full_name: updateData.full_name.trim(),
      username: updateData.username.toLowerCase().trim(),
      bio: updateData.bio?.trim() || null,
      website: updateData.website?.trim() || null,
      avatar_url: updateData.avatar_url?.trim() || null,
      email_notifications: updateData.email_notifications || false,
      visibility: updateData.visibility || "public",
      theme: updateData.theme || "dark",
      updated_at: new Date().toISOString(),
    };

    // Perform update
    const { data, error } = await supabase
      .from("profiles")
      .update(dataToUpdate)
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error("Profile update failed");

    return data;
  }
}

export const profileService = new ProfileService();
