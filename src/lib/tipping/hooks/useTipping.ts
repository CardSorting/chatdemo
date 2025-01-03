import { useState, useEffect } from "react";
import { useAuth } from "../../../lib/auth";
import { sendTip, getPulseBalance } from "../../../services/pulse/pulseService";
import { toast } from "../../../components/ui/use-toast";
import type { TippingState, CompanionPulsePledge, Milestone, UseTippingReturn, TopTipper } from "../types/index";
import { supabase } from "../../../lib/supabase";

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
    try {
      const { data: pledges, error } = await supabase
        .from('new_companion_pulse_pledges')
        .select(`
          id,
          companion_id,
          pledger_id,
          amount,
          created_at,
          profiles:pledger_id (username)
        `)
        .eq('companion_id', creatorId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      setState(prev => ({
        ...prev,
        recentTips: pledges?.map(pledge => ({
          id: pledge.id,
          companion_id: pledge.companion_id,
          pledger_id: pledge.pledger_id,
          amount: pledge.amount,
          created_at: pledge.created_at,
          profiles: pledge.profiles?.[0] || { username: 'Anonymous' }
        })) || []
      }));
    } catch (error) {
      console.error('Error fetching recent tips:', error);
      toast({
        title: "Error",
        description: "Failed to load recent tips",
        variant: "destructive",
      });
    }
  };

  const fetchTopTippers = async () => {
    try {
      const { data: topTippers, error } = await supabase
        .rpc('get_top_tippers', {
          companion_id_param: creatorId,
          limit_param: 10
        });

      if (error) throw error;

      setState(prev => ({
        ...prev,
        topTippers: topTippers.map(t => ({
          pledger_id: t.pledger_id,
          username: t.username || 'Anonymous',
          total_pledged: t.total_pledged || 0
        })),
        totalDonors: topTippers.length
      }));
    } catch (error) {
      console.error('Error fetching top tippers:', error);
      toast({
        title: "Error",
        description: "Failed to load top tippers",
        variant: "destructive",
      });
    }
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
      // First deduct the pulse using sendTip
      const tipResult = await sendTip(session.user.id, creatorId, amount);
      if (!tipResult.success) {
        throw new Error(tipResult.message);
      }

      // Then create the pledge record
      const { error: pledgeError } = await supabase
        .from('new_companion_pulse_pledges')
        .insert({
          companion_id: creatorId,
          pledger_id: session.user.id,
          amount: amount
        });

      if (pledgeError) throw pledgeError;

      // Update state
      setState(prev => ({
        ...prev,
        showSuccess: true,
        userBalance: prev.userBalance - amount
      }));

      // Refresh tips data
      await Promise.all([
        fetchRecentTips(),
        fetchTopTippers()
      ]);

      setTimeout(() => setState(prev => ({ ...prev, showSuccess: false })), 2000);
      toast({
        title: "Tip Sent!",
        description: `You successfully sent ${amount} Pulse to ${creatorId}`,
      });
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
