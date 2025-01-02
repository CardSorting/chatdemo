import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { useToast } from "@components/ui/use-toast";
import { useAuth } from "@hooks/useAuth";
import { bookmarkCompanion } from "@services/companion/companionService";

interface Companion {
  id: string;
  name: string;
  creator_name: string;
  avatar_url?: string;
  description?: string;
  messages_count: number;
  chat_url?: string;
}

interface CompanionCardProps {
  companion: Companion;
}

const CompanionCard = ({ companion }: CompanionCardProps) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { toast } = useToast();

  // Local state for bookmark status
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Define the bookmark mutation
  const bookmarkMutation = useMutation({
    mutationFn: () => bookmarkCompanion(companion.id),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["companions"] });
      const previousCompanions = queryClient.getQueryData(["companions"]);
      setIsBookmarked(true);
      return { previousCompanions };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companions"] });
      toast({
        title: "Bookmarked!",
        description: "Companion added to your bookmarks",
      });
    },
    onError: (_error, _variables, context) => {
      if (context?.previousCompanions) {
        queryClient.setQueryData(["companions"], context.previousCompanions);
      }
      setIsBookmarked(false);
      toast({
        title: "Error",
        description: "Failed to bookmark companion",
        variant: "destructive",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["companions"] });
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
    <Card className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex flex-col h-full relative">
      {/* Bookmark button - positioned at top right */}
      <button
        onClick={handleBookmarkClick}
        className="absolute top-4 right-4 z-10 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        aria-label="Bookmark companion"
      >
        <div
          className={`w-8 h-8 flex items-center justify-center rounded-full border ${
            isBookmarked
              ? "bg-blue-100 border-blue-300"
              : "bg-gray-100 border-gray-300 dark:bg-gray-700 dark:border-gray-600"
          }`}
        >
          <span
            className={`text-sm ${
              isBookmarked ? "text-blue-500" : "text-gray-500 dark:text-gray-400"
            }`}
          >
            📌
          </span>
        </div>
      </button>

      {/* Header section */}
      <div className="flex items-center gap-4 mb-6">
        <Avatar className="w-12 h-12">
          <AvatarImage src={companion.avatar_url} />
          <AvatarFallback className="bg-gray-300 dark:bg-gray-600 text-white">
            {companion.name[0]}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {companion.name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {companion.creator_name}
          </p>
        </div>
      </div>

      {/* Description section */}
      <div className="mb-6 h-32 overflow-y-auto">
        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
          {companion.description}
        </p>
      </div>

      {/* Chat button */}
      <div className="mt-auto flex justify-end">
        <Button
          asChild
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <a
            href={companion.chat_url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Chat
          </a>
        </Button>
      </div>
    </Card>
  );
};

export default CompanionCard;