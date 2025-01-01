import React, { useState } from "react";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";
import { useProfile } from "../../hooks/useProfile";
import ProfileInformationForm from "./settings/ProfileInformationForm";
import AccountActions from "./settings/AccountActions";

const UserSettings = () => {
  const { profile, loading, error, updateProfile } = useProfile();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || "",
    username: profile?.username || "",
    bio: profile?.bio || "",
    website: profile?.website || "",
    avatar_url: profile?.avatar_url || "",
    email_notifications: profile?.email_notifications || false,
    visibility: profile?.visibility || "public",
    theme: profile?.theme || "dark",
  });

  const handleFormDataChange = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^a-zA-Z0-9_]/g, "").toLowerCase();
    handleFormDataChange("username", value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const success = await updateProfile(formData);
    if (success) {
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    } else {
      toast({
        title: "Update Failed",
        description: error || "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAccount = async () => {
    // Implement account deletion logic
  };

  // Convert form data to match ProfileFormData type
  const profileFormData = {
    fullName: formData.full_name,
    username: formData.username,
    bio: formData.bio,
    website: formData.website,
    avatarUrl: formData.avatar_url,
    emailNotifications: formData.email_notifications,
    profileVisibility: formData.visibility,
    theme: formData.theme,
  };

  return (
    <div className="min-h-screen w-full bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Settings</h1>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <ProfileInformationForm
            formData={profileFormData}
            onUsernameChange={handleUsernameChange}
            onFormDataChange={(key, value) => {
              // Convert back to internal form data format
              const internalKey = key
                .replace(/([A-Z])/g, '_$1')
                .toLowerCase();
              handleFormDataChange(internalKey, value);
            }}
          />

          <AccountActions onDeleteAccount={handleDeleteAccount} />

          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserSettings;
