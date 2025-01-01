import React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { User, Link, Image, AtSign } from "lucide-react";
import { ProfileFormData } from "@/types/profile";

interface ProfileInformationFormProps {
  formData: ProfileFormData;
  onUsernameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFormDataChange: (key: keyof ProfileFormData, value: string) => void;
}

const ProfileInformationForm = ({
  formData,
  onUsernameChange,
  onFormDataChange,
}: ProfileInformationFormProps) => {
  return (
    <Card className="p-6 bg-black/50 backdrop-blur-sm border-green-500/20">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <User className="w-5 h-5 text-green-500" />
        Profile Information
      </h3>

      <div className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="fullName">Display Name</Label>
          <Input
            id="fullName"
            value={formData.fullName}
            onChange={(e) => onFormDataChange("fullName", e.target.value)}
            className="bg-black/50 border-green-500/20 text-white"
            placeholder="Your display name"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="username" className="flex items-center gap-1">
            <AtSign className="w-4 h-4 text-green-500" />
            Username
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-gray-400">@</span>
            <Input
              id="username"
              value={formData.username}
              onChange={onUsernameChange}
              className="pl-8 bg-black/50 border-green-500/20 text-white"
              placeholder="username"
              pattern="^[a-zA-Z0-9_]+$"
              title="Username can only contain letters, numbers, and underscores"
              required
            />
          </div>
          <p className="text-xs text-gray-400">
            Only letters, numbers, and underscores allowed
          </p>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            value={formData.bio}
            onChange={(e) => onFormDataChange("bio", e.target.value)}
            className="bg-black/50 border-green-500/20 text-white min-h-[100px]"
            placeholder="Tell us about yourself"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="website">Website</Label>
          <div className="relative">
            <Link className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="website"
              type="url"
              value={formData.website}
              onChange={(e) => onFormDataChange("website", e.target.value)}
              className="pl-10 bg-black/50 border-green-500/20 text-white"
              placeholder="https://your-website.com"
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="avatarUrl">Avatar URL</Label>
          <div className="relative">
            <Image className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="avatarUrl"
              type="url"
              value={formData.avatarUrl}
              onChange={(e) => onFormDataChange("avatarUrl", e.target.value)}
              className="pl-10 bg-black/50 border-green-500/20 text-white"
              placeholder="https://example.com/avatar.png"
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProfileInformationForm;
