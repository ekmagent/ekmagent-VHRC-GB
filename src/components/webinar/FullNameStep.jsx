import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function FullNameStep({ formData, onUpdateData, onNext, onBack }) {
  const [errors, setErrors] = useState({});

  const handleNext = () => {
    const newErrors = {};
    if (!formData.firstName?.trim()) {
      newErrors.firstName = 'First name is required.';
    }
    if (!formData.lastName?.trim()) {
      newErrors.lastName = 'Last name is required.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    onNext();
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
          Who should we register for the event?
        </h2>
        <p className="text-gray-600 text-lg">
          Please enter your full name.
        </p>
      </div>

      <div className="space-y-4">
        <div>
            <Input
              autoFocus
              type="text"
              placeholder="First Name"
              value={formData.firstName || ''}
              onChange={(e) => onUpdateData('firstName', e.target.value)}
              onKeyDown={handleKeyDown}
              className={`h-14 text-lg rounded-xl border-2 transition-all duration-200 ${errors.firstName ? 'border-red-400' : 'focus:border-[#FFB400]'}`}
            />
            {errors.firstName && <p className="text-red-500 text-sm mt-1 ml-2">{errors.firstName}</p>}
        </div>
        <div>
            <Input
              type="text"
              placeholder="Last Name"
              value={formData.lastName || ''}
              onChange={(e) => onUpdateData('lastName', e.target.value)}
              onKeyDown={handleKeyDown}
              className={`h-14 text-lg rounded-xl border-2 transition-all duration-200 ${errors.lastName ? 'border-red-400' : 'focus:border-[#FFB400]'}`}
            />
            {errors.lastName && <p className="text-red-500 text-sm mt-1 ml-2">{errors.lastName}</p>}
        </div>
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