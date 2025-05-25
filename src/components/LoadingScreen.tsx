"use client";
import Image from "next/image";
import { motion } from "framer-motion";

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-primary-light via-white to-primary-light z-50">
      <motion.div
        className="w-32 h-32 mb-6 relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute inset-0 bg-primary-light rounded-full opacity-50 blur-xl"></div>
        <Image
          src="/mainCharacter.png"
          alt="로딩 중"
          width={128}
          height={128}
          className="relative z-10"
        />
      </motion.div>

      <motion.div
        className="flex items-center justify-center mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <motion.div
          className="h-3 w-3 bg-primary rounded-full mr-2"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: 0
          }}
        />
        <motion.div
          className="h-3 w-3 bg-primary rounded-full mr-2"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: 0.3
          }}
        />
        <motion.div
          className="h-3 w-3 bg-primary rounded-full"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: 0.6
          }}
        />
      </motion.div>

      <motion.p
        className="text-primary-dark text-base font-medium"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        탄소중립 데이터 불러오는 중...
      </motion.p>
    </div>
  );
}
