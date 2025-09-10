import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const militaryBranches = [
  { name: 'Army', emoji: '🪖' },
  { name: 'Navy', emoji: '⚓' },
  { name: 'Air Force', emoji: '✈️' },
  { name: 'Marines', emoji: '🦅' },
  { name: 'Coast Guard', emoji: '🛟' },
  { name: 'National Guard/Reserves', emoji: '🛡️' }
];

export default function MilitaryBranchStep({ firstName, onNext, onBack }) {
    const handleSelect = (branch) => {
        onNext(branch.name);
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
        >
            <div className="text-center">
                <h2 className="text-2xl font-bold text-[#1e3a8a] mb-3">To see if you qualify, which branch did you serve?</h2>
                <p className="text-gray-600 text-lg">Your service will always be valued by our country</p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {militaryBranches.map((branch, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="aspect-square"
                    >
                         <Button
                            variant="outline"
                            onClick={() => handleSelect(branch)}
                            className="w-full h-full flex flex-col items-center justify-center p-3 text-center rounded-xl border-2 border-gray-200 hover:border-[#dc2626] hover:bg-white transition-all duration-200 min-h-[100px] sm:min-h-[120px]"
                        >
                            <span className="text-2xl sm:text-3xl mb-2">{branch.emoji}</span>
                            <span className="text-xs sm:text-sm font-medium leading-tight">{branch.name}</span>
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