import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../ui/tabs";
import CompanionGrid from "../../CompanionGrid";

const ProfileTabs = ({
  companions,
}: {
  companions: any[];
}) => {
  return (
    <Tabs defaultValue="companions" className="w-full">
      <TabsList className="grid w-full grid-cols-1">
        <TabsTrigger value="companions">Companions</TabsTrigger>
      </TabsList>

      <TabsContent value="companions">
        <CompanionGrid companions={companions} />
      </TabsContent>
    </Tabs>
  );
};

export default ProfileTabs;
