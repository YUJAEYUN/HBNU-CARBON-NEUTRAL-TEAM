'use client';

import { motion } from 'framer-motion';

interface MealCardProps {
  title: string;
  time: string;
  menu: string;
  delay?: number;
}

const MealCard = ({ title, time, menu, delay = 0 }: MealCardProps) => {
  return (
    <motion.div
      className="ios-card overflow-hidden mb-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      <div className="bg-primary text-white p-3">
        <h2 className="text-lg font-bold">{title} ({time})</h2>
      </div>
      <div className="p-4">
        {menu ? (
          <div className="space-y-2">
            {menu.split("\n").map((item, index) => (
              <div key={index} className="flex items-start py-2 border-b border-gray-100 last:border-0">
                <span className="text-primary mr-2">•</span>
                <span className="text-gray-800">{item}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-4 text-center text-gray-500">
            메뉴 정보가 없습니다.
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MealCard;
