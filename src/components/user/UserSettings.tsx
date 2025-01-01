import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useProfileSettings } from "@/hooks/useProfileSettings";
import ProfileInformationForm from "./settings/ProfileInformationForm";
import PreferencesForm from "./settings/PreferencesForm";
import AccountActions from "./settings/AccountActions";

const UserSettings = () => {
  const navigate = useNavigate();
  const {
    formData,
    loading,
    error,
    success,
    handleFormDataChange,
    handleUsernameChange,
    updateProfile,
  } = useProfileSettings();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile();
  };

  const handleDeleteAccount = async () => {
    try {
      const { error } = await supabase.rpc("delete_user_account", {
        user_id: (await supabase.auth.getUser()).data.user?.id,
      });

      if (error) throw error;

      await supabase.auth.signOut();
      navigate("/");
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <ProfileInformationForm
        formData={formData}
        onUsernameChange={handleUsernameChange}
        onFormDataChange={handleFormDataChange}
      />

      <PreferencesForm
        formData={formData}
        onFormDataChange={handleFormDataChange}
      />

      <AccountActions onDeleteAccount={handleDeleteAccount} />

      {/* Status Messages */}
      {error && (
        <div className="text-red-500 text-sm bg-red-500/10 border border-red-500/20 rounded-md p-3">
          {error}
        </div>
      )}

      {success && (
        <div className="text-green-500 text-sm bg-green-500/10 border border-green-500/20 rounded-md p-3">
          {success}
        </div>
      )}

      {/* Save Button */}
      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          "Save Changes"
        )}
      </Button>
    </form>
  );
};

export default UserSettings;
