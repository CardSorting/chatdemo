export interface Profile {
  id: string;
  full_name: string;
  username: string;
  bio: string;
  website: string;
  avatar_url: string;
  email: string;
  role: "user" | "admin";
  email_notifications: boolean;
  visibility: ProfileVisibility;
  theme: Theme;
  created_at: string;
  updated_at: string;
}

export interface ProfileFormData {
  fullName: string;
  username: string;
  bio: string;
  website: string;
  avatarUrl: string;
  emailNotifications: boolean;
  profileVisibility: ProfileVisibility;
  theme: Theme;
}

export interface ProfileUpdateData {
  full_name: string;
  username: string;
  bio?: string;
  website?: string;
  avatar_url?: string;
  email_notifications?: boolean;
  visibility?: ProfileVisibility;
  theme?: Theme;
}

export interface ProfileUpdateResponse {
  success: boolean;
  error?: string;
}

export type ProfileVisibility = "public" | "private" | "followers";
export type Theme = "dark" | "light" | "system";
