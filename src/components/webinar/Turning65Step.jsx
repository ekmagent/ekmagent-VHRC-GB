import React from 'react';
import { motion } from 'framer-motion';
import { addMonths, format } from 'date-fns';
import { Button } from '@/components/ui/button';

const getMonthOptions = () => {
  const now = new Date();
  const formatMonth = (date) => format(date, 'MMMM yyyy');

  return [
    'In the next 3 months',
    `${formatMonth(addMonths(now, 4))} - ${formatMonth(addMonths(now, 6))}`,
    `${formatMonth(addMonths(now, 7))} - ${formatMonth(addMonths(now, 9))}`,
    'More than 9 months from now',
    'I am already 65 or older'
  ];
};

export default function Turning65Step({ firstName, onNext, onBack }) {
    const monthOptions = getMonthOptions();

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
                <h2 className="text-2xl font-bold text-[#0D2C4C] mb-3">When do you turn 65, {firstName}?</h2>
                <p className="text-gray-600 text-lg">This helps us tailor the content for you.</p>
            </div>
            <div className="flex flex-col space-y-3">
                {monthOptions.map((option, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                         <Button
                            variant="outline"
                            onClick={() => handleSelect(option)}
                            className="w-full h-14 text-left justify-start text-base rounded-xl border-2 border-gray-200 hover:border-[#FFB400] hover:bg-white"
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