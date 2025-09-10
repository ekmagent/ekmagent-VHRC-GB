import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const startOptions = [
  'Yes',
  'Not sure yet'
];

export default function StartDateStep({ firstName, onSubmit, onBack, isSubmitting }) {
    const handleSelect = (option) => {
        onSubmit(option);
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
        >
            <div className="text-center">
                <h2 className="text-2xl font-bold text-[#1e3a8a] mb-3">If you qualify, would you like your benefit to start as soon as the 1st of next month, {firstName}?</h2>
                <p className="text-gray-600 text-lg">This helps us expedite your application process.</p>
            </div>
            <div className="flex flex-col space-y-3">
                {startOptions.map((option, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                         <Button
                            variant="outline"
                            onClick={() => handleSelect(option)}
                            disabled={isSubmitting}
                            className="w-full h-14 text-left justify-start text-base rounded-xl border-2 border-gray-200 hover:border-[#dc2626] hover:bg-white disabled:opacity-50"
                        >
                            {isSubmitting ? 'Processing...' : option}
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
