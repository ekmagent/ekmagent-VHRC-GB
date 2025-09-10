import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Phone, Star, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function QualifiedPage({ formData }) {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleCallNow = () => {
    window.location.href = 'tel:+1-856-888-4641';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl shadow-2xl p-8 border border-blue-200 text-center">

          {/* Top Call Button */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6">
            <Button
              onClick={handleCallNow}
              className="h-14 w-full text-lg font-bold rounded-xl bg-[#22c55e] hover:bg-[#16a34a] text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-3">
              <Phone className="w-5 h-5" />
              📞 Click to Call: 1-800-VET-VHRC
            </Button>
          </motion.div>

          {/* Success Icon */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
          </motion.div>

          {/* Congratulations Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}>
            <h1 className="text-3xl font-bold text-[#1e3a8a] mb-4">
              🎉 Congratulations, {formData.firstName}!
            </h1>
            <h2 className="text-xl text-gray-700 mb-6">
              You Qualify for the Veteran Giveback Benefit!
            </h2>
          </motion.div>

          {/* Benefits Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl p-6 mb-6 shadow-md">
            <h3 className="text-lg font-semibold text-[#1e3a8a] mb-4">Here's What You've Qualified For:</h3>
            <ul className="space-y-3 text-left">
              <li className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                <span><strong>Up to $1,800 back each year</strong> through your Part B credit</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                <span><strong>Extra benefits</strong> including dental, vision, and hearing coverage</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                <span><strong>Your VA benefits remain unchanged</strong> - this only enhances them</span>
              </li>
            </ul>
          </motion.div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col items-center space-y-4">
            <p className="text-gray-700 mb-4">
              A veteran benefits specialist is standing by to help you claim your benefits right now.
            </p>
            
            <Button
              onClick={handleCallNow}
              className="h-16 w-full max-w-md mx-auto text-xl font-bold rounded-xl bg-[#ff9900] hover:bg-[#e88b00] text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-3">
              <Phone className="w-6 h-6" />
              📞 Click to Call: 1-800-VET-VHRC
            </Button>
            
            <p className="text-sm text-gray-500 text-center">
              ⏰ Lines are open now - typically a 2-3 minute wait
            </p>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8 pt-6 border-t border-gray-300">
            <div className="flex justify-center items-center space-x-8 text-sm text-gray-600">
              <div className="flex items-center">
                <Award className="w-5 h-5 text-[#dc2626] mr-2" />
                <span>Veteran Specialists</span>
              </div>
              <div className="flex items-center">
                <Star className="w-5 h-5 text-yellow-400 fill-current mr-2" />
                <span>5-Star Rated</span>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-3">
              🇺🇸 Thank you for your service to our country
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
