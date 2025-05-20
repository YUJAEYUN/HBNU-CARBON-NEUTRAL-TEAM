'use client';

import { motion } from 'framer-motion';

interface DaySelectorProps {
  selectedDay: string;
  setSelectedDay: (day: string) => void;
}

const DaySelector = ({ selectedDay, setSelectedDay }: DaySelectorProps) => {
  const days = [
    { id: 'mon', label: '월' },
    { id: 'tue', label: '화' },
    { id: 'wed', label: '수' },
    { id: 'thu', label: '목' },
    { id: 'fri', label: '금' },
  ];

  return (
    <div className="flex justify-between bg-white p-4 shadow-sm">
      {days.map((day) => (
        <button
          key={day.id}
          className={`relative w-12 h-12 rounded-full flex items-center justify-center ${
            selectedDay === day.id
              ? 'text-white'
              : 'text-gray-500'
          }`}
          onClick={() => setSelectedDay(day.id)}
        >
          {selectedDay === day.id && (
            <motion.div
              className="absolute inset-0 bg-primary rounded-full"
              layoutId="dayIndicator"
              transition={{ type: 'spring', duration: 0.5 }}
            />
          )}
          <span className="relative z-10 font-medium">{day.label}</span>
        </button>
      ))}
    </div>
  );
};

export default DaySelector;
