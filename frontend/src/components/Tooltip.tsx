"use client";
import { ReactNode, useState } from "react";

interface TooltipProps {
  children: ReactNode;
  content: string;
  position?: "top" | "bottom" | "left" | "right";
  width?: string; // 툴팁 너비 커스터마이징 옵션 추가
}

export default function Tooltip({
  children,
  content,
  position = "top",
  width = "max-w-xs", // 기본값 설정
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: "bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 mb-2",
    bottom: "top-full left-1/2 transform -translate-x-1/2 translate-y-2 mt-2",
    left: "right-full top-1/2 transform -translate-y-1/2 -translate-x-2 mr-2",
    right: "left-full top-1/2 transform -translate-y-1/2 translate-x-2 ml-2",
  };

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="inline-block"
      >
        {children}
      </div>
      {isVisible && (
        <div
          className={`absolute z-10 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-md shadow-sm opacity-90 ${positionClasses[position]} ${width} whitespace-normal`}
          style={{ aspectRatio: "1.5/1", minWidth: "120px" }}
        >
          {content}
          <div
            className={`absolute w-2 h-2 bg-gray-900 transform rotate-45 ${
              position === "top"
                ? "top-full left-1/2 -translate-x-1/2 -translate-y-1/2"
                : position === "bottom"
                ? "bottom-full left-1/2 -translate-x-1/2 translate-y-1/2"
                : position === "left"
                ? "left-full top-1/2 -translate-y-1/2 -translate-x-1/2"
                : "right-full top-1/2 -translate-y-1/2 translate-x-1/2"
            }`}
          ></div>
        </div>
      )}
    </div>
  );
}
