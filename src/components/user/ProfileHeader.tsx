import React from "react";
import { Button } from "@/components/ui/button";
import { Share2, Calendar, MapPin, Link, Crown } from "lucide-react";

interface ProfileHeaderProps {
  profile: {
    avatar_url: string;
    full_name: string;
    created_at: string;
    website?: string;
  };
  stats?: {
    rank: number;
    top_category?: string;
  };
}

const ProfileHeader = ({ profile, stats }: ProfileHeaderProps) => {
  return (
    <div className="relative h-80 bg-gradient-to-b from-green-500/10 to-transparent overflow-hidden">
      {/* Matrix-style background overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjEiIGZpbGw9InJnYmEoMCwyNTUsMCwwLjEpIi8+PC9nPjwvc3ZnPg==')] opacity-20 animate-matrix-rain" />

      {/* Profile Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative h-full flex items-end">
        <div className="flex items-end gap-8 mb-8">
          <div className="relative">
            <img
              src={
                profile.avatar_url ||
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.full_name}`
              }
              alt={profile.full_name}
              className="w-32 h-32 rounded-full border-4 border-green-500/50 bg-black/50 backdrop-blur-sm transform -translate-y-16"
            />
            {stats?.rank && stats.rank <= 3 && (
              <div className="absolute -top-24 -right-2 bg-gradient-to-br from-yellow-400 to-yellow-600 p-2 rounded-full">
                <Crown className="w-6 h-6 text-black" />
              </div>
            )}
          </div>
          <div className="mb-4">
            <div className="flex items-center gap-4 mb-2">
              <h1 className="text-4xl font-bold text-white">
                {profile.full_name}
              </h1>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 border-green-500/20 text-green-400 hover:bg-green-500/10"
              >
                <Share2 className="w-4 h-4" />
                Share Profile
              </Button>
            </div>
            <div className="flex items-center gap-6 text-gray-400">
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Joined {new Date(profile.created_at).toLocaleDateString()}
              </span>
              {stats?.top_category && (
                <span className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {stats.top_category} Specialist
                </span>
              )}
              {profile.website && (
                <a
                  href={profile.website}
                  className="flex items-center gap-2 hover:text-green-400 transition-colors"
                >
                  <Link className="w-4 h-4" />
                  Website
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
