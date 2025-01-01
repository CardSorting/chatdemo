import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";

interface AvatarUploadProps {
  currentAvatarUrl: string;
  onAvatarChange: (url: string) => void;
}

const AvatarUpload = ({
  currentAvatarUrl,
  onAvatarChange,
}: AvatarUploadProps) => {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setError("");
      setUploading(true);

      const file = e.target.files?.[0];
      if (!file) return;

      // Validate file type
      if (!file.type.startsWith("image/")) {
        throw new Error("Please upload an image file");
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error("File size must be less than 5MB");
      }

      // Delete old avatar if exists
      if (currentAvatarUrl) {
        const oldPath = currentAvatarUrl.split("/").pop();
        if (oldPath) {
          await supabase.storage
            .from("avatars")
            .remove([`${user?.id}/${oldPath}`]);
        }
      }

      // Upload new avatar
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).slice(2)}.${fileExt}`;
      const filePath = `${user?.id}/${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(filePath);

      onAvatarChange(publicUrl);
    } catch (error) {
      console.error("Error uploading avatar:", error);
      setError(error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveAvatar = async () => {
    try {
      setError("");
      setUploading(true);

      if (currentAvatarUrl) {
        const path = currentAvatarUrl.split("/").pop();
        if (path) {
          await supabase.storage
            .from("avatars")
            .remove([`${user?.id}/${path}`]);
        }
      }

      onAvatarChange("");
    } catch (error) {
      console.error("Error removing avatar:", error);
      setError(error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="p-6 bg-black/50 backdrop-blur-sm border-green-500/20">
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="relative group">
            <img
              src={
                currentAvatarUrl ||
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id}`
              }
              alt="Avatar"
              className="w-24 h-24 rounded-full border-2 border-green-500/50 group-hover:border-green-400 transition-all duration-300"
            />
            {uploading && (
              <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-green-500 animate-spin" />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="avatar" className="text-white">
              Profile Picture
            </Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="relative border-green-500/20 text-green-400 hover:bg-green-500/10"
                disabled={uploading}
              >
                <input
                  id="avatar"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={uploading}
                />
                <Upload className="w-4 h-4 mr-2" />
                Upload
              </Button>
              {currentAvatarUrl && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleRemoveAvatar}
                  className="border-red-500/20 text-red-400 hover:bg-red-500/10"
                  disabled={uploading}
                >
                  <X className="w-4 h-4 mr-2" />
                  Remove
                </Button>
              )}
            </div>
            <p className="text-xs text-gray-400">
              Recommended: Square image, max 5MB
            </p>
          </div>
        </div>

        {error && (
          <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-md p-2">
            {error}
          </div>
        )}
      </div>
    </Card>
  );
};

export default AvatarUpload;
