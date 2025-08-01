import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Calendar } from 'lucide-react';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function BirthMonthStep({ firstName, selectedMonth, onNext, onBack }) {
  const [selected, setSelected] = useState(selectedMonth || '');

  const handleMonthSelect = (month) => {
    setSelected(month);
    // Small delay to show selection, then advance
    setTimeout(() => {
      onNext(month);
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
          <span className="text-sm font-medium text-blue-900">Birth Month</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-2xl font-bold text-[#0D2C4C] mb-2">
          What month were you born, {firstName}?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-gray-600">
          We use this to personalize the webinar.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {months.map((month) => (
          <button
            key={month}
            onClick={() => handleMonthSelect(month)}
            className={`p-3 md:p-4 rounded-xl border-2 text-center transition-all duration-200 touch-manipulation ${
              selected === month
                ? 'border-[#FFB400] bg-[#FFB400]/10 text-[#0D2C4C] shadow-md'
                : 'border-gray-200 bg-white hover:border-[#FFB400]/50 hover:bg-[#FFB400]/5 text-gray-700'
            }`}>
            <div className="font-semibold">{month}</div>
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