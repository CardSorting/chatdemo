import React from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { useProfile } from "../../../hooks/useProfile";
import { Card } from "../../ui/card";
import LoadingSpinner from "../../ui/loading-spinner";
import ProfileHeader from "./ProfileHeader";
import ProfileTabs from "./ProfileTabs";
import SocialStats from "./SocialStats";

const ProfileContainer = () => {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const {
    profile,
    loading,
    error,
    refreshProfile,
  } = useProfile(userId);

  if (!userId) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <Card className="p-6 bg-black/50 backdrop-blur-sm border-red-500/20 text-red-500">
          User ID is required
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <LoadingSpinner message="Loading profile..." />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <Card className="p-6 bg-black/50 backdrop-blur-sm border-red-500/20 text-red-500">
          {error || "User not found"}
        </Card>
      </div>
    );
  }

  const isOwnProfile = currentUser?.id === userId;

  // Create default stats if none exist
  const defaultStats = {
    total_companions: 0,
    total_likes: 0,
    total_messages: 0,
    achievements_count: 0,
    rank: 0,
    top_category: "New User",
  };

  // Create default social stats if none exist
  const defaultSocialStats = {
    followers_count: 0,
    following_count: 0,
    total_likes: 0,
  };

  return (
    <div className="min-h-screen w-full bg-black">
      {/* Matrix Rain Background */}
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjEiIGZpbGw9InJnYmEoMCwyNTUsMCwwLjEpIi8+PC9nPjwvc3ZnPg==')] opacity-20 pointer-events-none animate-matrix-rain" />

      <div className="relative">
        <ProfileHeader profile={profile} stats={defaultStats} />

        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8">
          {/* Social Stats Section */}
          <div className="relative">
            <SocialStats
              userId={userId}
              stats={defaultSocialStats}
              onStatsChange={refreshProfile}
            />
          </div>

          {/* Tabs Section */}
          <div className="relative mt-12">
            <ProfileTabs
              companions={[]}
              achievements={[]}
              stats={defaultStats}
              isOwnProfile={isOwnProfile}
            />
          </div>
        </div>
      </div>

      {/* Static Decorative Elements */}
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-green-500/5 to-blue-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
};

export default ProfileContainer;
