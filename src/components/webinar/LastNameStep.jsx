import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function LastNameStep({ formData, onNext, onBack }) {
  const [lastName, setLastName] = useState(formData.lastName || '');
  const [error, setError] = useState('');
  const [focused, setFocused] = useState(true);

  const handleNext = () => {
    if (!lastName.trim()) {
      setError('Please enter your last name.');
      return;
    }
    setError('');
    onNext(lastName.trim());
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleNext();
    }
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
          And your last name?
        </h2>
      </div>

      <div className="relative">
        <Input
          autoFocus
          type="text"
          placeholder="Enter your last name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`h-16 text-center text-xl rounded-xl border-2 transition-all duration-200 ${
            error
              ? 'border-red-400 focus:border-red-500'
              : focused
              ? 'border-[#FFB400]'
              : 'border-gray-200'
          }`}
        />
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-500 text-sm mt-2 text-center"
          >
            {error}
          </motion.p>
        )}
      </div>

      <div className="flex flex-col items-center space-y-3">
        <Button
          type="button"
          onClick={handleNext}
          className="h-14 w-full max-w-xs text-lg font-bold rounded-xl bg-[#FFB400] hover:bg-[#FF8C00] text-[#0D2C4C] shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2"
        >
          Continue <ArrowRight size={20} />
        </Button>
        <Button variant="link" onClick={onBack} className="text-gray-500 text-sm">
          Back
        </Button>
      </div>
    </motion.div>
  );
}