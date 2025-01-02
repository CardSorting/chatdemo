export interface Creator {
  id: string;
  name: string;
  avatar?: string;
}

export interface Tip {
  sender: string;
  amount: number;
  timestamp: string;
}

export interface Tipper {
  username: string;
  totalTips: number;
}

export interface Milestone {
  description: string;
  current: number;
  goal: number;
}

export interface TippingState {
  creator?: Creator;
  recentTips: Tip[];
  topTippers: Tipper[];
  milestones: Milestone[];
  customAmount: string;
  selectedAmount: number;
  isTipping: boolean;
  showTipModal: boolean;
  tipAmount: number;
  userBalance: number;
  error?: string;
  successMessage?: string;
  showSuccess: boolean;
  isLoading: boolean;
  isValidAmount: boolean;
}

export interface TippingFormProps {
  state: TippingState;
  onTip: (amount: number) => Promise<void>;
  onCustomTip: () => Promise<void>;
  onCustomAmountChange: (value: string) => void;
  setTipAmount: (amount: number) => void;
  isLoading: boolean;
}

export interface TippingStatsProps {
  state: TippingState;
  creatorName: string;
}

export interface UseTippingReturn {
  state: TippingState;
  setTipAmount: (amount: number) => void;
  handleTip: (amount: number) => Promise<void>;
  handleCustomAmountChange: (value: string) => void;
  isLoading: boolean;
  setTipModal: (show: boolean) => void;
  validateAmount: (amount: number) => boolean;
}