import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const insuranceOptions = [
    { title: 'Medicare', subtext: 'Already enrolled in Part A or B' },
    { title: 'Employer / Spouse Plan', subtext: 'Insurance through a job (non-federal/state)' },
    { title: 'Marketplace (ACA)', subtext: 'Plan from HealthCare.gov' },
    { title: 'Medicaid', subtext: 'State health program' },
    { title: 'Federal / State Employee', subtext: 'Government employee benefits' },
    { title: 'Other / Uninsured', subtext: '' },
];

export default function InsuranceStep({ firstName, onNext, onBack, isSubmitting }) {
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
                <h2 className="text-2xl font-bold text-[#0D2C4C] mb-3">What's your current insurance, {firstName}?</h2>
                <p className="text-gray-600 text-lg">Just one last question!</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {insuranceOptions.map((option, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <Button
                            variant="outline"
                            onClick={() => handleSelect(option.title)}
                            disabled={isSubmitting}
                            className="w-full h-auto text-left justify-start py-3 rounded-xl border-2 border-gray-200 hover:border-[#FFB400] hover:bg-white flex flex-col items-start"
                        >
                            <span className="font-bold">{option.title}</span>
                            {option.subtext && <span className="text-xs text-gray-500 font-normal">{option.subtext}</span>}
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