import React from 'react';
import { Card } from '../../ui/card';
import { testimonials } from '../utils/data';

const TestimonialsSection = () => {
  return (
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
  );
};

export default TestimonialsSection;