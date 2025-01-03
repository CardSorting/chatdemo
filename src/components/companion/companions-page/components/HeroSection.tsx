import { Avatar, AvatarFallback, AvatarImage } from "../../../../components/ui/avatar";
import { Card } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { Star, MessageSquare, Bookmark, Heart, Share2, Users, MessageCircle, Download, PlayCircle, ChevronRight, Info, Clock, Calendar, Tag, Flag } from "lucide-react";
import { cn } from "../../../../lib/utils";
import { Progress } from "../../../../components/ui/progress";
import { TippingSection } from "./TippingSection";
import { ScreenshotsSection } from "./ScreenshotsSection";

interface HeroSectionProps {
  companion: {
    avatar_url: string;
    name: string;
    creator_name: string;
    creator_id: string;
    messages_count: number;
    likes_count: number;
    screenshots?: string[];
    tagline?: string;
    description?: string;
    version?: string;
    rating?: string;
    last_updated?: string;
    size?: string;
    developer_info?: {
      website?: string;
      contact?: string;
      other_products?: string[];
    };
    reviews?: {
      rating: number;
      text: string;
      author: string;
    }[];
  };
}

export function HeroSection({ companion }: HeroSectionProps) {
  const screenshots = companion.screenshots || [];
  const reviews = companion.reviews || [];
  const developerInfo = companion.developer_info || {};

  return (
    <div className="pt-24 pb-16 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Header Section */}
            <div className="space-y-6">
              <div className="flex items-start gap-6">
                <div className="relative">
                  <Avatar className="w-32 h-32 rounded-3xl border-4 border-white dark:border-gray-900 shadow-lg ring-4 ring-blue-100/50 dark:ring-blue-900/50">
                    <AvatarImage src={companion.avatar_url} />
                    <AvatarFallback>{companion.name[0]}</AvatarFallback>
                  </Avatar>
                  {companion.rating && (
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-900 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      <span>{companion.rating}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  <div>
                    <h1 className="text-5xl font-bold mb-2">{companion.name}</h1>
                    {companion.tagline && (
                      <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">
                        {companion.tagline}
                      </p>
                    )}
                    {companion.description && (
                      <p className="text-base text-gray-500 dark:text-gray-400 leading-relaxed">
                        {companion.description}
                      </p>
                    )}
                    <p className="text-lg text-gray-500 dark:text-gray-400">
                      by {companion.creator_name}
                    </p>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-5 h-5 text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {companion.messages_count || 0} messages
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button variant="outline" className="flex-1 gap-2">
                  <Share2 className="w-5 h-5" />
                  Share
                </Button>
                <Button variant="outline" className="flex-1 gap-2">
                  <Bookmark className="w-5 h-5" />
                  Save
                </Button>
                <Button variant="outline" className="flex-1 gap-2">
                  <Flag className="w-5 h-5" />
                  Report
                </Button>
              </div>

              {/* What's New Section */}
              {companion.version && (
                <Card className="p-6 bg-white dark:bg-gray-900 shadow-sm">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">What's New</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <Calendar className="w-4 h-4" />
                      <span>Version {companion.version}</span>
                      {companion.last_updated && (
                        <>
                          <span>•</span>
                          <Clock className="w-4 h-4" />
                          <span>Updated {companion.last_updated}</span>
                        </>
                      )}
                    </div>
                  </div>
                </Card>
              )}
            </div>

            {/* Primary Call-to-Action */}
            <div className="space-y-4">
              <Button className="w-full h-14 gap-2" size="lg">
                <MessageSquare className="w-6 h-6" />
                <span className="text-lg">Start Chatting Now</span>
              </Button>
              <div className="flex gap-4">
                <TippingSection 
                  creatorId={companion.creator_id}
                  creatorName={companion.creator_name}
                />
                <Button className="flex-1 gap-2 h-12" size="lg" variant="outline">
                  <Share2 className="w-5 h-5" />
                  Share
                </Button>
              </div>
            </div>

            {/* Developer Section */}
            {developerInfo.website && (
              <Card className="p-6 bg-white dark:bg-gray-900 shadow-sm">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Developer</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <Info className="w-4 h-4" />
                      <span>{companion.creator_name}</span>
                    </div>
                    <Button
                      variant="link"
                      className="p-0 h-auto text-blue-600 dark:text-blue-400"
                      asChild
                    >
                      <a href={developerInfo.website} target="_blank" rel="noopener noreferrer">
                        Visit Developer Website
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </a>
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Right Column - Screenshots */}
          <ScreenshotsSection screenshots={screenshots} />
        </div>
      </div>
    </div>
  );
}