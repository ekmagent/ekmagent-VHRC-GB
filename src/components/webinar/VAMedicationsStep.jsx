import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const medicationOptions = [
  'Yes',
  'No'
];

export default function VAMedicationsStep({ firstName, onNext, onBack, onDisqualify }) {
    const handleSelect = (option) => {
        // Check for disqualification
        if (option === 'No') {
            onDisqualify('va_medications');
            return;
        }
        
        onNext(option);
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
        >
            <div className="text-center">
                <h2 className="text-2xl font-bold text-[#1e3a8a] mb-3">Do you get all your medications at the VA clinic?</h2>
                <p className="text-gray-600 text-lg">This helps us understand your current healthcare setup.</p>
            </div>
            <div className="flex flex-col space-y-3">
                {medicationOptions.map((option, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                         <Button
                            variant="outline"
                            onClick={() => handleSelect(option)}
                            className={`w-full h-14 text-left justify-start text-base rounded-xl border-2 transition-all duration-200 ${
                                option === 'Yes' 
                                    ? 'border-green-200 bg-green-50 text-green-800 hover:border-green-300' 
                                    : 'border-gray-200 hover:border-[#dc2626] hover:bg-white'
                            }`}
                        >
                            {option}
                        </Button>
                    </motion.div>
                ))}
            </div>
             <div className="text-center">
                <Button variant="link" onClick={onBack} className="text-gray-500 text-sm">
                    Back
                </Button>
            </div>
        </motion.div>
    );
}
