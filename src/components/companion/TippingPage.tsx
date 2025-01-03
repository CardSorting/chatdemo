import { useParams } from "react-router-dom";
import { useTipping } from "@lib/tipping/hooks/useTipping";
import { Button } from "../../components/ui/button";
import { ArrowLeft, Gift, Share2, Heart, Loader2, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "../../components/ui/card";
import { Progress } from "../../components/ui/progress";
import { Avatar, AvatarImage, AvatarFallback } from "../../components/ui/avatar";
import { Skeleton } from "../../components/ui/skeleton";
import { useState, useEffect } from "react";
import { toast } from "../../components/ui/use-toast";
import { UseTippingReturn } from "@lib/tipping/types";
import { motion } from "framer-motion";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../components/ui/tooltip";
import { Companion, getCompanion } from "@lib/companions";

export default function TippingPage() {
  const { creatorId } = useParams();
  const navigate = useNavigate();
  const [isSharing, setIsSharing] = useState(false);
  const [companion, setCompanion] = useState<Companion | null>(null);
  const [isLoadingCompanion, setIsLoadingCompanion] = useState(true);
  const {
    state,
    setTipAmount,
    handleTip,
    handleCustomAmountChange,
    isLoading
  } = useTipping(creatorId) as UseTippingReturn;

  const nextMilestone = state.milestones?.find(m => m.current < m.goal) || null;

  useEffect(() => {
    const fetchCompanion = async () => {
      try {
        if (creatorId) {
          const data = await getCompanion(creatorId);
          setCompanion(data);
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load companion data",
          variant: "destructive"
        });
      } finally {
        setIsLoadingCompanion(false);
      }
    };

    fetchCompanion();
  }, [creatorId]);

  const handleShare = async () => {
    try {
      setIsSharing(true);
      await navigator.share({
        title: `Support ${companion?.creator_name || 'this creator'}`,
        text: `Join me in supporting ${companion?.creator_name || 'this creator'} on this platform!`,
        url: window.location.href
      });
    } catch (error) {
      toast({
        title: "Share failed",
        description: "Couldn't share the page. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSharing(false);
    }
  };

  if (isLoadingCompanion) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!companion) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <Card className="p-6">
          <h2 className="text-xl font-semibold">Companion not found</h2>
          <Button 
            className="mt-4"
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Sticky Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={handleShare}
            disabled={isSharing}
          >
            {isSharing ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Share2 className="w-4 h-4 mr-2" />
            )}
            Share
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 pt-20 pb-8">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-purple-600 to-blue-500 rounded-xl overflow-hidden mb-12">
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          <div className="relative z-10 p-8 text-center">
            <div className="max-w-3xl mx-auto">
              <div className="flex justify-center mb-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Avatar className="w-32 h-32 border-4 border-white/20">
                    <AvatarImage src={companion.avatar_url} />
                    <AvatarFallback>
                      {companion.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </motion.div>
              </div>
              <h1 className="text-4xl font-bold text-white mb-4">
                Support {companion.creator_name}
              </h1>
              <p className="text-white/90 text-lg max-w-prose mx-auto mb-6">
                Help {companion.creator_name} continue creating amazing content
              </p>
            </div>
          </div>
        </div>

        {/* Tipping Section */}
        <div className="max-w-2xl mx-auto space-y-6">
          <Card className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="space-y-6">
              {/* Balance Info */}
              <Card className="p-4 bg-primary/5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Your Balance</h3>
                    <p className="text-xl sm:text-2xl font-bold">
                      {state.userBalance} Pulse
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
              </Card>

              {/* Tip Amounts */}
              <div className="space-y-4">
                <Label>Select Amount</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[10, 50, 100].map((amount) => (
                    <Button
                      key={amount}
                      variant={
                        state.tipAmount === amount ? "default" : "outline"
                      }
                      onClick={() => setTipAmount(amount)}
                      className={`h-14 transition-all ${
                        amount <= state.userBalance
                          ? "hover:scale-[1.02]"
                          : "opacity-50 cursor-not-allowed"
                      }`}
                      disabled={amount > state.userBalance}
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
                  state.isTipping ||
                  state.isLoading ||
                  (state.customAmount && !state.isValidAmount)
                }
                className="w-full h-14 gap-2"
                size="lg"
              >
                {state.isTipping ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Gift className="w-5 h-5" />
                )}
                <span>
                  Send {state.customAmount || state.tipAmount} Pulse
                </span>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}