import { Card } from "../../../../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../../../../components/ui/avatar";
import { Button } from "../../../../components/ui/button";
import { Star, Download, Info, Clock, Calendar, Users, MessageCircle, Share2, Bookmark, ChevronRight, Mail, AlertCircle, Heart, ThumbsUp, ThumbsDown } from "lucide-react";
import { Progress } from "../../../../components/ui/progress";

interface SidebarSectionProps {
  companion: {
    creator_name: string;
    creator_avatar?: string;
    website?: string;
    contact?: string;
    other_products?: Array<{
      name: string;
      rating: number;
      avatar_url?: string;
    }>;
    version?: string;
    last_updated?: string;
    size?: string;
    languages?: string[];
    age_rating?: string;
    permissions?: string[];
    requirements?: string[];
    downloads?: number;
    messages_count?: number;
    reviews?: {
      rating: number;
      text: string;
      author: string;
      date: string;
    }[];
    changelog?: string[];
  };
  similarCompanions: Array<{
    name: string;
    rating: number;
    avatar_url?: string;
    messages_count?: number;
  }>;
}

export function SidebarSection({ companion, similarCompanions }: SidebarSectionProps) {
  return (
    <div className="space-y-8">
      {/* Information Card */}
      <Card className="p-6 bg-white dark:bg-gray-900 shadow-sm">
        <h3 className="font-semibold text-lg mb-4">Information</h3>
        <div className="space-y-4">
          {[
            { label: "Version", value: companion.version || "2.1.0", icon: Calendar },
            { label: "Last Updated", value: companion.last_updated || "2 days ago", icon: Clock },
            { label: "Size", value: companion.size || "15 MB" },
            { label: "Languages", value: companion.languages?.join(", ") || "10+" },
            { label: "Age Rating", value: companion.age_rating || "12+" },
          ].map((item, i) => (
            <div key={i} className="flex justify-between text-sm">
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                {item.icon && <item.icon className="w-4 h-4" />}
                <span>{item.label}</span>
              </div>
              <span className="font-medium">{item.value}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Developer Card */}
      <Card className="p-6 bg-white dark:bg-gray-900 shadow-sm">
        <h3 className="font-semibold text-lg mb-4">Developer</h3>
        <div className="flex items-center gap-4">
          <Avatar className="w-12 h-12">
            <AvatarImage src={companion.creator_avatar} />
            <AvatarFallback>{companion.creator_name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{companion.creator_name}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Verified Developer
            </p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800 space-y-2">
          {companion.website && (
            <Button variant="outline" className="w-full gap-2" asChild>
              <a href={companion.website} target="_blank" rel="noopener noreferrer">
                <Info className="w-4 h-4" />
                Visit Website
              </a>
            </Button>
          )}
          {companion.contact && (
            <Button variant="outline" className="w-full gap-2" asChild>
              <a href={`mailto:${companion.contact}`}>
                <Mail className="w-4 h-4" />
                Contact Developer
              </a>
            </Button>
          )}
        </div>
      </Card>

      {/* What's New Card */}
      {companion.changelog && companion.changelog.length > 0 && (
        <Card className="p-6 bg-white dark:bg-gray-900 shadow-sm">
          <h3 className="font-semibold text-lg mb-4">What's New</h3>
          <div className="space-y-4">
            {companion.changelog.map((change, i) => (
              <div key={i} className="text-sm">
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1">
                  <Calendar className="w-4 h-4" />
                  <span>Version {companion.version}</span>
                </div>
                <p className="text-gray-700 dark:text-gray-300">{change}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Reviews Card */}
      {companion.reviews && companion.reviews.length > 0 && (
        <Card className="p-6 bg-white dark:bg-gray-900 shadow-sm">
          <h3 className="font-semibold text-lg mb-4">Recent Reviews</h3>
          <div className="space-y-4">
            {companion.reviews.slice(0, 3).map((review, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= review.rating ? "text-yellow-400" : "text-gray-300"
                        }`}
                        fill={star <= review.rating ? "currentColor" : "none"}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">{review.date}</span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300">{review.text}</p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>by {review.author}</span>
                  <div className="flex items-center gap-1">
                    <ThumbsUp className="w-4 h-4" />
                    <span>12</span>
                    <ThumbsDown className="w-4 h-4" />
                    <span>2</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* More by Developer Card */}
      {companion.other_products && companion.other_products.length > 0 && (
        <Card className="p-6 bg-white dark:bg-gray-900 shadow-sm">
          <h3 className="font-semibold text-lg mb-4">More by {companion.creator_name}</h3>
          <div className="space-y-4">
            {companion.other_products.map((product, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <Avatar className="w-10 h-10">
                  <AvatarImage src={product.avatar_url} />
                  <AvatarFallback>{product.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{product.name}</p>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-400" fill="currentColor" />
                    <span className="text-xs text-gray-500">{product.rating}</span>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="gap-1">
                  View
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Actions Card */}
      <Card className="p-6 bg-white dark:bg-gray-900 shadow-sm">
        <div className="flex flex-col gap-2">
          <Button variant="outline" className="w-full gap-2">
            <Share2 className="w-4 h-4" />
            Share
          </Button>
          <Button variant="outline" className="w-full gap-2">
            <Bookmark className="w-4 h-4" />
            Save
          </Button>
          <Button variant="outline" className="w-full gap-2">
            <AlertCircle className="w-4 h-4" />
            Report
          </Button>
        </div>
      </Card>
    </div>
  );
}