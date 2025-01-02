import { motion } from "framer-motion";
import { Gift, Heart, History, Info, Trophy, X, Zap } from "lucide-react";

import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Progress } from "../../../components/ui/progress";
import { ScrollArea } from "../../../components/ui/scroll-area";
import { Skeleton } from "../../../components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../../components/ui/tooltip";
import { TippingState } from "../types/TippingTypes";
import { getProgressValue, getTipProgressValue } from "../utils/tippingUtils";

interface TippingModalProps {
  state: TippingState;
  creatorName: string;
  onClose: () => void;
  onTip: (amount: number) => void;
  onCustomTip: () => void;
  onCustomAmountChange: (value: string) => void;
  setTipAmount: (amount: number) => void;
}

export function TippingModal({
  state,
  creatorName,
  onClose,
  onTip,
  onCustomTip,
  onCustomAmountChange,
  setTipAmount,
}: TippingModalProps) {
  return (
    <Dialog open={state.showTipModal} onOpenChange={onClose}>
      {/* 
        1) Changed h-[90vh] sm:h-[80vh] to max-h so it doesn’t overflow the screen.
        2) Removed sticky bottom-0 z-50 from the footer to avoid z-index collisions.
      */}
      <DialogContent className="max-w-[90vw] sm:max-w-[800px] max-h-[90vh] sm:max-h-[80vh] p-0 flex flex-col">
        <div className="w-full h-full flex flex-col">
          {/* Header */}
          <DialogHeader className="sticky top-0 z-50 bg-white dark:bg-gray-900 px-4 sm:px-6 py-4 border-b">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-lg sm:text-xl">
                  Support {creatorName}
                </DialogTitle>
                <DialogDescription className="mt-1 text-sm sm:text-base">
                  Your support helps creators continue their work
                </DialogDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </DialogHeader>

          {/* Content */}
          <ScrollArea className="px-4 sm:px-6 py-4 flex-1">
            <div className="space-y-6">
              {state.isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : (
                <>
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
                        onChange={(e) => onCustomAmountChange(e.target.value)}
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
                      value={getTipProgressValue(
                        state.customAmount
                          ? parseFloat(state.customAmount)
                          : state.tipAmount,
                        state.userBalance
                      )}
                      className="h-2"
                    />
                  </div>

                  {/* Milestones */}
                  <Card className="p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Zap className="w-5 h-5 text-primary" />
                      <h3 className="font-medium text-lg">Creator Milestones</h3>
                    </div>
                    <div className="space-y-4">
                      {state.milestones.map((milestone, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>{milestone.description}</span>
                            <span>
                              {milestone.current}/{milestone.goal} Pulse
                            </span>
                          </div>
                          <div className="relative h-2">
                            <Progress
                              value={getProgressValue(
                                milestone.current,
                                milestone.goal
                              )}
                              className="h-full"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* Top Supporters */}
                  <Card className="p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Trophy className="w-5 h-5 text-primary" />
                      <h3 className="font-medium text-lg">Top Supporters</h3>
                    </div>
                    <div className="space-y-3">
                      {state.topTippers.map((tipper, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-800"
                        >
                          <div className="flex items-center gap-2">
                            {index === 0 && (
                              <Trophy className="w-4 h-4 text-yellow-500" />
                            )}
                            <span className="font-medium">
                              {tipper.username}
                            </span>
                          </div>
                          <Badge variant="secondary" className="ml-2">
                            {tipper.totalTips} Pulse
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* Recent Activity */}
                  <Card className="p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <History className="w-5 h-5 text-primary" />
                      <h3 className="font-medium text-lg">Recent Activity</h3>
                    </div>
                    <div className="space-y-3">
                      {state.recentTips.map((tip, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-800"
                        >
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">{tip.amount} Pulse</Badge>
                            <span className="text-sm text-gray-600">
                              {tip.sender}
                            </span>
                          </div>
                          <span className="text-sm text-gray-500">
                            {tip.timestamp}
                          </span>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* Community Impact */}
                  <Card className="p-4 bg-gradient-to-br from-primary/5 to-primary/10">
                    <div className="flex items-center gap-2 mb-3">
                      <Heart className="w-5 h-5 text-primary" />
                      <h3 className="font-medium text-lg">Community Impact</h3>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                      Your support enables {creatorName} to create more content
                      and improve the platform for everyone. Join our community
                      of supporters and help shape the future of this project.
                    </p>
                  </Card>
                </>
              )}
            </div>
          </ScrollArea>

          {/* Footer (no longer sticky) */}
          <div className="bg-white dark:bg-gray-900 px-4 sm:px-6 py-4 border-t">
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={onClose}
                className="min-w-[100px]"
              >
                Cancel
              </Button>
              <Button
                onClick={() =>
                  state.customAmount ? onCustomTip() : onTip(state.tipAmount)
                }
                disabled={
                  state.isTipping ||
                  state.isLoading ||
                  (state.customAmount && !state.isValidAmount)
                }
                className="min-w-[140px] relative"
              >
                <span
                  className={`transition-opacity ${
                    state.isTipping ? "opacity-0" : "opacity-100"
                  }`}
                >
                  Send {state.customAmount || state.tipAmount} Pulse
                </span>
                {state.isTipping && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <Gift className="w-5 h-5" />
                    </motion.div>
                  </div>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
