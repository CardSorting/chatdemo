import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const SettingsPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Settings</h1>
      </div>

      <div className="grid gap-6">
        {/* General Settings */}
        <Card className="p-6 bg-black/50 backdrop-blur-sm border-green-500/20">
          <h2 className="text-lg font-semibold text-white mb-4">General</h2>
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="site-name">Site Name</Label>
              <Input
                id="site-name"
                placeholder="Matrix Mingle"
                className="bg-black/50 border-green-500/20 text-white"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="site-description">Site Description</Label>
              <Input
                id="site-description"
                placeholder="Your AI companion platform"
                className="bg-black/50 border-green-500/20 text-white"
              />
            </div>
          </div>
        </Card>

        {/* Features Settings */}
        <Card className="p-6 bg-black/50 backdrop-blur-sm border-green-500/20">
          <h2 className="text-lg font-semibold text-white mb-4">Features</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>User Registration</Label>
                <p className="text-sm text-gray-400">
                  Allow new users to register
                </p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Public Profiles</Label>
                <p className="text-sm text-gray-400">
                  Make user profiles public
                </p>
              </div>
              <Switch />
            </div>
          </div>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600">
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
