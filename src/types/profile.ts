export interface Profile {
  id: string;
  full_name: string;
  username: string;
  bio: string;
  website: string;
  avatar_url: string;
  email_notifications: boolean;
  visibility: "public" | "private" | "followers";
  theme: "dark" | "light" | "system";
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
  profileVisibility: "public" | "private" | "followers";
  theme: "dark" | "light" | "system";
}

export interface ProfileUpdateResponse {
  success: boolean;
  error?: string;
}
