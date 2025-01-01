import React from "react";
import { Button } from "@/components/ui/button";
import { Share2, Calendar, MapPin, Link, Crown, AtSign } from "lucide-react";
import { Profile } from "@/services/profile/profileTypes";
import { formatProfileDate } from "@/services/profile/profileUtils";

interface ProfileHeaderProps {
  profile: Profile;
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
          <div className="relative group">
            <img
              src={
                profile.avatar_url ||
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.full_name}`
              }
              alt={profile.full_name || "User"}
              className="w-32 h-32 rounded-full border-4 border-green-500/50 bg-black/50 backdrop-blur-sm transform -translate-y-16 transition-transform duration-300 group-hover:scale-105 group-hover:border-green-400"
            />
            {stats?.rank && stats.rank <= 3 && (
              <div className="absolute -top-24 -right-2 bg-gradient-to-br from-yellow-400 to-yellow-600 p-2 rounded-full transform transition-transform duration-300 hover:scale-110 hover:rotate-12">
                <Crown className="w-6 h-6 text-black" />
              </div>
            )}
          </div>
          <div className="mb-4">
            <div className="space-y-1">
              <h1 className="text-4xl font-bold text-white hover:text-green-400 transition-colors duration-300">
                {profile.full_name || "Anonymous User"}
              </h1>
              <div className="flex items-center gap-2 text-gray-400">
                <AtSign className="w-4 h-4 text-green-500" />
                <span className="text-lg">
                  {profile.username || "username"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 mt-4">
              <Button
                variant="outline"
                size="sm"
                className="gap-2 border-green-500/20 text-green-400 hover:bg-green-500/10 hover:scale-105 transform transition-all duration-300"
              >
                <Share2 className="w-4 h-4" />
                Share Profile
              </Button>

              {profile.website && (
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 border-blue-500/20 text-blue-400 hover:bg-blue-500/10 hover:scale-105 transform transition-all duration-300"
                  onClick={() => window.open(profile.website, "_blank")}
                >
                  <Link className="w-4 h-4" />
                  Website
                </Button>
              )}
            </div>

            <div className="flex items-center gap-6 mt-4 text-gray-400">
              <span className="flex items-center gap-2 hover:text-green-400 transition-colors duration-300">
                <Calendar className="w-4 h-4" />
                Joined {formatProfileDate(profile.created_at)}
              </span>
              {stats?.top_category && (
                <span className="flex items-center gap-2 hover:text-blue-400 transition-colors duration-300">
                  <MapPin className="w-4 h-4" />
                  {stats.top_category} Specialist
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/50 via-transparent to-black/50 pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-black to-transparent pointer-events-none" />
    </div>
  );
};

export default ProfileHeader;
