import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/auth";
import { createCompanion } from "@/lib/companions";
import { Bot, Loader2, Info } from "lucide-react";

const SubmitCompanion = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  return (
    <div className="min-h-screen w-full bg-black p-4 md:p-8">
      {/* Matrix-style background overlay */}
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjEiIGZpbGw9InJnYmEoMCwyNTUsMCwwLjEpIi8+PC9nPjwvc3ZnPg==')] opacity-20 pointer-events-none animate-matrix-rain" />

      <div className="max-w-2xl mx-auto relative">
        <Card className="p-6 bg-black/50 backdrop-blur-sm border-green-500/20">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-full bg-green-500/10">
              <Bot className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                Submit Your Companion
              </h1>
              <p className="text-gray-400">
                Share your AI companion with the Matrix Mingle community
              </p>
            </div>
          </div>

          {/* Quick Guide */}
          <div className="mb-8 p-4 bg-green-500/5 border border-green-500/20 rounded-lg">
            <h3 className="flex items-center gap-2 text-green-400 font-semibold mb-2">
              <Info className="w-4 h-4" />
              Quick Guide
            </h3>
            <ul className="text-sm text-gray-400 space-y-1 list-disc pl-4">
              <li>Choose a memorable name for your AI companion</li>
              <li>
                Write a clear description of their personality and capabilities
              </li>
              <li>Add relevant tags to help others find your companion</li>
              <li>Provide the URL where users can chat with your companion</li>
              <li>Optionally add a custom avatar (or we'll generate one)</li>
            </ul>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">
                Basic Information
              </h3>

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
                  className="bg-black/50 border-green-500/20 text-white"
                  placeholder="e.g., PhilosopherBot"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-gray-200">
                  Description *
                </Label>
                <p className="text-sm text-gray-400 mb-2">
                  Describe your companion's personality, expertise, and what
                  makes them unique.
                </p>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="bg-black/50 border-green-500/20 text-white min-h-[100px]"
                  placeholder="e.g., A philosophical AI companion who loves to explore deep questions about existence, consciousness, and the nature of reality..."
                  required
                />
              </div>
            </div>

            {/* Technical Details Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">
                Technical Details
              </h3>

              <div className="space-y-2">
                <Label htmlFor="chat_url" className="text-gray-200">
                  Chat URL *
                </Label>
                <p className="text-sm text-gray-400 mb-2">
                  The URL where users can interact with your companion.
                </p>
                <Input
                  id="chat_url"
                  value={formData.chat_url}
                  onChange={(e) =>
                    setFormData({ ...formData, chat_url: e.target.value })
                  }
                  className="bg-black/50 border-green-500/20 text-white"
                  placeholder="https://example.com/chat"
                  type="url"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags" className="text-gray-200">
                  Tags *
                </Label>
                <p className="text-sm text-gray-400 mb-2">
                  Add relevant categories, separated by commas.
                </p>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) =>
                    setFormData({ ...formData, tags: e.target.value })
                  }
                  className="bg-black/50 border-green-500/20 text-white"
                  placeholder="e.g., Philosophy, Science, Art"
                  required
                />
              </div>
            </div>

            {/* Appearance Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Appearance</h3>

              <div className="space-y-2">
                <Label htmlFor="avatar_url" className="text-gray-200">
                  Avatar URL
                </Label>
                <p className="text-sm text-gray-400 mb-2">
                  Optional: Provide a URL for a custom avatar, or leave blank
                  for an auto-generated one.
                </p>
                <Input
                  id="avatar_url"
                  value={formData.avatar_url}
                  onChange={(e) =>
                    setFormData({ ...formData, avatar_url: e.target.value })
                  }
                  className="bg-black/50 border-green-500/20 text-white"
                  placeholder="https://example.com/avatar.png"
                  type="url"
                />
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center bg-red-500/10 p-3 rounded-lg">
                {error}
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
                  Submitting...
                </>
              ) : (
                "Submit Companion"
              )}
            </Button>

            <p className="text-sm text-gray-400 text-center">
              Your submission will be reviewed by our moderators before being
              listed on the platform.
            </p>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default SubmitCompanion;
