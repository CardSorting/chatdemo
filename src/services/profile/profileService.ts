import { supabase } from "@/lib/supabase";
import { Profile, ProfileStats, ProfileUpdateData } from "./profileTypes";

export class ProfileService {
  static async getProfile(userId: string): Promise<Profile> {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) throw error;
    return data;
  }

  static async getProfileStats(userId: string): Promise<ProfileStats> {
    const { data, error } = await supabase
      .rpc("get_user_stats", { user_id: userId })
      .single();

    if (error) throw error;
    return data;
  }

  static async updateProfile(
    userId: string,
    updateData: ProfileUpdateData,
  ): Promise<Profile> {
    const { data, error } = await supabase
      .from("profiles")
      .update(updateData)
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}
