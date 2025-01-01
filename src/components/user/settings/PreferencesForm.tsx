import React from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Globe } from "lucide-react";
import { ProfileFormData } from "@/types/profile";

interface PreferencesFormProps {
  formData: ProfileFormData;
  onFormDataChange: (key: keyof ProfileFormData, value: any) => void;
}

const PreferencesForm = ({
  formData,
  onFormDataChange,
}: PreferencesFormProps) => {
  return (
    <Card className="p-6 bg-black/50 backdrop-blur-sm border-green-500/20">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <Globe className="w-5 h-5 text-blue-500" />
        Preferences
      </h3>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">Email Notifications</Label>
            <p className="text-sm text-gray-400">
              Receive email notifications about activity
            </p>
          </div>
          <Switch
            checked={formData.emailNotifications}
            onCheckedChange={(checked) =>
              onFormDataChange("emailNotifications", checked)
            }
            className="data-[state=checked]:bg-green-500"
          />
        </div>

        <Separator className="border-green-500/20" />

        <div className="space-y-2">
          <Label htmlFor="visibility">Profile Visibility</Label>
          <Select
            value={formData.profileVisibility}
            onValueChange={(value) =>
              onFormDataChange("profileVisibility", value)
            }
          >
            <SelectTrigger className="bg-black/50 border-green-500/20 text-white">
              <SelectValue placeholder="Select visibility" />
            </SelectTrigger>
            <SelectContent className="bg-black/90 border-green-500/20">
              <SelectItem value="public">Public</SelectItem>
              <SelectItem value="private">Private</SelectItem>
              <SelectItem value="followers">Followers Only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator className="border-green-500/20" />

        <div className="space-y-2">
          <Label htmlFor="theme">Theme</Label>
          <Select
            value={formData.theme}
            onValueChange={(value) => onFormDataChange("theme", value)}
          >
            <SelectTrigger className="bg-black/50 border-green-500/20 text-white">
              <SelectValue placeholder="Select theme" />
            </SelectTrigger>
            <SelectContent className="bg-black/90 border-green-500/20">
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  );
};

export default PreferencesForm;
