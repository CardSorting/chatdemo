import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Companion } from "../../lib/companions";
import { getCompanionStats } from "../../services/companion/companionService";
import { Skeleton } from "../ui/skeleton";

interface CompanionCardProps {
  companion: Companion;
}

const CompanionCard = ({ companion }: CompanionCardProps) => {
  const { data: stats, isLoading, isError } = useQuery({
    queryKey: ['companionStats', companion.id],
    queryFn: () => getCompanionStats(companion.id)
  });

  return (
    <Card className="group relative p-6 bg-black/50 backdrop-blur-sm border-green-500/20 hover:border-green-500/40 transition-all duration-300 flex flex-col h-full hover:shadow-[0_0_15px_rgba(34,197,94,0.2)] hover:-translate-y-1">
      {/* Ambient glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-blue-500/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Header section */}
      <div className="flex items-center gap-4 mb-6 relative">
        <div className="relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-blue-500 rounded-full opacity-75 group-hover:opacity-100 blur transition-opacity" />
          <Avatar className="relative w-12 h-12 border-2 border-black/50 group-hover:border-transparent transition-colors">
            <AvatarImage src={companion.avatar_url} />
            <AvatarFallback className="bg-gradient-to-br from-green-500 to-blue-500 text-white">
              {companion.name[0]}
            </AvatarFallback>
          </Avatar>
        </div>
        <div>
          <h3 className="text-lg font-semibold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            {companion.name}
          </h3>
          <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
            {companion.creator_name}
          </p>
        </div>
      </div>

      {/* Description section */}
      <div className="mb-6 h-32 relative">
        <div className="absolute inset-0 rounded-lg bg-black/20 backdrop-blur-sm border border-green-500/10" />
        <div className="absolute inset-0 overflow-y-auto px-4 py-3">
          <p className="text-sm text-gray-400 leading-relaxed">
            {companion.description}
          </p>
        </div>
      </div>

      {/* Stats and action section */}
      <div className="mt-auto flex items-center justify-between relative">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 flex items-center justify-center bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-full border border-green-500/20 group-hover:border-green-500/30 transition-colors">
              {isLoading ? (
                <Skeleton className="h-4 w-4 rounded-full" />
              ) : (
                <span className="text-sm">❤️</span>
              )}
            </div>
            {isLoading ? (
              <Skeleton className="h-4 w-8" />
            ) : (
              <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                {isError ? 'Error' : stats?.likesCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 flex items-center justify-center bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-full border border-green-500/20 group-hover:border-green-500/30 transition-colors">
              {isLoading ? (
                <Skeleton className="h-4 w-4 rounded-full" />
              ) : (
                <span className="text-sm">💬</span>
              )}
            </div>
            {isLoading ? (
              <Skeleton className="h-4 w-8" />
            ) : (
              <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                {isError ? 'Error' : stats?.messagesCount}
              </span>
            )}
          </div>
        </div>
        <Button
          asChild
          className="relative bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white shadow-lg hover:shadow-green-500/25 transition-shadow"
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