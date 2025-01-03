import { Testimonial, PurchaseTier, CommunityStats } from '../types/subscription';

export const testimonials: Testimonial[] = [
  {
    name: 'Alex Johnson',
    role: 'Creator',
    avatarSeed: 'alex123',
    text: "This platform has completely transformed how I connect with my audience. The support system is incredible!"
  },
  {
    name: 'Maria Gonzalez',
    role: 'Supporter',
    avatarSeed: 'maria456',
    text: "I love being part of this community. The exclusive content and early access make it totally worth it!"
  },
  {
    name: 'James Smith',
    role: 'Visionary',
    avatarSeed: 'james789',
    text: "As a long-time supporter, I've seen this platform grow into something truly special. Highly recommend!"
  }
];

export const purchaseTiers: PurchaseTier[] = [
  {
    name: 'Supporter',
    price: '$10',
    pulse: '2000 Pulse',
    benefits: [
      'Early access to new features',
      'Supporter badge on profile',
      'Basic analytics access',
      'Access to community Discord',
      'One-time purchase'
    ],
    popular: false,
    color: 'from-green-400 to-blue-400'
  },
  {
    name: 'Creator',
    price: '$30',
    pulse: '5000 Pulse',
    benefits: [
      'All Supporter benefits',
      'Custom profile theme',
      'Advanced analytics',
      'Priority support',
      'Exclusive content library',
      'One-time purchase'
    ],
    popular: true,
    color: 'from-purple-400 to-pink-400'
  },
  {
    name: 'Visionary',
    price: '$50',
    pulse: '10000 Pulse',
    benefits: [
      'All Creator benefits',
      'Early voting on new features',
      'Personalized thank you',
      '1:1 consultation',
      'Founder recognition',
      'One-time purchase'
    ],
    popular: false,
    color: 'from-yellow-400 to-orange-400'
  }
];

export const communityStats: CommunityStats[] = [
  {
    title: 'Projects Funded',
    value: '1,234',
    description: 'Creative projects brought to life'
  },
  {
    title: 'Community Members',
    value: '5,678',
    description: 'Active participants in our ecosystem'
  },
  {
    title: 'Total Pledges',
    value: '$123,456',
    description: 'Invested in creators and projects'
  }
];