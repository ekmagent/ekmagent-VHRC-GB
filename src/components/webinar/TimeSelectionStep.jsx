import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { format, addDays } from 'date-fns';

const getNextEventDates = () => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // Find next Tuesday and Thursday
  const daysUntilTuesday = (2 - today.getDay() + 7) % 7 || 7;
  const daysUntilThursday = (4 - today.getDay() + 7) % 7 || 7;

  const nextTue = addDays(today, daysUntilTuesday);
  const nextThu = addDays(today, daysUntilThursday);

  // Create options with hardcoded UTC times
  const options = [
    {
      id: `${nextTue.toISOString().split('T')[0]}T16:00:00.000Z`, // 11 AM EST = 4 PM UTC
      time: '11:00 AM EST',
      day: 'Tuesday',
      date: format(nextTue, 'MMMM do'),
      dateTime: new Date(`${nextTue.toISOString().split('T')[0]}T16:00:00.000Z`)
    },
    {
      id: `${nextTue.toISOString().split('T')[0]}T23:30:00.000Z`, // 6:30 PM EST = 11:30 PM UTC
      time: '6:30 PM EST',
      day: 'Tuesday', 
      date: format(nextTue, 'MMMM do'),
      dateTime: new Date(`${nextTue.toISOString().split('T')[0]}T23:30:00.000Z`)
    },
    {
      id: `${nextThu.toISOString().split('T')[0]}T16:00:00.000Z`, // 11 AM EST = 4 PM UTC
      time: '11:00 AM EST',
      day: 'Thursday',
      date: format(nextThu, 'MMMM do'), 
      dateTime: new Date(`${nextThu.toISOString().split('T')[0]}T16:00:00.000Z`)
    }
  ];

  // Filter out past times and sort
  return options
    .filter(option => option.dateTime > now)
    .sort((a, b) => a.dateTime - b.dateTime)
    .slice(0, 3); // Keep next 3 upcoming sessions
};

export default function TimeSelectionStep({ selectedTime, onTimeSelect }) {
  const timeOptions = getNextEventDates();
  const [seatCounts, setSeatCounts] = useState({});

  useEffect(() => {
    const counts = {};
    timeOptions.forEach((option) => {
      counts[option.id] = Math.floor(Math.random() * 15) + 6; // 6-20 seats
    });
    setSeatCounts(counts);
  }, []);

  const handleSelection = (timeId) => {
    setTimeout(() => {
      onTimeSelect(timeId);
    }, 300);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4">

      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-[#0D2C4C] mb-2">
          Reserve Your Webinar Seat & Time
        </h2>
        <p className="text-gray-600 text-sm">5-Star ⭐⭐⭐⭐⭐ Rated</p>
      </div>

      <div className="space-y-3">
        {timeOptions.map((option) => (
          <motion.div
            key={option.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`relative p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
              selectedTime === option.id
                ? 'border-[#FFB400] bg-[#FFB400]/10 shadow-lg'
                : 'border-gray-200 bg-white hover:border-[#FFB400]/50'
            }`}
            onClick={() => handleSelection(option.id)}>

            {selectedTime === option.id && (
              <div className="absolute top-3 right-3 w-6 h-6 bg-[#FFB400] rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
            )}
            
            <div className="flex items-center space-x-4">
              <div className="text-center w-16">
                <p className="font-bold text-lg text-[#0D2C4C]">{option.day}</p>
                <p className="text-sm text-gray-500">{option.date}</p>
              </div>
              <div className="border-l border-gray-200 pl-4 flex-1">
                <h3 className="font-bold text-[#0D2C4C] text-lg mb-1">
                  {option.time}
                </h3>
                <div className="flex items-center space-x-2">
                  <div className="bg-green-100 text-green-800 px-3 py-1 text-xs font-semibold rounded-full">
                    Free
                  </div>
                  <div className="text-orange-600 text-xs font-bold">
                    Only {seatCounts[option.id]} seats left!
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}