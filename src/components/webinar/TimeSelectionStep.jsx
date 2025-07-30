import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Calendar } from 'lucide-react';
import { nextTuesday, nextThursday, format, addDays } from 'date-fns';

const getNextEventDates = () => {
  const now = new Date();
  let tue11 = nextTuesday(now);
  tue11.setHours(11, 0, 0, 0);

  let tue1830 = nextTuesday(now);
  tue1830.setHours(18, 30, 0, 0);

  let thu11 = nextThursday(now);
  thu11.setHours(11, 0, 0, 0);

  if (now > tue11) tue11 = addDays(tue11, 7);
  if (now > tue1830) tue1830 = addDays(tue1830, 7);
  if (now > thu11) thu11 = addDays(thu11, 7);

  const options = [
    {
      id: tue11.toISOString(),
      time: '11:00 AM EST',
      day: 'Tuesday',
      date: format(tue11, 'MMMM do'),
      dateTime: tue11 // Add this for sorting
    },
    {
      id: tue1830.toISOString(),
      time: '6:30 PM EST',
      day: 'Tuesday',
      date: format(tue1830, 'MMMM do'),
      dateTime: tue1830 // Add this for sorting
    },
    {
      id: thu11.toISOString(),
      time: '11:00 AM EST',
      day: 'Thursday',
      date: format(thu11, 'MMMM do'),
      dateTime: thu11 // Add this for sorting
    }
  ];

  // Sort by actual date/time chronologically
  return options.sort((a, b) => a.dateTime - b.dateTime);
};

export default function TimeSelectionStep({ selectedTime, onTimeSelect }) {
  const timeOptions = getNextEventDates();
  const [seatCounts, setSeatCounts] = useState({});

  useEffect(() => {
    const counts = {};
    timeOptions.forEach((option) => {
      // Generate a random number between 8 and 23
      counts[option.id] = Math.floor(Math.random() * (21 - 6 + 1)) + 6;
    });
    setSeatCounts(counts);
  }, []); // Empty dependency array ensures this runs only once on mount


  const handleSelection = (timeId) => {
    setTimeout(() => {
      onTimeSelect(timeId);
    }, 400);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4">

      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-[#0D2C4C] mb-2">Reserve Your Webinar Seat & Time

        </h2>
        <p className="text-gray-600 text-sm">5-Star ⭐⭐⭐⭐⭐ Rated

        </p>
      </div>

      <div className="space-y-3">
        {timeOptions.map((option, index) =>
        <motion.div
          key={option.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`relative p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-[1.02] ${
          selectedTime === option.id ?
          'border-[#FFB400] bg-gradient-to-r from-[#FFB400]/10 to-[#FF8C00]/5 shadow-lg' :
          'border-gray-200 bg-white hover:border-[#FFB400]/50 hover:shadow-md'}`
          }
          onClick={() => handleSelection(option.id)}>

            {selectedTime === option.id &&
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-3 right-3 w-6 h-6 bg-[#FFB400] rounded-full flex items-center justify-center">

                <Check className="w-4 h-4 text-[#0D2C4C]" />
              </motion.div>
          }
            
            <div className="flex items-center space-x-4">
              <div className="text-center w-16 flex-shrink-0">
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
                    {seatCounts[option.id] &&
                <div className="text-orange-600 text-xs font-bold">
                            Only {seatCounts[option.id]} seats left!
                        </div>
                }
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>);

}