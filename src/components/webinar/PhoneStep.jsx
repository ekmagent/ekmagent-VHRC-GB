import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function PhoneStep({ formData, onNext, onBack }) {
  const [phone, setPhone] = useState(formData.phone || '');
  const [error, setError] = useState('');
  const [focused, setFocused] = useState(true);
  
  const firstName = formData.firstName || '';
  
  const formatPhone = (value) => {
    const cleaned = value.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return value;
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhone(e.target.value);
    setPhone(formatted);
  };

  // Add phone validation function
  const isValidPhone = (phoneNumber) => {
    const cleaned = phoneNumber.replace(/\D/g, '');
    
    // Check if it's 10 digits
    if (cleaned.length !== 10) return false;
    
    // Check for invalid patterns
    const invalidPatterns = [
      /^0{10}$/, // All zeros: 0000000000
      /^1{10}$/, // All ones: 1111111111
      /^2{10}$/, // All twos: 2222222222
      /^3{10}$/, // All threes, etc...
      /^4{10}$/,
      /^5{10}$/,
      /^6{10}$/,
      /^7{10}$/,
      /^8{10}$/,
      /^9{10}$/,
      /^1234567890$/, // Sequential
      /^0123456789$/, // Sequential
      /^(\d)\1{9}$/, // Any digit repeated 10 times
    ];
    
    // Check if phone matches any invalid pattern
    for (const pattern of invalidPatterns) {
      if (pattern.test(cleaned)) return false;
    }
    
    // Check area code (first 3 digits) - can't start with 0 or 1
    const areaCode = cleaned.substring(0, 3);
    if (areaCode.startsWith('0') || areaCode.startsWith('1')) return false;
    
    // Check exchange code (digits 4-6) - can't start with 0 or 1
    const exchangeCode = cleaned.substring(3, 6);
    if (exchangeCode.startsWith('0') || exchangeCode.startsWith('1')) return false;
    
    return true;
  };

  const handleNext = () => {
    const cleaned = phone?.replace(/\D/g, '') || '';
    if (cleaned.length < 10) {
      setError('Please enter a valid 10-digit phone number.');
      return;
    }
    if (!isValidPhone(phone)) {
      setError('Please enter a valid phone number.');
      return;
    }
    setError('');
    onNext(phone);
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
          Almost done{firstName ? `, ${firstName}` : ''}! Where should we send information about the benefit?
        </h2>
        <p className="text-gray-600 text-lg">
          We respect your privacy. Your number is never shared.
        </p>
      </div>

      <div className="relative">
        <Input
          autoFocus
          type="tel"
          name="phone"
          autoComplete="tel"
          placeholder="(555) 123-4567"
          value={phone}
          onChange={handlePhoneChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`h-16 text-center text-xl rounded-xl border-2 bg-white transition-all duration-200 ${
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