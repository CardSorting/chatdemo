import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ArrowRight,
  Heart,
  MessageCircle,
  Sparkles,
  Search,
  Filter,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Companion } from "@/lib/companions";

interface CompanionGridProps {
  companions: Companion[];
}

const CompanionGrid = ({ companions }: CompanionGridProps) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Get unique tags
  const allTags = Array.from(
    new Set(companions.flatMap((companion) => companion.tags)),
  ).sort();

  // Filter companions
  const filteredCompanions = companions.filter((companion) => {
    const matchesSearch = companion.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesTag = !selectedTag || companion.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  if (companions.length === 0) {
    return (
      <Card className="p-8 bg-black/50 backdrop-blur-sm border-green-500/20 text-center">
        <Sparkles className="w-8 h-8 text-green-500 mx-auto mb-4" />
        <p className="text-gray-400 mb-2">No companions created yet</p>
        <Button
          onClick={() => navigate("/submit")}
          className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
        >
          Create Your First Companion
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search companions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-black/50 border-green-500/20 text-white w-full"
          />
        </div>
        <ScrollArea className="w-full md:w-auto">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedTag(null)}
              className={`shrink-0 ${!selectedTag ? "bg-green-500/20 border-green-500 text-green-500" : "border-green-500/20 text-gray-400 hover:text-green-500 hover:border-green-500"}`}
            >
              <Filter className="w-4 h-4 mr-2" />
              All
            </Button>
            {allTags.map((tag) => (
              <Button
                key={tag}
                variant="outline"
                size="sm"
                onClick={() => setSelectedTag(tag)}
                className={`shrink-0 ${selectedTag === tag ? "bg-green-500/20 border-green-500 text-green-500" : "border-green-500/20 text-gray-400 hover:text-green-500 hover:border-green-500"}`}
              >
                {tag}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCompanions.map((companion) => (
          <Card
            key={companion.id}
            className="group relative bg-black/40 backdrop-blur-sm border-green-500/20 hover:border-green-500/40 transition-all duration-500 overflow-hidden transform hover:scale-[1.02] hover:-translate-y-1"
          >
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 via-green-500/5 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="p-6 space-y-4 relative">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={companion.avatar_url}
                    alt={companion.name}
                    className="w-16 h-16 rounded-full border-2 border-green-500/50 group-hover:border-green-500 transition-colors duration-300"
                  />
                  <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white group-hover:text-green-400 transition-colors duration-300">
                    {companion.name}
                  </h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {companion.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 border border-green-500/20"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <p className="text-gray-300 group-hover:text-gray-200 transition-colors duration-300">
                {companion.description}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-green-500/20">
                <div className="flex items-center gap-4">
                  <span className="text-gray-400 flex items-center gap-2">
                    <Heart className="w-4 h-4" />
                    {companion.likes_count}
                  </span>
                  <span className="text-gray-400 flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    {companion.messages_count}
                  </span>
                </div>
                <Button
                  onClick={() => navigate(`/chat/${companion.id}`)}
                  className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white gap-2 group/btn"
                  size="sm"
                >
                  Chat
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredCompanions.length === 0 && (
        <Card className="p-8 bg-black/50 backdrop-blur-sm border-green-500/20 text-center">
          <p className="text-gray-400">
            No companions found matching your search
          </p>
        </Card>
      )}
    </div>
  );
};

export default CompanionGrid;
