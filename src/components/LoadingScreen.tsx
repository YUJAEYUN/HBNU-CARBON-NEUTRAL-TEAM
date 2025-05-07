"use client";
import Image from "next/image";

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50">
      <div className="w-24 h-24 mb-4 relative">
        <Image 
          src="/village.png" 
          alt="로딩 중" 
          width={96} 
          height={96} 
          className="animate-pulse"
        />
      </div>
      <div className="flex items-center justify-center">
        <div className="h-2 w-2 bg-primary rounded-full mr-1 animate-bounce" style={{ animationDelay: "0s" }}></div>
        <div className="h-2 w-2 bg-primary rounded-full mr-1 animate-bounce" style={{ animationDelay: "0.2s" }}></div>
        <div className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
      </div>
      <p className="mt-4 text-gray-600 text-sm">로딩 중...</p>
    </div>
  );
}
