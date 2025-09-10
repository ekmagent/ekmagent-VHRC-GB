import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const aspirationOptions = [
  '👨‍👩‍👧‍👦 Protect my family\'s future with burial insurance',
  '🏥 Protect my savings with health crisis insurance',
  'Use it for housing expenses',
  'Groceries',
  'I\'m not sure yet'
];

export default function AspirationStep({ firstName, onNext, onBack }) {
    const handleSelect = (option) => {
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
                <div className="bg-[#1e3a8a]/10 rounded-lg p-4 mb-6">
                    <h2 className="text-2xl font-bold text-[#1e3a8a] mb-3">Great news, {firstName}!</h2>
                    <p className="text-lg text-gray-700 mb-3">You're one step closer to qualifying for the <span className="font-bold text-[#dc2626]">Patriot Payback</span>.</p>
                    <p className="text-xl font-bold text-[#1e3a8a]">What would you do with an extra $1,800 each year?</p>
                </div>
            </div>
            <div className="flex flex-col space-y-3">
                {aspirationOptions.map((option, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                         <Button
                            variant="outline"
                            onClick={() => handleSelect(option)}
                            className="w-full min-h-[56px] h-auto text-left justify-start text-sm rounded-xl border-2 border-gray-200 hover:border-[#dc2626] hover:bg-white p-4 whitespace-normal break-words leading-tight"
                        >
                            <span className="block w-full text-left leading-snug">
                                {option}
                            </span>
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
