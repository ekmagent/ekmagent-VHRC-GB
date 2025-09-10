import React from 'react';
import { motion } from 'framer-motion';
import { Shield, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotQualifiedPage({ reason, onRestart }) {
    const getReasonMessage = (reason) => {
        switch (reason) {
            case 'military_health_coverage':
                return 'Based on your TRICARE or ChampVA coverage, this program may not be the right fit for you at this time.';
            case 'va_medications':
                return 'Since you don\'t get all your medications at the VA clinic, this program may not provide the maximum benefit for your situation.';
            case 'part_b_premium':
                return 'Medicare Part B enrollment is required to qualify for the Veteran Giveback Benefit.';
            default:
                return 'Based on your answers, this program may not be the right fit for you at this time.';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50 flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-2xl">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 text-center"
                >
                    <AlertCircle className="w-16 h-16 text-[#dc2626] mx-auto mb-6" />
                    
                    <h1 className="text-3xl font-bold text-[#1e3a8a] mb-4">
                        We're Sorry
                    </h1>
                    
                    <p className="text-xl text-gray-700 mb-6">
                        {getReasonMessage(reason)}
                    </p>
                    
                    <div className="bg-blue-50 rounded-lg p-6 mb-8">
                        <Shield className="w-8 h-8 text-[#1e3a8a] mx-auto mb-3" />
                        <h3 className="text-lg font-semibold text-[#1e3a8a] mb-3">Still Want to Learn More?</h3>
                        <p className="text-gray-700 mb-4">
                            Our veteran benefits specialists are always here to help you explore all available options for maximizing your veteran benefits.
                        </p>
                        <p className="text-sm text-gray-600">
                            Call us at <span className="font-bold text-[#1e3a8a]">(555) 123-VETS</span> to speak with a specialist.
                        </p>
                    </div>
                    
                    <div className="space-y-3">
                        <Button 
                            onClick={onRestart}
                            className="w-full bg-[#1e3a8a] hover:bg-[#1e40af] text-white py-3 text-lg"
                        >
                            Start Over
                        </Button>
                        <p className="text-xs text-gray-400">
                            🔒 Your information is secure and will never be shared
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
