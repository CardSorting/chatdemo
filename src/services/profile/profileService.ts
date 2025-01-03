import { supabase } from "../../lib/supabase";
import { Profile, ProfileUpdateData, UserDetails } from "../../types/profile";
import { Database } from "../../types/supabase";

class ProfileService {
  async getProfile(userId: string): Promise<UserDetails | null> {
    try {
      const { data, error } = await supabase
        .rpc('get_user_details', { user_id: userId })
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

      return data as UserDetails;
    } catch (error) {
      console.error("Error fetching profile:", error);
      throw error;
    }
  }

  async updateProfile(userId: string, updateData: ProfileUpdateData): Promise<UserDetails> {
    // Validate required fields
    if (!updateData.full_name?.trim() || !updateData.username?.trim()) {
      throw new Error("Full name and username are required");
    }

    // Check username availability if changed
    if (updateData.username) {
      const { data: existingUser, error: usernameError } = await supabase
        .from('profiles')
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
      .from('profiles')
      .update(dataToUpdate)
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error("Profile update failed");

    // Fetch updated user details
    return this.getProfile(userId);
  }

  async getAchievements(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('achievements')
        .select("*")
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching achievements:", error);
      throw error;
    }
  }

  async getUserAchievements(userId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('user_achievements')
        .select("*, achievements(*)")
        .eq("user_id", userId);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching user achievements:", error);
      throw error;
    }
  }

  async updateAchievementProgress(userId: string, achievementId: string, progress: number): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('user_achievements')
        .upsert({
          user_id: userId,
          achievement_id: achievementId,
          progress: progress,
          completed: progress >= 100,
          completed_at: progress >= 100 ? new Date().toISOString() : null
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error updating achievement progress:", error);
      throw error;
    }
  }
}

export const profileService = new ProfileService();
