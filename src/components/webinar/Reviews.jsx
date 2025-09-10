import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const reviews = [
  {
    name: 'Barbara S.',
    age: 68,
    text: "This information was a lifesaver. The presenters made complex topics so easy to understand about the Veteran Giveback Benefit. I'm now saving over $150 a month!",
    image: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?q=80&w=300&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Robert P.',
    age: 66,
    text: 'I thought I knew everything about veteran benefits, but I learned so many new strategies. 100% recommend this to anyone looking into the Veteran Giveback Benefit.',
    image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=300&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  }
];

const StarRating = () => (
  <div className="flex space-x-0.5">
    {[...Array(5)].map((_, i) => (
      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
    ))}
  </div>
);

export default function Reviews() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="mt-6 space-y-4"
    >
      {reviews.map((review, index) => (
        <div key={index} className="bg-white/70 backdrop-blur-sm p-4 rounded-xl shadow-md border border-gray-100 flex items-start space-x-4">
          <img src={review.image} alt={review.name} className="w-16 h-16 rounded-full object-cover border-2 border-white" />
          <div className="flex-1">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-bold text-[#0D2C4C]">{review.name}</p>
                <p className="text-xs text-gray-500">Age {review.age}</p>
              </div>
              <StarRating />
            </div>
            <p className="text-sm text-gray-700 mt-2 italic">"{review.text}"</p>
          </div>
        </div>
      ))}
    </motion.div>
  );
}