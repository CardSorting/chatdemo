import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
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
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    avatar_url: "",
    chat_url: "",
    tags: "",
  });

  useEffect(() => {
    // Fetch categories from database
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*');
      
      if (error) {
        console.error('Error fetching categories:', error);
        return;
      }
      
      setCategories(data);
    };

    fetchCategories();
  }, []);

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
        categories: selectedCategories,
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

  // ... (rest of the existing code remains the same until the form section)

  return (
    <div className="min-h-screen w-full bg-black p-4 md:p-8">
      {/* ... (existing background and card setup) ... */}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* ... (existing preview section) ... */}

        {/* Companion Details Section */}
        <div className="space-y-8">
          <h2 className="text-xl font-semibold text-white">
            Companion Details
          </h2>
          <div className="space-y-6">
            {/* ... (existing name and description fields) ... */}

            {/* Categories Field */}
            <div className="space-y-2">
              <Label htmlFor="categories" className="text-gray-200">
                Categories *
              </Label>
              <Select
                onValueChange={(value) => 
                  setSelectedCategories(prev => [...prev, value])
                }
              >
                <SelectTrigger className="bg-black/50 border-green-500/20 text-white focus:border-green-500 transition-colors">
                  <SelectValue placeholder="Select categories" />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border-green-500/20">
                  {categories.map((category) => (
                    <SelectItem 
                      key={category.id} 
                      value={category.id}
                      className="hover:bg-green-500/10 focus:bg-green-500/10"
                    >
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedCategories.map((categoryId) => {
                  const category = categories.find(c => c.id === categoryId);
                  return (
                    <div
                      key={categoryId}
                      className="px-3 py-1 text-sm bg-green-500/10 text-green-400 rounded-full flex items-center gap-2"
                    >
                      {category?.name}
                      <button
                        type="button"
                        onClick={() => 
                          setSelectedCategories(prev => 
                            prev.filter(id => id !== categoryId)
                          )
                        }
                        className="text-green-500 hover:text-green-400"
                      >
                        ×
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ... (rest of the existing form fields) ... */}
          </div>
        </div>

        {/* ... (rest of the existing form) ... */}
      </form>
    </div>
  );
};

export default SubmitCompanion;
