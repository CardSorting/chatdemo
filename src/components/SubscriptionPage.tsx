import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { useAuth } from '../hooks/useAuth';
import useSubscription from '../hooks/useSubscription';
import { motion, useAnimation } from 'framer-motion';

const SubscriptionPage = () => {
  const { session } = useAuth();
  const { isSubscribed, subscribe, unsubscribe } = useSubscription();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [memberCount, setMemberCount] = useState(1242);
  const [timeLeft, setTimeLeft] = useState(86400); // 24 hours in seconds
  const controls = useAnimation();

  // Hardcoded testimonials
  const testimonials = [
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

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${minutes}m ${secs}s`;
  };

  const subscriptionTiers = [
    {
      name: 'Supporter',
      price: billingCycle === 'monthly' ? '$5' : '$50',
      pulse: '1000 Pulse/month',
      benefits: [
        'Early access to new features',
        'Supporter badge on profile',
        'Basic analytics access',
        'Access to community Discord'
      ],
      popular: false,
      color: 'from-green-400 to-blue-400'
    },
    {
      name: 'Creator',
      price: billingCycle === 'monthly' ? '$15' : '$150',
      pulse: '2500 Pulse/month',
      benefits: [
        'All Supporter benefits',
        'Custom profile theme',
        'Advanced analytics',
        'Priority support',
        'Exclusive content library'
      ],
      popular: true,
      color: 'from-purple-400 to-pink-400'
    },
    {
      name: 'Visionary',
      price: billingCycle === 'monthly' ? '$25' : '$250',
      pulse: '5000 Pulse/month',
      benefits: [
        'All Creator benefits',
        'Early voting on new features',
        'Personalized thank you',
        '1:1 monthly consultation',
        'Founder recognition'
      ],
      popular: false,
      color: 'from-yellow-400 to-orange-400'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setMemberCount(prev => prev + Math.floor(Math.random() * 10));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleSubscribe = async (tier: string) => {
    if (!session?.user?.id) {
      console.error("User not logged in");
      return;
    }

    // Placeholder for PayPal integration
    alert(`Initiating PayPal payment for ${tier} tier.`);
    subscribe(tier);
  };

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero Section */}
      <div className="relative h-[600px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950/90 to-gray-950/50 z-10" />
        <div className="absolute inset-0 z-0">
          <motion.div 
            className="absolute w-[200%] h-[200%] bg-gradient-conic from-green-400/20 via-blue-400/20 to-purple-400/20 animate-spin-slow"
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          />
        </div>
        
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
          <div className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-lg border border-gray-800">
            <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-400">
              Power the Future - Limited Time Offer!
            </h1>
            <div className="mt-6 text-xl text-gray-300 max-w-2xl space-y-4">
              <p>
                Join the movement shaping the future of digital experiences. 
                <span className="font-bold text-white"> Only {formatTime(timeLeft)} left</span> to lock in exclusive benefits!
              </p>
              <div className="flex items-center space-x-4">
                <div className="flex -space-x-2">
                  {testimonials.slice(0, 3).map((testimonial, i) => (
                    <img
                      key={i}
                      src={`https://api.dicebear.com/7.x/bottts/svg?seed=${testimonial.avatarSeed}`}
                      alt={`${testimonial.name}'s avatar`}
                      className="w-10 h-10 rounded-full border-2 border-gray-950"
                    />
                  ))}
                </div>
                <div className="text-gray-300">
                  <span className="font-bold text-white">{memberCount.toLocaleString()}</span> members and counting
                </div>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                  <span>Spots Remaining</span>
                  <span>{Math.floor((memberCount / 1500) * 100)}% Filled</span>
                </div>
                <Progress value={(memberCount / 1500) * 100} className="w-full h-2" />
              </div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-6"
              >
                <Button 
                  className="w-full md:w-auto bg-gradient-to-r from-green-400 to-blue-400 hover:from-green-500 hover:to-blue-500 text-gray-950 font-bold text-lg px-8 py-4"
                  onClick={() => window.scrollTo({ top: 600, behavior: 'smooth' })}
                >
                  Join Now - Limited Spots Available
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky CTA */}
      <div className="sticky bottom-0 z-50 bg-gray-950/95 backdrop-blur-sm border-t border-gray-800 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-white">Ready to join?</h3>
            <p className="text-sm text-gray-300">Choose your membership level</p>
          </div>
          <Button 
            className="bg-gradient-to-r from-green-400 to-blue-400 hover:from-green-500 hover:to-blue-500 text-gray-950 font-bold"
            onClick={() => window.scrollTo({ top: 600, behavior: 'smooth' })}
          >
            View Plans
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Pricing Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {subscriptionTiers.map((tier, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -10 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Card className={`relative p-8 rounded-lg bg-gray-900 border ${
                tier.popular 
                  ? 'border-green-400/50 shadow-lg shadow-green-400/20' 
                  : 'border-gray-800'
              }`}>
                {tier.popular && (
                  <div className="absolute top-0 right-0 -mt-4 -mr-4 bg-green-400 text-gray-950 px-3 py-1 rounded-full text-xs font-bold">
                    Most Popular
                  </div>
                )}
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-white">{tier.name}</h2>
                  <p className="mt-4 text-4xl font-bold text-white">
                    {tier.price}
                    <span className="text-lg text-gray-300">/{billingCycle === 'monthly' ? 'month' : 'year'}</span>
                  </p>
                  <p className="mt-2 text-gray-300">{tier.pulse}</p>
                </div>
                
                <div className="mt-8 space-y-4">
                  {tier.benefits.map((benefit, i) => (
                    <div key={i} className="flex items-center space-x-3">
                      <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-300">{benefit}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-8">
                  <Button 
                    className={`w-full font-bold ${
                      tier.popular 
                        ? 'bg-gradient-to-r from-green-400 to-blue-400 hover:from-green-500 hover:to-blue-500 text-gray-950'
                        : 'bg-gray-800 hover:bg-gray-700 text-white'
                    }`}
                    onClick={() => handleSubscribe(tier.name.toLowerCase())}
                  >
                    Subscribe
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Community Impact */}
        <div className="mt-20">
          <h2 className="text-2xl font-bold text-center text-white mb-8">
            Your Impact
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
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
            ].map((stat, i) => (
              <Card key={i} className="p-8 bg-gray-900 border-gray-800">
                <div className="text-center">
                  <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-400">
                    {stat.value}
                  </div>
                  <h3 className="mt-4 text-xl font-bold text-white">{stat.title}</h3>
                  <p className="mt-2 text-gray-300">{stat.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="mt-20">
          <h2 className="text-2xl font-bold text-center text-white mb-8">
            What Our Members Are Saying
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <Card key={i} className="p-6 bg-gray-900 border-gray-800">
                <div className="flex items-center space-x-4">
                  <img
                    src={`https://api.dicebear.com/7.x/bottts/svg?seed=${testimonial.avatarSeed}`}
                    alt={`${testimonial.name}'s avatar`}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <p className="text-white font-medium">{testimonial.name}</p>
                    <p className="text-sm text-gray-300">{testimonial.role}</p>
                  </div>
                </div>
                <p className="mt-4 text-gray-300">"{testimonial.text}"</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;