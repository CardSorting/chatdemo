import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, User } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";

const UserSettings = () => {
  const { user, profile } = useAuth();
  const [displayName, setDisplayName] = useState(profile?.full_name || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const { error } = await supabase
        .from("profiles")
        .update({ full_name: displayName })
        .eq("id", user.id);

      if (error) throw error;
      setSuccess("Display name updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Failed to update display name");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 bg-black/50 backdrop-blur-sm border-green-500/20">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <User className="w-6 h-6 text-green-500" />
        Profile Settings
      </h2>

      <form onSubmit={handleUpdateProfile} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="displayName">Display Name</Label>
          <Input
            id="displayName"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="bg-black/50 border-green-500/20 text-white"
            placeholder="Enter your display name"
            required
          />
        </div>

        {error && (
          <div className="text-red-500 text-sm bg-red-500/10 border border-red-500/20 rounded-md p-2">
            {error}
          </div>
        )}

        {success && (
          <div className="text-green-500 text-sm bg-green-500/10 border border-green-500/20 rounded-md p-2">
            {success}
          </div>
        )}

        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : (
            "Update Profile"
          )}
        </Button>
      </form>
    </Card>
  );
};

export default UserSettings;
