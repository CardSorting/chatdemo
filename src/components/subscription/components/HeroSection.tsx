import React from 'react';
import { motion } from 'framer-motion';
import { Progress } from '../../ui/progress';
import { Button } from '../../ui/button';
import { formatTime } from '../../subscription/utils/formatTime';
import { testimonials } from '../../subscription/utils/data';

const HeroSection = () => {
  const [memberCount, setMemberCount] = React.useState(1242);
  const [timeLeft, setTimeLeft] = React.useState(86400); // 24 hours in seconds

  // Countdown timer
  React.useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setMemberCount(prev => prev + Math.floor(Math.random() * 10));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
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
  );
};

export default HeroSection;