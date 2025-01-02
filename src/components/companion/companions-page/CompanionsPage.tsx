import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getCompanionById } from "../../../services/companion/companionService";
import { useToast } from "../../../components/ui/use-toast";
import { cn } from "../../../lib/utils";
import { HeroSection } from "./components/HeroSection";
import { ScreenshotsSection } from "./components/ScreenshotsSection";
import { FeaturesSection } from "./components/FeaturesSection";
import { ReviewsSection } from "./components/ReviewsSection";
import { SidebarSection } from "./components/SidebarSection";
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar";
import { Button } from "../../../components/ui/button";
import { Brain, Clock, Zap, Globe, Share2 } from "lucide-react";

export default function CompanionsPage() {
  const { companionId } = useParams<{ companionId: string }>();
  const { toast } = useToast();
  const [isHeaderSticky, setIsHeaderSticky] = useState(false);

  const { data: companion, isLoading, isError } = useQuery({
    queryKey: ["companion", companionId],
    queryFn: () => getCompanionById(companionId!),
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsHeaderSticky(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  const features = [
    {
      icon: Brain,
      title: "Advanced AI",
      description: "Powered by state-of-the-art language models",
    },
    {
      icon: Clock,
      title: "24/7 Availability",
      description: "Always ready to chat when you need",
    },
    {
      icon: Zap,
      title: "Fast Responses",
      description: "Quick, natural conversation flow",
    },
    {
      icon: Globe,
      title: "Multilingual",
      description: "Supports multiple languages",
    },
  ];

  const reviews = [
    {
      user: "User1",
      rating: 5,
      comment: "Amazing companion! The conversations feel incredibly natural and engaging.",
      date: "2 days ago",
    },
    {
      user: "User2",
      rating: 5,
      comment: "I'm impressed by how well it understands context and maintains meaningful dialogue.",
      date: "3 days ago",
    },
    {
      user: "User3",
      rating: 4,
      comment: "Great experience overall, though sometimes responses could be faster.",
      date: "5 days ago",
    },
  ];

  const similarCompanions = [
    { name: "Companion A", rating: 4.8 },
    { name: "Companion B", rating: 4.7 },
    { name: "Companion C", rating: 4.6 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Sticky Header */}
      <div
        className={cn(
          "fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 transition-all duration-300",
          isHeaderSticky ? "translate-y-0" : "-translate-y-full"
        )}
      >
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-8 h-8">
              <AvatarImage src={companion.avatar_url} />
              <AvatarFallback>{companion.name[0]}</AvatarFallback>
            </Avatar>
            <h2 className="font-semibold">{companion.name}</h2>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost">
              <Share2 className="w-4 h-4" />
            </Button>
            <Button size="sm">Start Chat</Button>
          </div>
        </div>
      </div>

      <HeroSection companion={companion} />
      
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <FeaturesSection features={features} />
            <ReviewsSection reviews={reviews} />
          </div>
          <SidebarSection companion={companion} similarCompanions={similarCompanions} />
        </div>
      </div>
    </div>
  );
}