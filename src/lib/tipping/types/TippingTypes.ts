export interface TippingSectionProps {
  creatorId: string;
  creatorName: string;
}

export interface Tip {
  amount: number;
  timestamp: string;
  sender: string;
}

export interface Tipper {
  username: string;
  totalTips: number;
}

export interface Milestone {
  goal: number;
  current: number;
  description: string;
}

export interface TippingState {
  isTipping: boolean;
  showTipModal: boolean;
  tipAmount: number;
  selectedAmount: number;
  customAmount: string;
  userBalance: number;
  recentTips: Tip[];
  topTippers: Tipper[];
  milestones: Milestone[];
  showSuccess: boolean;
  isLoading: boolean;
  isValidAmount: boolean;
}