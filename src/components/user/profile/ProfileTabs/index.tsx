import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../ui/tabs";
import CompanionGrid from "../../CompanionGrid";
import AchievementShowcase from "../../../achievements/AchievementShowcase";

const ProfileTabs = ({
  companions,
  achievements,
  stats,
  isOwnProfile,
}: {
  companions: any[];
  achievements: any[];
  stats: any;
  isOwnProfile: boolean;
}) => {
  return (
    <Tabs defaultValue="companions" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="companions">Companions</TabsTrigger>
        <TabsTrigger value="achievements">Achievements</TabsTrigger>
        {isOwnProfile && (
          <TabsTrigger value="settings">Settings</TabsTrigger>
        )}
      </TabsList>

      <TabsContent value="companions">
        <CompanionGrid companions={companions} />
      </TabsContent>

      <TabsContent value="achievements">
        <AchievementShowcase achievements={achievements} stats={stats} />
      </TabsContent>
    </Tabs>
  );
};

export default ProfileTabs;
