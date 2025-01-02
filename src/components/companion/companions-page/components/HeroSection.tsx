import { Avatar, AvatarFallback, AvatarImage } from "../../../../components/ui/avatar";
import { Card } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { Star, MessageSquare, Bookmark, Heart, Share2, Users, MessageCircle, Download, PlayCircle } from "lucide-react";
import { cn } from "../../../../lib/utils";

interface HeroSectionProps {
  companion: {
    avatar_url: string;
    name: string;
    creator_name: string;
    messages_count: number;
    likes_count: number;
  };
}

export function HeroSection({ companion }: HeroSectionProps) {
  return (
    <div className="pt-24 pb-16 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column */}
          <div className="space-y-8">
            <div className="flex items-start gap-6">
              <Avatar className="w-32 h-32 rounded-3xl">
                <AvatarImage src={companion.avatar_url} />
                <AvatarFallback>{companion.name[0]}</AvatarFallback>
              </Avatar>
              <div className="space-y-4">
                <div>
                  <h1 className="text-4xl font-bold mb-2">{companion.name}</h1>
                  <p className="text-gray-500 dark:text-gray-400">
                    by {companion.creator_name}
                  </p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      50K+ users
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {companion.messages_count || 0} messages
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Ratings and Stats */}
            <Card className="p-6 bg-white dark:bg-gray-900">
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold mb-1">4.9</div>
                  <div className="flex justify-center mb-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 text-yellow-400"
                        fill="currentColor"
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-500">Rating</p>
                </div>
                <div className="text-center border-l border-r border-gray-200 dark:border-gray-800">
                  <div className="text-3xl font-bold mb-1">#1</div>
                  <p className="text-sm text-gray-500 mb-1">Rank</p>
                  <p className="text-xs text-gray-400">in AI Companions</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-1">
                    {companion.likes_count || 0}
                  </div>
                  <Heart className="w-4 h-4 mx-auto mb-1 text-red-500" />
                  <p className="text-sm text-gray-500">Likes</p>
                </div>
              </div>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button className="flex-1 gap-2 h-12" size="lg">
                <MessageSquare className="w-5 h-5" />
                Start Chat
              </Button>
              <Button className="gap-2 h-12" size="lg" variant="outline">
                <Bookmark className="w-5 h-5" />
              </Button>
              <Button className="gap-2 h-12" size="lg" variant="outline">
                <Share2 className="w-5 h-5" />
              </Button>
            </div>

            {/* Download Statistics */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Download className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  100K+ Downloads
                </span>
              </div>
              <div className="flex items-center gap-2">
                <PlayCircle className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  1M+ Interactions
                </span>
              </div>
            </div>
          </div>

          {/* Right Column - Screenshots */}
          <div className="relative">
            <div className="aspect-[4/3] bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-2xl p-4">
              <div className="grid grid-cols-2 gap-4 h-full">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="relative overflow-hidden rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10" />
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2">
              <div className="flex gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full ${
                      i === 1 ? "bg-blue-500" : "bg-gray-300 dark:bg-gray-700"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}