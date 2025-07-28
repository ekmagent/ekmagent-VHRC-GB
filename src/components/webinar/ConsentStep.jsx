import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Shield, Award, Heart } from 'lucide-react';

export default function ConsentStep({ firstName, onSubmit, onBack, isSubmitting }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-[#0D2C4C] mb-3">
          Perfect, {firstName}! You're almost registered.
        </h2>
        <p className="text-gray-600 text-lg">
          Just confirm your registration to secure your seat.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-3 gap-2 mb-6 p-3 bg-gray-50 rounded-xl"
      >
        <div className="text-center">
          <Shield className="w-6 h-6 text-[#FFB400] mx-auto mb-1" />
          <p className="text-xs text-gray-600 font-medium">Secure</p>
        </div>
        <div className="text-center">
          <Award className="w-6 h-6 text-[#FFB400] mx-auto mb-1" />
          <p className="text-xs text-gray-600 font-medium">Expert Led</p>
        </div>
        <div className="text-center">
          <Heart className="w-6 h-6 text-[#FFB400] mx-auto mb-1" />
          <p className="text-xs text-gray-600 font-medium">No Obligation</p>
        </div>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-600 text-center text-sm leading-relaxed"
        >
          By clicking below, you agree to receive communications from EasyKind Health. We respect your privacy and will only send you valuable Medicare information.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col items-center space-y-3 pt-2"
        >
          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-14 w-full max-w-xs text-lg font-bold rounded-xl bg-[#FFB400] hover:bg-[#FF8C00] text-[#0D2C4C] shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:transform-none"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center space-x-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-[#0D2C4C] border-t-transparent rounded-full"
                />
                <span>Registering...</span>
              </div>
            ) : (
              'Register & Continue'
            )}
          </Button>
          <Button 
            type="button"
            variant="link" 
            onClick={onBack} 
            disabled={isSubmitting}
            className="text-gray-500 text-sm"
          >
            Back
          </Button>
        </motion.div>
      </form>
    </motion.div>
  );
}