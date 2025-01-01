import React from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { useProfile } from "@/hooks/useProfile";
import { Card } from "@/components/ui/card";
import LoadingSpinner from "@/components/ui/loading-spinner";
import ProfileHeader from "./ProfileHeader";
import ProfileStats from "./ProfileStats";
import ProfileTabs from "./ProfileTabs";
import SocialStats from "./SocialStats";

const ProfileContainer = () => {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const {
    profile,
    stats,
    socialStats,
    companions,
    achievements,
    loading,
    error,
    refreshProfile,
  } = useProfile(userId!);

  const isOwnProfile = currentUser?.id === userId;

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

  return (
    <div className="min-h-screen w-full bg-black">
      <ProfileHeader profile={profile} stats={stats} />

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8">
        {socialStats && (
          <SocialStats
            userId={userId!}
            stats={socialStats}
            onStatsChange={refreshProfile}
          />
        )}

        {stats && <ProfileStats stats={stats} />}

        <ProfileTabs
          companions={companions}
          achievements={achievements}
          stats={stats}
          isOwnProfile={isOwnProfile}
        />
      </div>

      {/* Decorative Elements */}
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse-slow pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow pointer-events-none" />
    </div>
  );
};

export default ProfileContainer;
