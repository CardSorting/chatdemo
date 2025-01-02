import React from "react";
import { Companion } from "../../lib/companions";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card } from "../ui/card";

interface CompanionCardProps {
  companion: Companion;
}

const CompanionCard = ({ companion }: CompanionCardProps) => {
  return (
    <Card className="p-6 bg-black/50 backdrop-blur-sm border-green-500/20 hover:border-green-500/40 transition-colors">
      <div className="flex items-center gap-4 mb-4">
        <Avatar className="w-12 h-12 border-2 border-green-500/50">
          <AvatarImage src={companion.avatar_url} />
          <AvatarFallback>{companion.name[0]}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-lg font-semibold text-white">{companion.name}</h3>
          <p className="text-sm text-gray-400">{companion.creator_name}</p>
        </div>
      </div>
      <p className="text-sm text-gray-400 mb-4 line-clamp-3">
        {companion.description}
      </p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span>❤️ {companion.likes_count}</span>
          <span>💬 {companion.messages_count}</span>
        </div>
        <Button
          asChild
          className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
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