import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Bot, Trophy, Settings } from "lucide-react";
import CompanionGrid from "../../CompanionGrid";
import AchievementShowcase from "@/components/achievements/AchievementShowcase";
import UserSettings from "../../UserSettings";
import { Companion } from "@/lib/companions";
import { Achievement } from "@/lib/achievements";
import { ProfileStats } from "@/services/profile/profileTypes";

interface ProfileTabsProps {
  companions: Companion[];
  achievements: Achievement[];
  stats: ProfileStats;
  isOwnProfile: boolean;
}

const ProfileTabs = ({
  companions,
  achievements,
  stats,
  isOwnProfile,
}: ProfileTabsProps) => {
  return (
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
        {isOwnProfile && (
          <TabsTrigger
            value="settings"
            className="flex-1 data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400"
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </TabsTrigger>
        )}
      </TabsList>

      <div className="mt-8">
        <TabsContent value="companions">
          <CompanionGrid companions={companions} />
        </TabsContent>

        <TabsContent value="achievements">
          <AchievementShowcase achievements={achievements} stats={stats} />
        </TabsContent>

        {isOwnProfile && (
          <TabsContent value="settings">
            <UserSettings />
          </TabsContent>
        )}
      </div>
    </Tabs>
  );
};

export default ProfileTabs;
