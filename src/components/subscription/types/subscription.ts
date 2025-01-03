export interface Testimonial {
  name: string;
  role: string;
  avatarSeed: string;
  text: string;
}

export interface SubscriptionTier {
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

export interface PayPalButtonContainerRef {
  current: HTMLDivElement | null;
}