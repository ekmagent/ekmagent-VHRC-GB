import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight } from 'lucide-react';

export default function ZipCodeStep({ formData, onNext, onBack }) {
  const [zipCode, setZipCode] = useState(formData.zipCode || '');
  const [error, setError] = useState('');
  const [focused, setFocused] = useState(true);

  const handleNext = () => {
    if (!zipCode.trim()) {
      setError('Please enter your zip code');
      return;
    }
    
    // Basic zip code validation (5 digits)
    const zipRegex = /^\d{5}$/;
    if (!zipRegex.test(zipCode.trim())) {
      setError('Please enter a valid 5-digit zip code');
      return;
    }

    setError('');
    onNext(zipCode.trim());
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleNext();
    }
  };

  const handleZipChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 5); // Only digits, max 5
    setZipCode(value);
    if (error) setError('');
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
          So we can get you information specific to your area, what is your zip code?
        </h2>
        <p className="text-gray-600 text-lg">
          This helps us provide the most accurate benefit information for your location.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-4"
      >
        <div>
          <Input
            type="tel"
            value={zipCode}
            onChange={handleZipChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Enter your 5-digit zip code"
            className={`h-16 text-center text-xl rounded-xl border-2 bg-white transition-all duration-200 ${
              error
                ? 'border-red-400 focus:border-red-500'
                : focused
                ? 'border-[#FFB400]'
                : 'border-gray-200'
            }`}
            maxLength={5}
            autoFocus
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
    </motion.div>
  );
}
