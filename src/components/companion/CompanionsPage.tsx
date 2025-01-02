import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getCompanionById } from "../../services/companion/companionService";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";
import { Sparkles } from "lucide-react";

export default function CompanionsPage() {
  const { companionId } = useParams<{ companionId: string }>();
  const { toast } = useToast();

  const { data: companion, isLoading, isError } = useQuery({
    queryKey: ["companion", companionId],
    queryFn: () => getCompanionById(companionId!),
  });

  useEffect(() => {
    if (isError) {
      toast({
        title: "Error",
        description: "Failed to load companion details",
        variant: "destructive",
      });
    }
  }, [isError, toast]);

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  if (isError || !companion) {
    return <div className="container mx-auto px-4 py-8">Failed to load companion details</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <div className="p-6">
          <div className="flex flex-col items-center gap-4 mb-6">
            <Avatar className="w-32 h-32">
              <AvatarImage src={companion.avatar_url} />
              <AvatarFallback>{companion.name[0]}</AvatarFallback>
            </Avatar>
            <h1 className="text-3xl font-bold text-center">
              {companion.name}
            </h1>
            <p className="text-gray-400 text-center">
              Created by {companion.creator_name}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-400" />
              <span className="font-medium">Likes</span>
              <span className="ml-auto">{companion.likes_count}</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <span className="font-medium">Messages</span>
              <span className="ml-auto">{companion.messages_count}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button className="flex-1" variant="outline">
              Chat
            </Button>
            <Button className="flex-1" variant="outline">
              Bookmark
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}