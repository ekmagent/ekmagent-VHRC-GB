import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Calendar } from 'lucide-react';

export default function BirthYearStep({ firstName, selectedYear, onNext, onBack }) {

  const getCurrentYearOptions = () => {
    const currentYear = new Date().getFullYear();
    return [
      { 
        value: 'already_65', 
        label: "I'm already 65+",
        description: "Currently enrolled in Medicare"
      },
      { 
        value: currentYear - 64, 
        label: `${currentYear - 64}`,
        description: "Turning 65 this year"
      },
      { 
        value: currentYear - 63, 
        label: `${currentYear - 63}`,
        description: "Turning 64 this year"
      },
      { 
        value: currentYear - 62, 
        label: `${currentYear - 62}`,
        description: "Turning 63 this year"
      }
    ];
  };

  const yearOptions = getCurrentYearOptions();

  const handleYearSelect = (year) => {
    // Immediately proceed to next step when year is selected
    onNext(year);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 mb-4">
          <Calendar className="w-4 h-4 text-blue-600 mr-2" />
          <span className="text-sm font-medium text-blue-900">Birth Year</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl md:text-2xl font-bold text-[#0D2C4C] mb-2">
          What year were you born, {firstName}?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-gray-600 text-sm">
          Tap your birth year to continue
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-3">
        {yearOptions.map((option, index) => (
          <motion.button
            key={option.value}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * index }}
            onClick={() => handleYearSelect(option.value)}
            className="w-full p-4 rounded-xl border-2 text-left transition-all duration-200 border-gray-200 bg-white hover:border-[#FFB400] hover:bg-[#FFB400]/5 active:scale-[0.98] touch-manipulation">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-[#0D2C4C] text-lg">
                  {option.label}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {option.description}
                </div>
              </div>
              <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-[#FFB400] opacity-0 transition-opacity duration-200"></div>
              </div>
            </div>
          </motion.button>
        ))}
      </motion.div>

      <div className="flex justify-start pt-4">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          onClick={onBack}
          className="flex items-center px-6 py-3 text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors touch-manipulation">
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back
        </motion.button>
      </div>
    </div>
  );
}