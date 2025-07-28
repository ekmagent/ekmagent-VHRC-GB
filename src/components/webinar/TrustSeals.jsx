import React from 'react';
import { Star, ShieldCheck } from 'lucide-react';

export default function TrustSeals() {
  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2">
        <div className="flex-shrink-0">
          <Star className="w-5 h-5 text-yellow-400 fill-current" />
        </div>
        <div>
          <p className="font-bold text-sm text-[#0D2C4C]">5-Star Rating</p>
          <p className="text-xs text-gray-500">on Google</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
         <div className="flex-shrink-0">
          <ShieldCheck className="w-5 h-5 text-[#FFB400]" />
        </div>
        <div>
          <p className="font-bold text-sm text-[#0D2C4C]">Secure & Private</p>
          <p className="text-xs text-gray-500">Registration</p>
        </div>
      </div>
    </div>
  );
}