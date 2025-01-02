import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Companion } from "../../lib/companions";
import { useCompanionLikes } from "../../hooks/useCompanionLikes";

interface CompanionCardProps {
  companion: Companion;
}

const CompanionCard = ({ companion }: CompanionCardProps) => {
  const { isLiked, localLikesCount, handleLike } = useCompanionLikes(
    companion.id,
    companion.likes_count
  );

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleLike();
  };

  return (
    <Card className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex flex-col h-full relative">
      {/* Like button - positioned at top right */}
      <button
        onClick={handleLikeClick}
        className="absolute top-4 right-4 z-10 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        aria-label="Like companion"
      >
        <div className={`w-8 h-8 flex items-center justify-center rounded-full border ${
          isLiked 
            ? 'bg-red-100 border-red-300' 
            : 'bg-gray-100 border-gray-300 dark:bg-gray-700 dark:border-gray-600'
        }`}>
          <span className={`text-sm ${isLiked ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>❤️</span>
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

      {/* Stats section */}
      <div className="mt-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className={`text-sm ${
              isLiked ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'
            }`}>
              {localLikesCount} Likes
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {companion.messages_count} Messages
            </span>
          </div>
        </div>
        <Button
          asChild
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <a href={companion.chat_url} target="_blank" rel="noopener noreferrer">
            Chat
          </a>
        </Button>
      </div>
    </Card>
  );
};

export default CompanionCard;