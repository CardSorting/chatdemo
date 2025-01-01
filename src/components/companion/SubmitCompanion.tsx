import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { useAuth } from "../../lib/auth";
import { createCompanion } from "../../lib/companions";
import { supabase } from "../../lib/supabase";
import {
  Bot,
  Loader2,
  Info,
  Upload,
  Sparkles,
  Tags,
  Link2,
  AlertCircle,
  Image,
} from "lucide-react";

const SubmitCompanion = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    avatar_url: "",
    chat_url: "",
    tags: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!user) throw new Error("You must be logged in to submit a companion");

      const companionData = {
        name: formData.name,
        description: formData.description,
        avatar_url:
          formData.avatar_url ||
          `https://api.dicebear.com/7.x/bottts/svg?seed=${formData.name}`,
        chat_url: formData.chat_url,
        creator_id: user.id,
        creator_name:
          profile?.full_name || user.email?.split("@")[0] || "Anonymous",
        likes_count: 0,
        messages_count: 0,
        tags: formData.tags.split(",").map((tag) => tag.trim()),
      };

      await createCompanion(companionData);
      navigate("/");
    } catch (error) {
      console.error("Error submitting companion:", error);
      setError(
        error.message || "An error occurred while submitting your companion",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      // Ensure the avatars bucket exists
      const { data: buckets } = await supabase.storage.listBuckets();
      if (!buckets?.some(b => b.name === 'avatars')) {
        await supabase.storage.createBucket('avatars', {
          public: true,
          allowedMimeTypes: ['image/*'],
          fileSizeLimit: 1024 * 1024 * 5 // 5MB
        });
      }

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;

      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(fileName, file);

      if (error) throw error;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(data.path);

      setFormData({ ...formData, avatar_url: urlData.publicUrl });
      setPreviewUrl(urlData.publicUrl);
    } catch (error) {
      console.error("Error uploading avatar:", error);
      setError(error.message || "Failed to upload avatar");
    } finally {
      setUploading(false);
    }
  };

  const getPreviewImage = () => {
    if (previewUrl) {
      return previewUrl;
    }
    if (formData.name) {
      return `https://api.dicebear.com/7.x/bottts/svg?seed=${formData.name}`;
    }
    return "https://api.dicebear.com/7.x/bottts/svg?seed=placeholder";
  };

  return (
    <div className="min-h-screen w-full bg-black p-4 md:p-8">
      {/* Matrix-style background overlay */}
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjEiIGZpbGw9InJnYmEoMCwyNTUsMCwwLjEpIi8+PC9nPjwvc3ZnPg==')] opacity-20 pointer-events-none animate-matrix-rain" />

      <div className="max-w-4xl mx-auto relative">
        <Card className="p-8 bg-black/50 backdrop-blur-sm border-green-500/20">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 rounded-full bg-green-500/10">
              <Bot className="w-8 h-8 text-green-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-blue-500">
                Submit Your Companion
              </h1>
              <p className="text-gray-400">
                Share your AI companion with the Matrix Mingle community
              </p>
            </div>
          </div>

          {/* Quick Guide */}
          <div className="mb-8 p-6 bg-green-500/5 border border-green-500/20 rounded-lg relative overflow-hidden">
            <Sparkles className="absolute top-2 right-2 w-5 h-5 text-green-500/40" />
            <h3 className="flex items-center gap-2 text-green-400 font-semibold mb-4">
              <Info className="w-5 h-5" />
              Submission Guidelines
            </h3>
            <ul className="text-sm text-gray-400 space-y-2 list-none">
              <li className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-green-500" />
                Choose a memorable name that reflects your companion's personality
              </li>
              <li className="flex items-center gap-2">
                <Upload className="w-4 h-4 text-green-500" />
                Upload an avatar image (JPG/PNG, max 5MB)
              </li>
              <li className="flex items-center gap-2">
                <Tags className="w-4 h-4 text-green-500" />
                Add relevant tags to help users find your companion
              </li>
              <li className="flex items-center gap-2">
                <Link2 className="w-4 h-4 text-green-500" />
                Include the URL where users can chat with your companion
              </li>
            </ul>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Preview Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white">
                Companion Preview
              </h2>
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
                <Card className="relative p-4 bg-black/60 backdrop-blur-sm border-green-500/20 flex items-center gap-4">
                  <img
                    src={getPreviewImage()}
                    alt="Avatar preview"
                    className="w-20 h-20 rounded-full border-2 border-green-500/50"
                  />
                  <div>
                    <h3 className="text-xl font-semibold text-white">
                      {formData.name || "Your Companion Name"}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {formData.description ||
                        "Companion description will appear here"}
                    </p>
                  </div>
                </Card>
              </div>
            </div>

            {/* Companion Details Section */}
            <div className="space-y-8">
              <h2 className="text-xl font-semibold text-white">
                Companion Details
              </h2>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-200">
                    Companion Name *
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="bg-black/50 border-green-500/20 text-white focus:border-green-500 transition-colors"
                    placeholder="e.g., PhilosopherBot"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-gray-200">
                    Description *
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="bg-black/50 border-green-500/20 text-white min-h-[120px] focus:border-green-500 transition-colors"
                    placeholder="Describe your companion's personality, expertise, and what makes them unique..."
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="avatar" className="text-gray-200">
                    Avatar Image
                  </Label>
                  <div className="flex items-center gap-4">
                    <input
                      type="file"
                      id="avatar"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      className="hidden"
                      accept="image/*"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="bg-black/50 border-green-500/20 text-white hover:bg-black/70 hover:border-green-500/40"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                    >
                      {uploading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Image className="mr-2 h-4 w-4" />
                      )}
                      {uploading ? "Uploading..." : "Upload Avatar"}
                    </Button>
                    <p className="text-xs text-gray-400">
                      JPG/PNG, max 5MB
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Connection Details Section */}
            <div className="space-y-8">
              <h2 className="text-xl font-semibold text-white">
                Connection Details
              </h2>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="chat_url" className="text-gray-200">
                    Chat URL *
                  </Label>
                  <Input
                    id="chat_url"
                    value={formData.chat_url}
                    onChange={(e) =>
                      setFormData({ ...formData, chat_url: e.target.value })
                    }
                    className="bg-black/50 border-green-500/20 text-white focus:border-green-500 transition-colors"
                    placeholder="https://example.com/chat"
                    type="url"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags" className="text-gray-200">
                    Tags *
                  </Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) =>
                      setFormData({ ...formData, tags: e.target.value })
                    }
                    className="bg-black/50 border-green-500/20 text-white focus:border-green-500 transition-colors"
                    placeholder="e.g., Philosophy, Science, Art (comma-separated)"
                    required
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-400 bg-red-500/10 p-4 rounded-lg border border-red-500/20">
                <AlertCircle className="w-5 h-5" />
                {error}
              </div>
            )}

            <div className="flex items-center justify-between pt-6 border-t border-green-500/20">
              <p className="text-sm text-gray-400">
                Your submission will be reviewed by our moderators
              </p>
              <Button
                type="submit"
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-8"
                disabled={loading || uploading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Submit Companion
                  </>
                )}
              </Button>
            </div>
          </form>
        </Card>
      </div>

      {/* Decorative Elements */}
      <div className="fixed top-1/4 left-1/4 w-64 h-64 bg-green-500/20 rounded-full blur-3xl animate-pulse-slow pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse-slow pointer-events-none" />
    </div>
  );
};

export default SubmitCompanion;
