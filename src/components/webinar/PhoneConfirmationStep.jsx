import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Phone, CheckCircle } from 'lucide-react';

export default function PhoneConfirmationStep({ currentPhone, onConfirmed, onBack }) {
  const [showUpdate, setShowUpdate] = useState(false);
  const [newPhone, setNewPhone] = useState('');
  const [error, setError] = useState('');

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
    setNewPhone(formatted);
    setError('');
  };

  const isValidPhone = (phoneNumber) => {
    const cleaned = phoneNumber.replace(/\D/g, '');
    
    if (cleaned.length !== 10) return false;
    
    const invalidPatterns = [
      /^0{10}$/, /^1{10}$/, /^2{10}$/, /^3{10}$/, /^4{10}$/,
      /^5{10}$/, /^6{10}$/, /^7{10}$/, /^8{10}$/, /^9{10}$/,
      /^1234567890$/, /^0123456789$/
    ];
    
    for (const pattern of invalidPatterns) {
      if (pattern.test(cleaned)) return false;
    }
    
    const areaCode = cleaned.substring(0, 3);
    if (areaCode.startsWith('0') || areaCode.startsWith('1')) return false;
    
    const exchangeCode = cleaned.substring(3, 6);
    if (exchangeCode.startsWith('0') || exchangeCode.startsWith('1')) return false;
    
    return true;
  };

  const handleConfirmCurrent = () => {
    onConfirmed(currentPhone);
  };

  const handleUpdatePhone = () => {
    const cleaned = newPhone?.replace(/\D/g, '') || '';
    if (cleaned.length < 10) {
      setError('Please enter a valid 10-digit phone number.');
      return;
    }
    if (!isValidPhone(newPhone)) {
      setError('Please enter a valid phone number.');
      return;
    }
    setError('');
    // Confirm the new phone number
    onConfirmed(newPhone);
  };

  const handleShowUpdate = () => {
    setShowUpdate(true);
    setNewPhone(currentPhone); // Pre-fill with current number
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {!showUpdate ? (
        // Confirmation screen
        <>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="w-8 h-8 text-[#1e3a8a]" />
            </div>
            <h2 className="text-2xl font-bold text-[#1e3a8a] mb-3">
              Confirm your phone number
            </h2>
            <p className="text-gray-600 text-lg mb-6">
              We'll contact you about your qualified benefits at:
            </p>
            <div className="bg-blue-50 rounded-xl p-4 mb-6">
              <p className="text-2xl font-bold text-[#1e3a8a]">{currentPhone}</p>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleConfirmCurrent}
              className="w-full h-16 text-lg font-bold rounded-xl bg-[#22c55e] hover:bg-[#16a34a] text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-3"
            >
              <CheckCircle className="w-6 h-6" />
              Yes, this number is correct
            </Button>
            
            <Button
              variant="outline"
              onClick={handleShowUpdate}
              className="w-full h-14 text-lg rounded-xl border-2 border-gray-300 hover:border-[#1e3a8a] hover:bg-blue-50 transition-all duration-200"
            >
              No, I want to update my number
            </Button>
          </div>
        </>
      ) : (
        // Update phone screen
        <>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-[#1e3a8a] mb-3">
              Update your phone number
            </h2>
            <p className="text-gray-600 text-lg">
              Enter the best number to reach you for your benefits information.
            </p>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <Input
                autoFocus
                type="tel"
                value={newPhone}
                onChange={handlePhoneChange}
                placeholder="(555) 123-4567"
                className={`h-16 text-center text-xl rounded-xl border-2 bg-white transition-all duration-200 ${
                  error
                    ? 'border-red-400 focus:border-red-500'
                    : 'border-gray-200 focus:border-[#1e3a8a]'
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

            <div className="space-y-3">
              <Button
                onClick={handleUpdatePhone}
                className="w-full h-14 text-lg font-bold rounded-xl bg-[#1e3a8a] hover:bg-[#1e40af] text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200"
              >
                Update & Confirm This Number
              </Button>
              
              <Button
                variant="outline"
                onClick={() => setShowUpdate(false)}
                className="w-full h-12 text-base rounded-xl border-2 border-gray-300 hover:border-gray-400"
              >
                Cancel
              </Button>
            </div>
          </div>
        </>
      )}

      <div className="text-center">
        <Button variant="link" onClick={onBack} className="text-gray-500 text-sm">
          Back
        </Button>
      </div>
    </motion.div>
  );
}
