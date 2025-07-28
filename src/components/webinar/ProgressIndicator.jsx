import React from 'react';
import { motion } from 'framer-motion';

export default function ProgressIndicator({ currentStep, totalSteps }) {
  return (
    <div className="flex justify-center items-center space-x-2 mb-8">
      {Array.from({ length: totalSteps }, (_, index) => (
        <motion.div
          key={index}
          className={`h-2 rounded-full transition-all duration-300 ${
            index < currentStep 
              ? 'w-8 bg-gradient-to-r from-[#FFB400] to-[#FF8C00]' 
              : index === currentStep
              ? 'w-6 bg-[#FFB400]'
              : 'w-2 bg-gray-200'
          }`}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: index * 0.1 }}
        />
      ))}
    </div>
  );
}