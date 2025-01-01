export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url?: string;
  website?: string;
  role: "admin" | "user";
  created_at: string;
  updated_at: string;
}

export interface ProfileStats {
  total_companions: number;
  total_likes: number;
  total_messages: number;
  achievements_count: number;
  rank: number;
  top_category: string;
}

export interface ProfileUpdateData {
  full_name?: string;
  avatar_url?: string;
  website?: string;
}
