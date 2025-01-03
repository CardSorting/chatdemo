export interface Testimonial {
  name: string;
  role: string;
  avatarSeed: string;
  text: string;
}

export interface PurchaseTier {
  name: string;
  price: string;
  pulse: string;
  benefits: string[];
  popular: boolean;
  color: string;
}

export interface CommunityStats {
  title: string;
  value: string;
  description: string;
}

export interface Purchase {
  id: string;
  user_id: string;
  tier: string;
  payment_id: string;
  amount: number;
  payment_date: string;
  status: PurchaseStatus;
  pulse_amount: number;
  benefits: string[];
  created_at: string;
}

export type PurchaseStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface PayPalButtonContainerRef {
  current: HTMLDivElement | null;
  purchaseDetails?: {
    tier: string;
    amount: number;
    pulseAmount: number;
  };
}