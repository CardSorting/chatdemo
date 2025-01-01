import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, Users, Heart, UserPlus, UserMinus } from "lucide-react";
import {
  SocialStats,
  followUser,
  unfollowUser,
  isFollowing,
} from "@/lib/social";
import { useAuth } from "@/lib/auth";

interface SocialStatsProps {
  userId: string;
  stats: SocialStats;
  onStatsChange?: () => void;
}

const SocialStats = ({ userId, stats, onStatsChange }: SocialStatsProps) => {
  const { user } = useAuth();
  const [following, setFollowing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      checkFollowStatus();
    }
  }, [user, userId]);

  const checkFollowStatus = async () => {
    try {
      const status = await isFollowing(userId);
      setFollowing(status);
    } catch (error) {
      console.error("Error checking follow status:", error);
    }
  };

  const handleFollowToggle = async () => {
    if (!user) return;
    setLoading(true);

    try {
      if (following) {
        await unfollowUser(userId);
      } else {
        await followUser(userId);
      }
      setFollowing(!following);
      onStatsChange?.();
    } catch (error) {
      console.error("Error toggling follow:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="p-4 bg-black/50 backdrop-blur-sm border-green-500/20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="w-5 h-5 text-green-500" />
          <div>
            <p className="text-sm text-gray-400">Followers</p>
            <p className="text-2xl font-bold text-white">
              {stats.followers_count.toLocaleString()}
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-4 bg-black/50 backdrop-blur-sm border-green-500/20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="w-5 h-5 text-blue-500" />
          <div>
            <p className="text-sm text-gray-400">Following</p>
            <p className="text-2xl font-bold text-white">
              {stats.following_count.toLocaleString()}
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-4 bg-black/50 backdrop-blur-sm border-green-500/20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Heart className="w-5 h-5 text-red-500" />
          <div>
            <p className="text-sm text-gray-400">Total Likes</p>
            <p className="text-2xl font-bold text-white">
              {stats.total_likes.toLocaleString()}
            </p>
          </div>
        </div>
      </Card>

      {user && user.id !== userId && (
        <Card className="p-4 bg-black/50 backdrop-blur-sm border-green-500/20 flex items-center justify-center">
          <Button
            onClick={handleFollowToggle}
            disabled={loading}
            variant={following ? "outline" : "default"}
            className={`w-full ${following ? "border-red-500/50 text-red-400 hover:bg-red-500/10" : "bg-green-500 hover:bg-green-600"}`}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : following ? (
              <>
                <UserMinus className="w-4 h-4 mr-2" />
                Unfollow
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4 mr-2" />
                Follow
              </>
            )}
          </Button>
        </Card>
      )}
    </div>
  );
};

export default SocialStats;
