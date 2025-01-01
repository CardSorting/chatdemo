import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import AchievementShowcase from "../achievements/AchievementShowcase";
import {
  Bot,
  Trophy,
  Star,
  Crown,
  Share2,
  Calendar,
  MapPin,
  Link,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Companion } from "@/lib/companions";
import { Achievement } from "@/lib/achievements";
import CompanionGrid from "./CompanionGrid";
import UserStats from "./UserStats";

interface UserStats {
  total_companions: number;
  total_likes: number;
  total_messages: number;
  achievements_count: number;
  rank: number;
  top_category: string;
}

const UserProfile = () => {
  const { userId } = useParams();
  const [profile, setProfile] = useState<any>(null);
  const [companions, setCompanions] = useState<Companion[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, [userId]);

  const loadUserData = async () => {
    try {
      const [profileData, companionsData, achievementsData, statsData] =
        await Promise.all([
          supabase.from("profiles").select("*").eq("id", userId).single(),
          supabase
            .from("companions")
            .select("*")
            .eq("creator_id", userId)
            .eq("status", "approved"),
          supabase.rpc("check_and_award_achievements", { user_id: userId }),
          supabase.rpc("get_user_stats", { user_id: userId }).single(),
        ]);

      setProfile(profileData.data);
      setCompanions(companionsData.data || []);
      setAchievements(achievementsData.data || []);
      setStats(statsData.data);
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-green-500 animate-pulse">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <Card className="p-6 bg-black/50 backdrop-blur-sm border-red-500/20 text-red-500">
          User not found
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-black">
      {/* Hero Section with Profile Info */}
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
              {stats?.rank <= 3 && (
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

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8">
        {/* Stats Overview */}
        {stats && <UserStats stats={stats} />}

        {/* Main Content */}
        <Tabs defaultValue="companions" className="w-full">
          <TabsList className="w-full bg-black/50 p-1 gap-1">
            <TabsTrigger
              value="companions"
              className="flex-1 data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400"
            >
              <Bot className="w-4 h-4 mr-2" />
              Companions
            </TabsTrigger>
            <TabsTrigger
              value="achievements"
              className="flex-1 data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400"
            >
              <Trophy className="w-4 h-4 mr-2" />
              Achievements
            </TabsTrigger>
            <TabsTrigger
              value="stats"
              className="flex-1 data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400"
            >
              <Star className="w-4 h-4 mr-2" />
              Detailed Stats
            </TabsTrigger>
          </TabsList>

          <div className="mt-8">
            <TabsContent value="companions">
              <CompanionGrid companions={companions} />
            </TabsContent>

            <TabsContent value="achievements">
              <AchievementShowcase achievements={achievements} stats={stats} />
            </TabsContent>

            <TabsContent value="stats">
              <Card className="p-8 bg-black/50 backdrop-blur-sm border-green-500/20">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <Star className="w-6 h-6 text-yellow-500" />
                  Performance Overview
                </h2>
                <div className="space-y-6">
                  {/* Add detailed stats sections here */}
                </div>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Decorative Elements */}
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse-slow pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow pointer-events-none" />
    </div>
  );
};

export default UserProfile;
