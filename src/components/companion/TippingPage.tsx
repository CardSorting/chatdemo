import { useParams } from "react-router-dom";
import { useTipping } from "@lib/tipping/hooks/useTipping";
import { TippingStats } from "@lib/tipping/components/TippingStats";
import { TippingForm } from "@lib/tipping/components/TippingForm";
import { Button } from "../../components/ui/button";
import { ArrowLeft, Gift, Trophy, Users, Sparkles, Share2, Heart, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "../../components/ui/card";
import { Progress } from "../../components/ui/progress";
import { Separator } from "../../components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "../../components/ui/avatar";
import { Skeleton } from "../../components/ui/skeleton";
import { useState } from "react";
import { toast } from "../../components/ui/use-toast";
import { UseTippingReturn } from "@lib/tipping/types";

export default function TippingPage() {
  const { creatorId, creatorName } = useParams();
  const navigate = useNavigate();
  const [isSharing, setIsSharing] = useState(false);
  const {
    state,
    setTipAmount,
    handleTip,
    handleCustomAmountChange,
    isLoading
  } = useTipping(creatorId) as UseTippingReturn;

  const nextMilestone = state.milestones?.find(m => m.current < m.goal) || null;

  const handleShare = async () => {
    try {
      setIsSharing(true);
      await navigator.share({
        title: `Support ${creatorName}`,
        text: `Join me in supporting ${creatorName} on this platform!`,
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white hover:bg-gray-800/50 transition-colors"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white hover:bg-gray-800/50 transition-colors"
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

        {/* Hero Section */}
        <div className="max-w-3xl mx-auto mb-12 text-center">
          <div className="flex justify-center mb-4">
            <Avatar className="w-24 h-24 border-4 border-gray-800">
              <AvatarImage src={state.creator?.avatar} />
              <AvatarFallback>
                {creatorName?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Support {creatorName}
          </h1>
          <p className="text-gray-400 max-w-prose mx-auto">
            Your support helps {creatorName} continue creating amazing content. Every tip makes a difference!
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-8">
          {/* Current Goal Section */}
          {nextMilestone && (
            <Card className="p-6 bg-gray-800/50 border-gray-700 hover:border-gray-600 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <Trophy className="w-5 h-5 text-yellow-500" />
                <h2 className="text-lg font-semibold text-white">Current Goal</h2>
              </div>
              <p className="text-gray-300 mb-4">{nextMilestone.description}</p>
              <Progress 
                value={(nextMilestone.current / nextMilestone.goal) * 100} 
                className="h-2 mb-2 bg-gray-700"
              />
              <div className="flex justify-between text-sm text-gray-400">
                <span>${nextMilestone.current} raised</span>
                <span>Goal: ${nextMilestone.goal}</span>
              </div>
            </Card>
          )}

          {/* Tipping Form Section */}
          <Card className="p-6 bg-gray-800/50 border-gray-700 hover:border-gray-600 transition-colors">
            <div className="flex items-center gap-3 mb-6">
              <Gift className="w-5 h-5 text-purple-500" />
              <h2 className="text-lg font-semibold text-white">Send a Tip</h2>
            </div>
            <TippingForm
              state={state}
              onTip={handleTip}
              onCustomTip={() => handleTip(parseFloat(state.customAmount))}
              onCustomAmountChange={handleCustomAmountChange}
              setTipAmount={setTipAmount}
              isLoading={isLoading}
            />
          </Card>

          {/* Community Support Section */}
          <Card className="p-6 bg-gray-800/50 border-gray-700 hover:border-gray-600 transition-colors">
            <div className="flex items-center gap-3 mb-6">
              <Users className="w-5 h-5 text-blue-500" />
              <h2 className="text-lg font-semibold text-white">Community Support</h2>
            </div>
            
            <div className="space-y-6">
              {/* Recent Activity */}
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-3">Recent Activity</h3>
                <div className="space-y-3">
                  {state.recentTips?.slice(0, 3).map((tip, index) => (
                    <div key={index} className="flex items-center justify-between text-sm hover:bg-gray-700/50 p-2 rounded-lg transition-colors">
                      <span className="text-gray-300">{tip.sender}</span>
                      <span className="text-green-400 font-medium">${tip.amount}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Separator className="bg-gray-700" />

              {/* Top Supporters */}
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-3">Top Supporters</h3>
                <div className="space-y-3">
                  {state.topTippers?.slice(0, 3).map((tipper, index) => (
                    <div key={index} className="flex items-center justify-between text-sm hover:bg-gray-700/50 p-2 rounded-lg transition-colors">
                      <div className="flex items-center gap-2">
                        {index === 0 && <Sparkles className="w-4 h-4 text-yellow-500" />}
                        <span className="text-gray-300">{tipper.username}</span>
                      </div>
                      <span className="text-purple-400 font-medium">${tipper.totalTips}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Stats Section */}
          <Card className="bg-gray-800/50 border-gray-700 hover:border-gray-600 transition-colors">
            <TippingStats state={state} creatorName={creatorName || ""} />
          </Card>
        </div>
      </div>
    </div>
  );
}