import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const journeyOptions = [
  'Just starting out—learning the basics',
  'Comparing plans and considering my options',
  'Ready to get this over with and enroll soon',
  'I already have a broker or agent, but want a second opinion',
  'I just have a quick question or need clarification',
  'Other / Not sure'
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
              className="w-full h-auto text-left justify-start py-4 px-4 rounded-xl border-2 border-gray-200 hover:border-[#FFB400] hover:bg-white text-base"
            >
              {option}
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