import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getCompanionById } from "../../../services/companion/companionService";
import { useToast } from "../../../components/ui/use-toast";
import { cn } from "../../../lib/utils";
import { HeroSection } from "./components/HeroSection";
import { ScreenshotsSection } from "./components/ScreenshotsSection";
import { ReviewsSection } from "./components/ReviewsSection";
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar";
import { Button } from "../../../components/ui/button";
import { Brain, Clock, Zap, Globe, Share2, Gift, Info, Loader2, X } from "lucide-react";
import { useTipping } from "../../../lib/tipping/hooks/useTipping";
import { Progress } from "../../../components/ui/progress";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../../components/ui/tooltip";
import { supabase } from "../../../lib/supabase";

export default function CompanionsPage() {
  const { companionId } = useParams<{ companionId: string }>();
  const { toast } = useToast();
  const [isHeaderSticky, setIsHeaderSticky] = useState(false);
  const [showTippingPopup, setShowTippingPopup] = useState(false);

  // Fetch companion data
  const { data: companion, isLoading: isCompanionLoading, isError: isCompanionError } = useQuery({
    queryKey: ["companion", companionId],
    queryFn: () => getCompanionById(companionId!),
  });

  // Fetch reviews data
  const { data: reviews, isLoading: isReviewsLoading, isError: isReviewsError } = useQuery({
    queryKey: ["reviews", companionId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("companion_id", companionId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const {
    state,
    setTipAmount,
    handleTip,
    handleCustomAmountChange,
    isLoading: isTippingLoading
  } = useTipping(companionId);

  useEffect(() => {
    const handleScroll = () => {
      setIsHeaderSticky(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isCompanionError || isReviewsError) {
      toast({
        title: "Error",
        description: "Failed to load companion details",
        variant: "destructive",
      });
    }
  }, [isCompanionError, isReviewsError, toast]);

  if (isCompanionLoading) {
    return <div className="container mx-auto px-4 py-8">Loading companion details...</div>;
  }

  if (isCompanionError || !companion) {
    return <div className="container mx-auto px-4 py-8">Failed to load companion details</div>;
  }

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
            <Button 
              size="sm" 
              variant="ghost"
              onClick={() => setShowTippingPopup(true)}
            >
              <Gift className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="ghost">
              <Share2 className="w-4 h-4" />
            </Button>
            <Button size="sm">Start Chat</Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pt-20 pb-8">
        <HeroSection companion={companion} />
        
        {/* Screenshots Section */}
        <div className="py-12">
          <ScreenshotsSection screenshots={companion.screenshots} />
        </div>

        {/* Reviews Section */}
        <div className="py-16">
          <div className="max-w-4xl mx-auto">
            <ReviewsSection 
              reviews={reviews || []} 
              isLoading={isReviewsLoading}
            />
          </div>
        </div>
      </div>

      {/* Floating Tipping Button */}
      <button
        onClick={() => setShowTippingPopup(true)}
        className="fixed bottom-8 right-8 p-4 bg-primary rounded-full shadow-lg hover:bg-primary/90 transition-colors z-40"
      >
        <Gift className="w-6 h-6 text-white" />
      </button>

      {/* Tipping Popup */}
      {showTippingPopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6 space-y-6 w-full max-w-md relative">
            <button
              onClick={() => setShowTippingPopup(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            
            <h3 className="text-xl font-semibold">Support {companion.creator_name}</h3>
            
            {/* Balance Info */}
            <div className="bg-primary/5 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Your Balance</h4>
                  <p className="text-xl sm:text-2xl font-bold">
                    {state.isLoading ? "..." : `${state.userBalance} Pulse`}
                  </p>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="w-5 h-5 text-gray-400 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      Your available balance for tipping
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            {/* Tip Amounts */}
            <div className="space-y-4">
              <Label>Select Amount</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[10, 50, 100].map((amount) => (
                  <Button
                    key={amount}
                    variant={state.tipAmount === amount ? "default" : "outline"}
                    onClick={() => setTipAmount(amount)}
                    className={`h-14 transition-all ${
                      !state.isLoading && amount <= state.userBalance
                        ? "hover:scale-[1.02]"
                        : "opacity-50 cursor-not-allowed"
                    }`}
                    disabled={state.isLoading || amount > state.userBalance}
                  >
                    {amount} Pulse
                  </Button>
                ))}
              </div>
            </div>

            {/* Custom Amount */}
            <div className="space-y-2">
              <Label htmlFor="custom-amount">Custom Amount</Label>
              <div className="relative">
                <Input
                  id="custom-amount"
                  type="number"
                  value={state.customAmount}
                  onChange={(e) => handleCustomAmountChange(e.target.value)}
                  placeholder="Enter amount"
                  className={`h-12 pr-16 ${
                    !state.isValidAmount
                      ? "border-red-500 focus:ring-red-500"
                      : ""
                  }`}
                  aria-invalid={!state.isValidAmount}
                  min="1"
                  max={state.userBalance}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                  Pulse
                </span>
              </div>
              {!state.isValidAmount && (
                <p className="text-sm text-red-500">
                  Please enter a valid amount within your balance
                </p>
              )}
            </div>

            {/* Tip Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                <span>Amount to Send</span>
                <span>
                  {state.customAmount || state.tipAmount} /{" "}
                  {state.userBalance} Pulse
                </span>
              </div>
              <Progress
                value={state.customAmount
                  ? (parseFloat(state.customAmount) / state.userBalance) * 100
                  : (state.tipAmount / state.userBalance) * 100
                }
                className="h-2"
              />
            </div>

            {/* Send Button */}
            <Button
              onClick={() =>
                state.customAmount ? handleTip(parseFloat(state.customAmount)) : handleTip(state.tipAmount)
              }
              disabled={
                state.isLoading ||
                isTippingLoading ||
                (state.customAmount && !state.isValidAmount)
              }
              className="w-full h-14 gap-2"
              size="lg"
            >
              {isTippingLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Gift className="w-5 h-5" />
              )}
              <span>
                Send {state.customAmount || state.tipAmount} Pulse
              </span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
