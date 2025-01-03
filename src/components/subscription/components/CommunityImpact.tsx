import React from 'react';
import { Card } from '../../ui/card';
import { communityStats } from '../utils/data';

const CommunityImpact = () => {
  return (
    <div className="mt-20">
      <h2 className="text-2xl font-bold text-center text-white mb-8">
        Your Impact
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {communityStats.map((stat, i) => (
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
  );
};

export default CommunityImpact;