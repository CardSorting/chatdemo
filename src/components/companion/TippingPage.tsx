import { useParams } from "react-router-dom";
import { useTipping } from "@lib/tipping/hooks/useTipping";
import { Button } from "../../components/ui/button";
import { ArrowLeft, Gift, Trophy, Users, Sparkles, Share2, Heart, Loader2, CreditCard, Shield, Smile, MessageCircle, Image, BookOpen, Check, Star, Clock, TrendingUp, HelpCircle, Video, PieChart, Calendar, BadgeCheck, Info, History, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "../../components/ui/card";
import { Progress } from "../../components/ui/progress";
import { Separator } from "../../components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "../../components/ui/avatar";
import { Skeleton } from "../../components/ui/skeleton";
import { useState } from "react";
import { toast } from "../../components/ui/use-toast";
import { UseTippingReturn } from "@lib/tipping/types";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../components/ui/tooltip";

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
                    <AvatarImage src={state.creator?.avatar} />
                    <AvatarFallback>
                      {creatorName?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </motion.div>
              </div>
              <h1 className="text-4xl font-bold text-white mb-4">
                Support {creatorName}
              </h1>
              <p className="text-white/90 text-lg max-w-prose mx-auto mb-6">
                Help {creatorName} continue creating amazing content and reach new milestones
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Tipping Section */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Gift className="w-6 h-6 text-purple-500" />
                Support {creatorName}
              </h2>
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

            {/* Story Section */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-purple-500" />
                The Story
              </h2>
              <Card className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
                <div className="prose prose-invert max-w-none">
                  <p className="text-gray-700 dark:text-gray-300">
                    {creatorName} has been creating amazing content that inspires and entertains thousands of people. 
                    Your support will help them continue their journey and reach new heights in their creative endeavors.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 mt-4">
                    With your contributions, {creatorName} will be able to:
                  </p>
                  <ul className="text-gray-700 dark:text-gray-300">
                    <li>Invest in better equipment and tools</li>
                    <li>Create more high-quality content</li>
                    <li>Expand their reach to new audiences</li>
                    <li>Develop innovative projects</li>
                  </ul>
                </div>
              </Card>
            </div>

            {/* How Funds Will Be Used Section */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <PieChart className="w-6 h-6 text-blue-500" />
                How Funds Will Be Used
              </h2>
              <Card className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start gap-4">
                    <PieChart className="w-6 h-6 text-purple-500 flex-shrink-0" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Content Creation</h3>
                      <p className="text-gray-600 dark:text-gray-400">50% of funds will go towards creating new content</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <TrendingUp className="w-6 h-6 text-blue-500 flex-shrink-0" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Growth & Marketing</h3>
                      <p className="text-gray-600 dark:text-gray-400">30% will be used to reach new audiences</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Video className="w-6 h-6 text-green-500 flex-shrink-0" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Equipment</h3>
                      <p className="text-gray-600 dark:text-gray-400">15% will be invested in better equipment</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Shield className="w-6 h-6 text-yellow-500 flex-shrink-0" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Platform Fees</h3>
                      <p className="text-gray-600 dark:text-gray-400">5% covers platform and payment processing fees</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Updates Section */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-6 h-6 text-purple-500" />
                Updates
              </h2>
              <Card className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <Calendar className="w-6 h-6 text-purple-500 flex-shrink-0" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">New Content Coming Soon!</h3>
                      <p className="text-gray-600 dark:text-gray-400">We're working on exciting new projects thanks to your support</p>
                      <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">Posted 3 days ago</p>
                    </div>
                  </div>
                  <Separator className="bg-gray-200 dark:bg-gray-800" />
                  <div className="flex items-start gap-4">
                    <BadgeCheck className="w-6 h-6 text-blue-500 flex-shrink-0" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">First Milestone Reached!</h3>
                      <p className="text-gray-600 dark:text-gray-400">We've hit our first funding goal - thank you everyone!</p>
                      <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">Posted 1 week ago</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-12">
            {/* Progress Section */}
            {nextMilestone && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-purple-500" />
                  Campaign Progress
                </h2>
                <Card className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
                  <div className="space-y-4">
                    <div className="flex justify-between text-gray-700 dark:text-gray-300">
                      <span>${nextMilestone.current} raised</span>
                      <span>Goal: ${nextMilestone.goal}</span>
                    </div>
                    <Progress 
                      value={(nextMilestone.current / nextMilestone.goal) * 100} 
                      className="h-3 bg-gray-200 dark:bg-gray-800"
                    />
                    <div className="flex justify-between text-gray-500 dark:text-gray-400 text-sm">
                      <span>{Math.round((nextMilestone.current / nextMilestone.goal) * 100)}% of goal reached</span>
                      <span>{state.totalDonors} supporters</span>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* Community Support Section */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Users className="w-6 h-6 text-blue-500" />
                Community Support
              </h2>
              <Card className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
                <div className="space-y-6">
                  {/* Recent Activity */}
                  <div>
                    <h3 className="text-base font-medium text-gray-600 dark:text-gray-400 mb-3">Recent Activity</h3>
                    <div className="space-y-3">
                      {state.recentTips?.slice(0, 3).map((tip, index) => (
                        <div key={index} className="flex items-center justify-between text-base hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-lg transition-colors">
                          <span className="text-gray-700 dark:text-gray-300">{tip.sender}</span>
                          <span className="text-green-500 font-medium">${tip.amount}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator className="bg-gray-200 dark:bg-gray-800" />

                  {/* Top Supporters */}
                  <div>
                    <h3 className="text-base font-medium text-gray-600 dark:text-gray-400 mb-3">Top Supporters</h3>
                    <div className="space-y-3">
                      {state.topTippers?.slice(0, 3).map((tipper, index) => (
                        <div key={index} className="flex items-center justify-between text-base hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-lg transition-colors">
                          <div className="flex items-center gap-2">
                            {index === 0 && <Sparkles className="w-5 h-5 text-yellow-500" />}
                            <span className="text-gray-700 dark:text-gray-300">{tipper.username}</span>
                          </div>
                          <span className="text-purple-500 font-medium">${tipper.totalTips}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* FAQ Section */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <HelpCircle className="w-6 h-6 text-purple-500" />
                Frequently Asked Questions
              </h2>
              <Card className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <HelpCircle className="w-6 h-6 text-purple-500 flex-shrink-0" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Is my donation secure?</h3>
                      <p className="text-gray-600 dark:text-gray-400">Yes, we use industry-standard encryption to protect your information</p>
                    </div>
                  </div>
                  <Separator className="bg-gray-200 dark:bg-gray-800" />
                  <div className="flex items-start gap-4">
                    <HelpCircle className="w-6 h-6 text-blue-500 flex-shrink-0" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Can I get a refund?</h3>
                      <p className="text-gray-600 dark:text-gray-400">Donations are non-refundable as they are immediately put to use</p>
                    </div>
                  </div>
                  <Separator className="bg-gray-200 dark:bg-gray-800" />
                  <div className="flex items-start gap-4">
                    <HelpCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">How often can I donate?</h3>
                      <p className="text-gray-600 dark:text-gray-400">You can donate as often as you like - every contribution helps!</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}