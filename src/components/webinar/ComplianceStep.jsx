import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Shield } from 'lucide-react';

export default function ComplianceStep({ firstName, onNext, onBack }) {
    const handleSelect = () => {
        onNext('understood');
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
        >
            <div className="text-center">
                <div className="bg-blue-50 rounded-lg p-6 mb-6">
                    <Shield className="w-12 h-12 text-[#1e3a8a] mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-[#1e3a8a] mb-3">Did you know?</h2>
                    <p className="text-lg text-gray-700 mb-4">
                        The Veteran Giveback Benefit <span className="font-bold text-[#1e3a8a]">does not affect or change</span> your current health benefits from the VA—it only <span className="font-bold text-[#dc2626]">enhances your protection</span>.
                    </p>
                </div>
            </div>
            <div className="flex flex-col space-y-3">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                >
                     <Button
                        variant="outline"
                        onClick={handleSelect}
                        className="w-full min-h-[56px] h-auto text-left justify-start text-sm rounded-xl border-2 border-gray-200 hover:border-[#dc2626] hover:bg-white p-4 whitespace-normal break-words leading-tight"
                    >
                        <span className="block w-full text-left leading-snug">
                            Yes, I understand this enhances my VA benefits
                        </span>
                    </Button>
                </motion.div>
            </div>
             <div className="text-center">
                <Button variant="link" onClick={onBack} className="text-gray-500 text-sm">
                    Back
                </Button>
            </div>
        </motion.div>
    );
}
