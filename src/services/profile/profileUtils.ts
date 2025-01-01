import { Profile } from "./profileTypes";

export const getAvatarUrl = (profile: Profile): string => {
  return (
    profile.avatar_url ||
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.full_name}`
  );
};

export const formatProfileDate = (date: string): string => {
  return new Date(date).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const getRankBadge = (rank: number): string => {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return "";
};
