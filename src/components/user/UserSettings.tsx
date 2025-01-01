import React, { useState } from "react";
import { useProfileSettings } from "../../hooks/useProfileSettings";
import ProfileInformationForm from "./settings/ProfileInformationForm";
import AccountActions from "./settings/AccountActions";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";

const UserSettings = () => {
  const {
    formData,
    handleUsernameChange,
    handleFormDataChange,
    updateProfile,
    loading,
  } = useProfileSettings();
  const [error, setError] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    try {
      await updateProfile();
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (err) {
      setError(err.message || "Failed to update profile");
      toast({
        title: "Update Failed",
        description: error,
        variant: "destructive",
      });
    }
  };

  const handleDeleteAccount = async () => {
    // Implement account deletion logic
  };

  return (
    <div className="min-h-screen w-full bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Settings</h1>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <ProfileInformationForm
            formData={formData}
            onUsernameChange={handleUsernameChange}
            onFormDataChange={handleFormDataChange}
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
