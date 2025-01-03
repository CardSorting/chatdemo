export interface CompanionPulsePledge {
  id: string;
  companion_id: string;
  pledger_id: string;
  amount: number;
  created_at: string;
  profiles?: {
    username: string;
  };
}

export interface TopTipper {
  pledger_id: string;
  username: string;
  total_pledged: number;
}

export interface TippingState {
  isTipping: boolean;
  showTipModal: boolean;
  tipAmount: number;
  selectedAmount: number;
  customAmount: string;
  userBalance: number;
  recentTips: CompanionPulsePledge[];
  topTippers: TopTipper[];
  milestones: Milestone[];
  showSuccess: boolean;
  isLoading: boolean;
  isValidAmount: boolean;
  totalDonors: number;
}

export interface Milestone {
  goal: number;
  current: number;
  description: string;
}

export interface UseTippingReturn {
  state: TippingState;
  setTipModal: (show: boolean) => void;
  setTipAmount: (amount: number) => void;
  handleTip: (amount: number) => Promise<void>;
  handleCustomAmountChange: (value: string) => void;
  validateAmount: (amount: number) => boolean;
  isLoading: boolean;
}
