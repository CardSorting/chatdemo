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
