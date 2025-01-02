import { Card } from "../../../../components/ui/card";
import { Avatar, AvatarFallback } from "../../../../components/ui/avatar";
import { Button } from "../../../../components/ui/button";
import { Star } from "lucide-react";

interface SidebarSectionProps {
  companion: {
    creator_name: string;
  };
  similarCompanions: Array<{
    name: string;
    rating: number;
  }>;
}

export function SidebarSection({ companion, similarCompanions }: SidebarSectionProps) {
  return (
    <div className="space-y-8">
      {/* Information Card */}
      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-4">Information</h3>
        <div className="space-y-4">
          {[
            { label: "Version", value: "2.1.0" },
            { label: "Last Updated", value: "2 days ago" },
            { label: "Size", value: "15 MB" },
            { label: "Languages", value: "10+" },
            { label: "Age Rating", value: "12+" },
          ].map((item, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">
                {item.label}
              </span>
              <span className="font-medium">{item.value}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Developer Card */}
      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-4">Developer</h3>
        <div className="flex items-center gap-4">
          <Avatar className="w-12 h-12">
            <AvatarFallback>{companion.creator_name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{companion.creator_name}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Verified Developer
            </p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
          <Button variant="outline" className="w-full">
            View Profile
          </Button>
        </div>
      </Card>

      {/* Similar Companions */}
      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-4">Similar Companions</h3>
        <div className="space-y-4">
          {similarCompanions.map((companion, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Avatar className="w-10 h-10">
                <AvatarFallback>{companion.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{companion.name}</p>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-400" fill="currentColor" />
                  <span className="text-xs text-gray-500">{companion.rating}</span>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                View
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}