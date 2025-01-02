import { useMutation, useQueryClient } from "@tanstack/react-query";
import { likeCompanion } from "../services/companion/companionService";
import { useToast } from "../components/ui/use-toast";
import { useState } from "react";
import { useAuth } from "./useAuth";

export const useCompanionLikes = (companionId: string, initialLikesCount: number) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [localLikesCount, setLocalLikesCount] = useState(initialLikesCount);

  const likeMutation = useMutation({
    mutationFn: () => likeCompanion(companionId),
    onSuccess: () => {
      setLocalLikesCount(prev => prev + 1);
      setIsLiked(true);
      queryClient.invalidateQueries({ queryKey: ['companions'] });
      toast({
        title: "Liked!",
        description: "Your like has been recorded.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to like companion",
        variant: "destructive",
      });
    }
  });

  const handleLike = () => {
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

  return {
    isLiked,
    localLikesCount,
    handleLike,
    isPending: likeMutation.isPending,
    isError: likeMutation.isError
  };
};