import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Calendar } from 'lucide-react';

export default function BirthYearStep({ firstName, selectedYear, onNext, onBack }) {
  const [selected, setSelected] = useState(selectedYear || '');

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
    setSelected(year);
    // Small delay to show selection, then advance
    setTimeout(() => {
      onNext(year);
    }, 150);
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
          className="text-2xl font-bold text-[#0D2C4C] mb-2">
          What year were you born, {firstName}?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-gray-600">
          Tap your birth year to continue
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-3">
        {yearOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => handleYearSelect(option.value)}
            className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-200 ${
              selected === option.value
                ? 'border-[#FFB400] bg-[#FFB400]/10 shadow-md'
                : 'border-gray-200 bg-white hover:border-[#FFB400]/50 hover:bg-[#FFB400]/5'
            }`}>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-[#0D2C4C] text-lg">
                  {option.label}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {option.description}
                </div>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 transition-all duration-200 ${
                selected === option.value
                  ? 'border-[#FFB400] bg-[#FFB400]'
                  : 'border-gray-300'
              }`}>
                {selected === option.value && (
                  <div className="w-full h-full rounded-full bg-white scale-50"></div>
                )}
              </div>
            </div>
          </button>
        ))}
      </motion.div>

      <div className="flex gap-3 pt-4">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          onClick={onBack}
          className="flex items-center px-6 py-3 text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back
        </motion.button>
      </div>
    </div>
  );
}