import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const costOptions = [
    "I don't pay anything",
    'Feels affordable',
    'Feels a bit expensive', 
    'Feels very expensive',
    "I'm not sure"
];

export default function InsuranceCostStep({ firstName, onNext, onBack, isSubmitting }) {
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
                <h2 className="text-2xl font-bold text-[#0D2C4C] mb-3">
                    How do your health insurance costs feel overall, {firstName}?
                </h2>
                <p className="text-gray-600 text-lg">No need for exact numbers—just your impression.</p>
            </div>
            <div className="flex flex-col space-y-3">
                {costOptions.map((option, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                    >
                         <Button
                            variant="outline"
                            onClick={() => handleSelect(option)}
                            disabled={isSubmitting}
                            className="w-full h-14 text-left justify-start text-base rounded-xl border-2 border-gray-200 hover:border-[#FFB400] hover:bg-white"
                        >
                            {option}
                        </Button>
                    </motion.div>
                ))}
            </div>
             <div className="text-center">
                <Button variant="link" onClick={onBack} className="text-gray-500 text-sm" disabled={isSubmitting}>
                    Back
                </Button>
            </div>
        </motion.div>
    );
}