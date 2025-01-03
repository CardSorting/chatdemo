import { useParams } from "react-router-dom";
import { useTipping } from "@lib/tipping/hooks/useTipping";
import { TippingStats } from "@lib/tipping/components/TippingStats";
import { TippingForm } from "@lib/tipping/components/TippingForm";
import { Button } from "../../components/ui/button";
import { ArrowLeft, Gift, Trophy, Users, Sparkles, Share2, Heart, Loader2, CreditCard, Shield, Smile, MessageCircle, Image, BookOpen, Check, Star, Clock, TrendingUp, HelpCircle, Video, PieChart, Calendar, BadgeCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "../../components/ui/card";
import { Progress } from "../../components/ui/progress";
import { Separator } from "../../components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "../../components/ui/avatar";
import { Skeleton } from "../../components/ui/skeleton";
import { useState } from "react";
import { toast } from "../../components/ui/use-toast";
import { UseTippingReturn } from "@lib/tipping/types";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/utils";

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
      {/* Enhanced Sticky Header */}
      <motion.div 
        className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
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
      </motion.div>

      <div className="container mx-auto px-4 pt-20 pb-8">
        {/* Enhanced Hero Section */}
        <motion.div 
          className="relative bg-gradient-to-r from-purple-600 to-blue-500 rounded-xl overflow-hidden mb-12 shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          <div className="relative z-10 p-8 text-center">
            <div className="max-w-3xl mx-auto">
              <div className="flex justify-center mb-6">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Avatar className="w-32 h-32 border-4 border-white/20 shadow-lg">
                    <AvatarImage src={state.creator?.avatar} />
                    <AvatarFallback className="bg-gradient-to-r from-purple-500 to-blue-400 text-white">
                      {creatorName?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </motion.div>
              </div>
              <motion.h1 
                className="text-5xl font-bold text-white mb-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                Support {creatorName}
              </motion.h1>
              <motion.p 
                className="text-white/90 text-xl max-w-prose mx-auto mb-8 leading-relaxed"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 }}
              >
                Help {creatorName} continue creating amazing content and reach new milestones
              </motion.p>
              <motion.div 
                className="flex justify-center gap-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.6 }}
              >
                <Button
                  variant="default"
                  size="lg"
                  className="bg-white text-gray-900 hover:bg-gray-100 shadow-md hover:shadow-lg transition-all"
                  onClick={() => setTipAmount(10)}
                >
                  <Heart className="w-5 h-5 mr-2" />
                  Donate $10
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="text-white border-white/30 hover:bg-white/10 hover:border-white/50 shadow-md hover:shadow-lg transition-all"
                  onClick={() => setTipAmount(25)}
                >
                  <Gift className="w-5 h-5 mr-2" />
                  Donate $25
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Enhanced Story Section */}
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.7 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <BookOpen className="w-7 h-7 text-purple-500" />
                The Story
              </h2>
              <Card className="p-8 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all">
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  <p className="text-gray-700 dark:text-gray-300">
                    {creatorName} has been creating amazing content that inspires and entertains thousands of people. 
                    Your support will help them continue their journey and reach new heights in their creative endeavors.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 mt-6">
                    With your contributions, {creatorName} will be able to:
                  </p>
                  <ul className="text-gray-700 dark:text-gray-300 space-y-2 mt-4">
                    <li className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-green-500" />
                      Invest in better equipment and tools
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-green-500" />
                      Create more high-quality content
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-green-500" />
                      Expand their reach to new audiences
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-green-500" />
                      Develop innovative projects
                    </li>
                  </ul>
                </div>
              </Card>
            </motion.div>

            {/* Enhanced How Funds Will Be Used Section */}
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.8 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <PieChart className="w-7 h-7 text-blue-500" />
                How Funds Will Be Used
              </h2>
              <Card className="p-8 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <PieChart className="w-8 h-8 text-purple-500 flex-shrink-0" />
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Content Creation</h3>
                      <p className="text-gray-600 dark:text-gray-400 mt-2">50% of funds will go towards creating new content</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <TrendingUp className="w-8 h-8 text-blue-500 flex-shrink-0" />
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Growth & Marketing</h3>
                      <p className="text-gray-600 dark:text-gray-400 mt-2">30% will be used to reach new audiences</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <Video className="w-8 h-8 text-green-500 flex-shrink-0" />
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Equipment</h3>
                      <p className="text-gray-600 dark:text-gray-400 mt-2">15% will be invested in better equipment</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <Shield className="w-8 h-8 text-yellow-500 flex-shrink-0" />
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Platform Fees</h3>
                      <p className="text-gray-600 dark:text-gray-400 mt-2">5% covers platform and payment processing fees</p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Enhanced Updates Section */}
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.9 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <Calendar className="w-7 h-7 text-purple-500" />
                Updates
              </h2>
              <Card className="p-8 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all">
                <div className="space-y-8">
                  <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <Calendar className="w-8 h-8 text-purple-500 flex-shrink-0" />
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">New Content Coming Soon!</h3>
                      <p className="text-gray-600 dark:text-gray-400 mt-2">We're working on exciting new projects thanks to your support</p>
                      <p className="text-gray-500 dark:text-gray-500 text-sm mt-3">Posted 3 days ago</p>
                    </div>
                  </div>
                  <Separator className="bg-gray-200 dark:bg-gray-800" />
                  <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <BadgeCheck className="w-8 h-8 text-blue-500 flex-shrink-0" />
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">First Milestone Reached!</h3>
                      <p className="text-gray-600 dark:text-gray-400 mt-2">We've hit our first funding goal - thank you everyone!</p>
                      <p className="text-gray-500 dark:text-gray-500 text-sm mt-3">Posted 1 week ago</p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Enhanced Sidebar */}
          <div className="space-y-12">
            {/* Enhanced Progress Section */}
            {nextMilestone && (
              <motion.div 
                className="space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 1.0 }}
              >
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                  <TrendingUp className="w-7 h-7 text-purple-500" />
                  Campaign Progress
                </h2>
                <Card className="p-8 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all">
                  <div className="space-y-6">
                    <div className="flex justify-between text-gray-700 dark:text-gray-300 text-lg">
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
              </motion.div>
            )}

            {/* Enhanced Community Support Section */}
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 1.1 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <Users className="w-7 h-7 text-blue-500" />
                Community Support
              </h2>
              <Card className="p-8 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all">
                <div className="space-y-8">
                  {/* Recent Activity */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                      {state.recentTips?.slice(0, 3).map((tip, index) => (
                        <div key={index} className="flex items-center justify-between text-lg hover:bg-gray-100 dark:hover:bg-gray-800 p-3 rounded-lg transition-colors">
                          <span className="text-gray-700 dark:text-gray-300">{tip.sender}</span>
                          <span className="text-green-500 font-medium">${tip.amount}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator className="bg-gray-200 dark:bg-gray-800" />

                  {/* Top Supporters */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-4">Top Supporters</h3>
                    <div className="space-y-4">
                      {state.topTippers?.slice(0, 3).map((tipper, index) => (
                        <div key={index} className="flex items-center justify-between text-lg hover:bg-gray-100 dark:hover:bg-gray-800 p-3 rounded-lg transition-colors">
                          <div className="flex items-center gap-3">
                            {index === 0 && <Sparkles className="w-6 h-6 text-yellow-500" />}
                            <span className="text-gray-700 dark:text-gray-300">{tipper.username}</span>
                          </div>
                          <span className="text-purple-500 font-medium">${tipper.totalTips}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Enhanced FAQ Section */}
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 1.2 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <HelpCircle className="w-7 h-7 text-purple-500" />
                Frequently Asked Questions
              </h2>
              <Card className="p-8 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all">
                <div className="space-y-8">
                  <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <HelpCircle className="w-8 h-8 text-purple-500 flex-shrink-0" />
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Is my donation secure?</h3>
                      <p className="text-gray-600 dark:text-gray-400 mt-2">Yes, we use industry-standard encryption to protect your information</p>
                    </div>
                  </div>
                  <Separator className="bg-gray-200 dark:bg-gray-800" />
                  <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <HelpCircle className="w-8 h-8 text-blue-500 flex-shrink-0" />
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Can I get a refund?</h3>
                      <p className="text-gray-600 dark:text-gray-400 mt-2">Donations are non-refundable as they are immediately put to use</p>
                    </div>
                  </div>
                  <Separator className="bg-gray-200 dark:bg-gray-800" />
                  <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <HelpCircle className="w-8 h-8 text-green-500 flex-shrink-0" />
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">How often can I donate?</h3>
                      <p className="text-gray-600 dark:text-gray-400 mt-2">You can donate as often as you like - every contribution helps!</p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}