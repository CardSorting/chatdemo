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
    onMutate: async () => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['companions'] });
      
      // Snapshot the previous value
      const previousCompanions = queryClient.getQueryData(['companions']);

      // Optimistically update the UI
      setLocalLikesCount(prev => prev + 1);
      setIsLiked(true);

      // Return a context object with the snapshotted value
      return { previousCompanions };
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['companions'] });
      toast({
        title: "Liked!",
        description: "Your like has been recorded.",
      });
    },
    onError: (error, _variables, context) => {
      // Rollback to the previous value
      if (context?.previousCompanions) {
        queryClient.setQueryData(['companions'], context.previousCompanions);
      }
      setLocalLikesCount(initialLikesCount);
      setIsLiked(false);
      toast({
        title: "Error",
        description: "Failed to like companion",
        variant: "destructive",
      });
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['companions'] });
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