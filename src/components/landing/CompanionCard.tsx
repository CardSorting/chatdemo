import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { useToast } from "@components/ui/use-toast";
import { useAuth } from "@hooks/useAuth";
import { likeCompanion } from "@services/companion/companionService";

interface Companion {
  id: string;
  name: string;
  creator_name: string;
  avatar_url?: string;
  description?: string;
  likes_count: number;
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

  // Local state for optimistic updates
  const [isLiked, setIsLiked] = useState(false);
  const [localLikesCount, setLocalLikesCount] = useState(companion.likes_count);

  // Define the like mutation
  const likeMutation = useMutation({
    mutationFn: () => likeCompanion(companion.id),
    onMutate: async () => {
      // Cancel any outgoing refetches so we don't overwrite optimistic updates
      await queryClient.cancelQueries({ queryKey: ["companions"] });

      // Snapshot the previous data
      const previousCompanions = queryClient.getQueryData(["companions"]);

      // Optimistically update the local UI
      setLocalLikesCount((prev) => prev + 1);
      setIsLiked(true);

      // Return context so we can roll back if there's an error
      return { previousCompanions };
    },
    onSuccess: () => {
      // Invalidate the companions query so React Query refetches data
      queryClient.invalidateQueries({ queryKey: ["companions"] });
      toast({
        title: "Liked!",
        description: "Your like has been recorded.",
      });
    },
    onError: (_error, _variables, context) => {
      // Roll back local changes if the mutation fails
      if (context?.previousCompanions) {
        queryClient.setQueryData(["companions"], context.previousCompanions);
      }
      setLocalLikesCount(companion.likes_count);
      setIsLiked(false);
      toast({
        title: "Error",
        description: "Failed to like companion",
        variant: "destructive",
      });
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ["companions"] });
    },
  });

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to like companions",
        variant: "destructive",
      });
      return;
    }
    if (!isLiked) {
      likeMutation.mutate();
    }
  };

  return (
    <Card className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex flex-col h-full relative">
      {/* Like button - positioned at top right */}
      <button
        onClick={handleLikeClick}
        className="absolute top-4 right-4 z-10 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        aria-label="Like companion"
      >
        <div
          className={`w-8 h-8 flex items-center justify-center rounded-full border ${
            isLiked
              ? "bg-red-100 border-red-300"
              : "bg-gray-100 border-gray-300 dark:bg-gray-700 dark:border-gray-600"
          }`}
        >
          <span
            className={`text-sm ${
              isLiked ? "text-red-500" : "text-gray-500 dark:text-gray-400"
            }`}
          >
            ❤️
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