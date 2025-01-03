import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { useToast } from "@components/ui/use-toast";
import { useAuth } from "@hooks/useAuth";
import { bookmarkCompanion } from "@services/companion/companionService";
import { Bookmark, BookmarkCheck, Sparkles } from "lucide-react";

interface CompanionCardProps {
  companion: {
    id: string;
    name: string;
    creator_name: string | null;
    creator_username: string | null;
    avatar_url?: string;
    chat_url?: string;
  };
}

const setTypes = ["Genesis", "Celestial", "Quantum", "Neo", "Alpha"];

const CompanionCard = ({ companion }: CompanionCardProps) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [setInfo] = useState({
    series: setTypes[Math.floor(Math.random() * setTypes.length)],
    number: (Math.floor(Math.random() * 999) + 1).toString().padStart(3, "0")
  });

  const bookmarkMutation = useMutation({
    mutationFn: () => bookmarkCompanion(companion.id),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["companions"] });
      setIsBookmarked(true);
      return { previousCompanions: queryClient.getQueryData(["companions"]) };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companions"] });
      toast({ title: "Bookmarked!", description: "Added to your collection" });
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(["companions"], context?.previousCompanions);
      setIsBookmarked(false);
      toast({
        title: "Error",
        description: "Failed to bookmark companion",
        variant: "destructive",
      });
    },
  });

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to bookmark companions",
        variant: "destructive",
      });
      return;
    }
    bookmarkMutation.mutate();
  };

  return (
    <Card className="group relative w-full max-w-sm mx-auto overflow-hidden rounded-2xl bg-gray-950">
      {/* Animated Border Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl opacity-75">
        <div className="absolute inset-0 animate-border-flow" />
      </div>
      
      {/* Animated Glow Effects */}
      <div className="absolute inset-0 rounded-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/50 to-purple-500/50 blur-2xl opacity-0 group-hover:opacity-70 transition-all duration-700" />
        <div className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_0deg,purple_90deg,transparent_180deg)] animate-spin-slow opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      </div>

      {/* Card Content */}
      <div className="relative m-[2px] bg-gray-950 rounded-2xl z-20 overflow-hidden backdrop-blur-sm">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800/30 bg-gray-900/50">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-400 animate-pulse" />
            <span className="text-sm font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              #{setInfo.number}
            </span>
          </div>
          <span className="text-sm font-medium bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            {setInfo.series}
          </span>
        </div>

        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden">
          <Avatar className="w-full h-full rounded-none">
            <AvatarImage 
              src={companion.avatar_url} 
              className="object-cover w-full h-full transition-all duration-1000 ease-out group-hover:scale-110"
            />
            <AvatarFallback className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900">
              {companion.name[0]}
            </AvatarFallback>
          </Avatar>
          
          {/* Image Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent opacity-60" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_0%,rgba(0,0,0,0.8)_100%)] opacity-0 group-hover:opacity-100 transition-all duration-700" />
          
          {/* Title */}
          <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-gray-950 via-gray-950/90 to-transparent transform translate-y-0 group-hover:translate-y-0 transition-transform duration-500">
            <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-center mb-1 opacity-100 transform group-hover:scale-105 transition-all duration-500">
              {companion.name}
            </h3>
            <p className="text-sm text-gray-400 text-center transform group-hover:translate-y-0 transition-transform duration-500">
              by {companion.creator_name || companion.creator_username || 'Unknown Creator'}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="flex gap-2">
            <Button
              asChild
              className="flex-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-medium 
                         shadow-lg hover:shadow-blue-500/25 transform transition-all duration-500 
                         hover:scale-[1.02] active:scale-95 group-hover:shadow-xl
                         before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent 
                         before:via-white/20 before:to-transparent before:translate-x-[-200%] 
                         hover:before:translate-x-[200%] before:transition-transform before:duration-700"
            >
              <a href={`/companions/${companion.id}`}>
                Discover {companion.name}
              </a>
            </Button>
            <Button
              onClick={handleBookmarkClick}
              variant="ghost"
              className="p-2 bg-gray-800/50 hover:bg-gray-700/50 transition-all duration-300 
                         transform hover:scale-105 active:scale-95"
            >
              {isBookmarked ? (
                <BookmarkCheck className="w-5 h-5 text-blue-400 animate-bookmark" />
              ) : (
                <Bookmark className="w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors duration-300" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CompanionCard;

// Add to your global CSS
const style = `
@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes border-flow {
  0%, 100% { clip-path: inset(0 0 98% 0); }
  25% { clip-path: inset(0 98% 0 0); }
  50% { clip-path: inset(98% 0 0 0); }
  75% { clip-path: inset(0 0 0 98%); }
}

@keyframes bookmark {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

.animate-border-flow {
  animation: border-flow 4s linear infinite;
}

.animate-spin-slow {
  animation: spin-slow 4s linear infinite;
}

.animate-bookmark {
  animation: bookmark 0.3s ease-in-out;
}
`
