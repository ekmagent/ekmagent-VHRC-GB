import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const journeyOptions = [
  'Ready to get this handled and feel confident about my choice',
  'Comparing plans and weighing my options',
  'Just starting to look into it',
  'I already have someone helping me—just curious',
  'I\'ve got a quick question',
  'Not Really Sure'
];

export default function MedicareJourneyStep({ firstName, onSubmit, onBack, isSubmitting }) {
  const handleSelect = (option) => {
    onSubmit(option); // Changed from onNext to onSubmit
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h2 className="text-2xl font-bold text-[#0D2C4C] mb-3">
          Where are you in your Medicare journey right now?
        </h2>
        <p className="text-gray-600 text-lg">
          Pick the answer that's closest—there are no wrong choices.
        </p>
      </div>
      
      <div className="flex flex-col space-y-3">
        {journeyOptions.map((option, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Button
              variant="outline"
              onClick={() => handleSelect(option)}
              disabled={isSubmitting}
              className="w-full text-left justify-start py-4 px-4 rounded-xl border-2 border-gray-200 hover:border-[#FFB400] hover:bg-white text-sm sm:text-base min-h-[64px] h-auto whitespace-normal break-words leading-relaxed overflow-hidden"
            >
              <span className="block w-full text-left leading-snug">
                {option}
              </span>
            </Button>
          </motion.div>
        ))}
      </div>
      
      <div className="text-center">
        <Button variant="link" onClick={onBack} className="text-gray-500 text-sm" disabled={isSubmitting}>
          Back
        </Button>
      </div>
    </motion.div>
  );
}