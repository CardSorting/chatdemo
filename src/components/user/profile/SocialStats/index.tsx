import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Loader2,
  Users,
  Heart,
  UserPlus,
  UserMinus,
  Crown,
  Info,
} from "lucide-react";
import {
  SocialStats as SocialStatsType,
  followUser,
  unfollowUser,
  isFollowing,
} from "@/lib/social";
import { useAuth } from "@/lib/auth";

interface SocialStatsProps {
  userId: string;
  stats: SocialStatsType;
  onStatsChange?: () => void;
}

const SocialStats = ({ userId, stats, onStatsChange }: SocialStatsProps) => {
  const { user } = useAuth();
  const [following, setFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showFollowersDialog, setShowFollowersDialog] = useState(false);
  const [showFollowingDialog, setShowFollowingDialog] = useState(false);

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

  // Ensure stats has all required properties with defaults
  const safeStats = {
    followers_count: stats?.followers_count || 0,
    following_count: stats?.following_count || 0,
    total_likes: stats?.total_likes || 0,
  };

  return (
    <TooltipProvider>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Dialog
          open={showFollowersDialog}
          onOpenChange={setShowFollowersDialog}
        >
          <DialogTrigger asChild>
            <Card className="group p-4 bg-black/50 backdrop-blur-sm border-green-500/20 hover:border-green-500/40 transition-all duration-300 flex items-center justify-between relative overflow-hidden cursor-pointer transform hover:scale-[1.02]">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/0 via-green-500/5 to-green-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="flex items-center gap-3 relative z-10">
                <div className="p-2 rounded-lg bg-green-500/10 group-hover:bg-green-500/20 transition-colors duration-300">
                  <Users className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300 flex items-center gap-2">
                    Followers
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-4 h-4 text-gray-500" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Click to view followers</p>
                      </TooltipContent>
                    </Tooltip>
                  </p>
                  <p className="text-2xl font-bold text-white group-hover:text-green-400 transition-colors duration-300">
                    {safeStats.followers_count.toLocaleString()}
                  </p>
                </div>
              </div>
            </Card>
          </DialogTrigger>
          <DialogContent className="bg-black/90 border-green-500/20">
            <DialogHeader>
              <DialogTitle>Followers</DialogTitle>
            </DialogHeader>
            <ScrollArea className="h-[400px] rounded-md border border-green-500/20 p-4">
              {/* Placeholder for followers list */}
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 p-3 rounded-lg bg-black/50 border border-green-500/20 hover:border-green-500/40 transition-all duration-300"
                  >
                    <div className="w-10 h-10 rounded-full bg-green-500/20" />
                    <div>
                      <p className="text-white">User {i + 1}</p>
                      <p className="text-sm text-gray-400">@username{i + 1}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>

        <Dialog
          open={showFollowingDialog}
          onOpenChange={setShowFollowingDialog}
        >
          <DialogTrigger asChild>
            <Card className="group p-4 bg-black/50 backdrop-blur-sm border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 flex items-center justify-between relative overflow-hidden cursor-pointer transform hover:scale-[1.02]">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-blue-500/5 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="flex items-center gap-3 relative z-10">
                <div className="p-2 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors duration-300">
                  <Crown className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300 flex items-center gap-2">
                    Following
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-4 h-4 text-gray-500" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Click to view following</p>
                      </TooltipContent>
                    </Tooltip>
                  </p>
                  <p className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors duration-300">
                    {safeStats.following_count.toLocaleString()}
                  </p>
                </div>
              </div>
            </Card>
          </DialogTrigger>
          <DialogContent className="bg-black/90 border-blue-500/20">
            <DialogHeader>
              <DialogTitle>Following</DialogTitle>
            </DialogHeader>
            <ScrollArea className="h-[400px] rounded-md border border-blue-500/20 p-4">
              {/* Placeholder for following list */}
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 p-3 rounded-lg bg-black/50 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300"
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-500/20" />
                    <div>
                      <p className="text-white">User {i + 1}</p>
                      <p className="text-sm text-gray-400">@username{i + 1}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>

        <Tooltip>
          <TooltipTrigger asChild>
            <Card className="group p-4 bg-black/50 backdrop-blur-sm border-red-500/20 hover:border-red-500/40 transition-all duration-300 flex items-center justify-between relative overflow-hidden transform hover:scale-[1.02]">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/0 via-red-500/5 to-red-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="flex items-center gap-3 relative z-10">
                <div className="p-2 rounded-lg bg-red-500/10 group-hover:bg-red-500/20 transition-colors duration-300">
                  <Heart className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                    Total Likes
                  </p>
                  <p className="text-2xl font-bold text-white group-hover:text-red-400 transition-colors duration-300">
                    {safeStats.total_likes.toLocaleString()}
                  </p>
                </div>
              </div>
            </Card>
          </TooltipTrigger>
          <TooltipContent>
            <p>Total likes received across all companions</p>
          </TooltipContent>
        </Tooltip>

        {user && user.id !== userId && (
          <Card className="group p-4 bg-black/50 backdrop-blur-sm border-green-500/20 hover:border-green-500/40 transition-all duration-300 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/0 via-green-500/5 to-green-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <Button
              onClick={handleFollowToggle}
              disabled={loading}
              variant={following ? "outline" : "default"}
              className={`w-full relative z-10 ${following ? "border-red-500/50 text-red-400 hover:bg-red-500/10" : "bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"} transition-all duration-300 transform hover:scale-[1.02]`}
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
    </TooltipProvider>
  );
};

export default SocialStats;
