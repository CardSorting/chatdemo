import { useState, useEffect } from "react";
import { useAuth } from "../../../lib/auth";
import { sendTip, getPulseBalance } from "../../../services/pulse/pulseService";
import { toast } from "../../../components/ui/use-toast";
import { TippingState, Tip, Tipper, Milestone, UseTippingReturn } from "../types";

export function useTipping(creatorId: string): UseTippingReturn {
  const { session } = useAuth();
  const [state, setState] = useState<TippingState>({
    isTipping: false,
    showTipModal: false,
    tipAmount: 10,
    selectedAmount: 10,
    customAmount: "",
    userBalance: 0,
    recentTips: [],
    topTippers: [],
    milestones: [
      { goal: 1000, current: 450, description: "Support basic operations" },
      { goal: 5000, current: 2000, description: "Enable new features" },
      { goal: 10000, current: 3000, description: "Full-time development" }
    ],
    showSuccess: false,
    isLoading: false,
    isValidAmount: true,
    totalDonors: 0
  });

  useEffect(() => {
    if (session?.user?.id) {
      fetchData();
    }
  }, [session?.user?.id]);

  useEffect(() => {
    if (state.showTipModal && session?.user?.id) {
      // Refresh data when modal is shown
      fetchData();
    }
  }, [state.showTipModal]);

  const fetchData = async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      await Promise.all([
        fetchUserBalance(),
        fetchRecentTips(),
        fetchTopTippers()
      ]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load tipping data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const fetchUserBalance = async () => {
    if (!session?.user?.id) return;
    const balance = await getPulseBalance(session.user.id);
    setState(prev => ({ ...prev, userBalance: balance }));
  };

  const fetchRecentTips = async () => {
    // Mock recent tips
    setState(prev => ({
      ...prev,
      recentTips: [
        { amount: 50, timestamp: "2 minutes ago", sender: "user123" },
        { amount: 100, timestamp: "5 minutes ago", sender: "user456" },
        { amount: 20, timestamp: "10 minutes ago", sender: "user789" },
      ]
    }));
  };

  const fetchTopTippers = async () => {
    // Mock top tippers
    const topTippers = [
      { username: "user123", totalTips: 500 },
      { username: "user456", totalTips: 300 },
      { username: "user789", totalTips: 200 },
    ];
    
    setState(prev => ({
      ...prev,
      topTippers,
      totalDonors: topTippers.length
    }));
  };

  const validateAmount = (amount: number): boolean => {
    return amount > 0 && amount <= state.userBalance;
  };

  const handleTip = async (amount: number) => {
    if (!session?.user?.id) return;

    // Prevent self-tipping
    if (session.user.id === creatorId) {
      toast({
        title: "Invalid Action",
        description: "You cannot tip yourself.",
        variant: "destructive",
      });
      return;
    }

    if (!validateAmount(amount)) {
      toast({
        title: "Invalid Amount",
        description: amount > state.userBalance ? "Insufficient balance" : "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    setState(prev => ({ ...prev, isTipping: true }));
    try {
      const result = await sendTip(session.user.id, creatorId, amount);
      if (result.success) {
        setState(prev => ({
          ...prev,
          showSuccess: true,
          userBalance: prev.userBalance - amount,
          recentTips: [
            { amount, timestamp: "Just now", sender: session.user.email || "Anonymous" },
            ...prev.recentTips.slice(0, 2)
          ],
          totalDonors: prev.totalDonors + 1
        }));
        setTimeout(() => setState(prev => ({ ...prev, showSuccess: false })), 2000);
        toast({
          title: "Tip Sent!",
          description: `You successfully sent ${amount} Pulse to ${creatorId}`,
        });
      } else {
        toast({
          title: "Tip Failed",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Tip Failed",
        description: error instanceof Error ? error.message : "Failed to send tip",
        variant: "destructive",
      });
    } finally {
      setState(prev => ({
        ...prev,
        isTipping: false,
        showTipModal: false
      }));
    }
  };

  const handleCustomAmountChange = (value: string) => {
    const amount = parseFloat(value);
    setState(prev => ({
      ...prev,
      customAmount: value,
      isValidAmount: !value || validateAmount(amount)
    }));
  };

  const setTipModal = (show: boolean) => {
    setState(prev => ({ ...prev, showTipModal: show }));
  };

  const setTipAmount = (amount: number) => {
    setState(prev => ({ ...prev, tipAmount: amount, selectedAmount: amount }));
  };

  return {
    state,
    setTipModal,
    setTipAmount,
    handleTip,
    handleCustomAmountChange,
    validateAmount,
    isLoading: state.isLoading
  };
}
