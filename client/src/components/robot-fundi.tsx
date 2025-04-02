import React from 'react';
import { cn } from '@/lib/utils';

interface RobotFundiProps {
  speaking?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function RobotFundi({ speaking = false, size = "md" }: RobotFundiProps) {
  const sizeVariants = {
    sm: "w-12 h-12",
    md: "w-16 h-16",
    lg: "w-24 h-24"
  };

  return (
    <div className={cn(
      "flex items-center justify-center relative",
      sizeVariants[size]
    )}>
      {/* Simple robot avatar with no animations */}
      <svg
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Head */}
        <rect x="60" y="40" width="80" height="70" rx="20" fill="#e6e6e6" />
        
        {/* Face screen */}
        <rect x="70" y="60" width="60" height="30" rx="10" fill="#222" />
        
        {/* Eyes */}
        <ellipse cx="85" cy="75" rx="10" ry="6" fill="#38bdf8" className={speaking ? "animate-pulse" : ""} />
        <ellipse cx="115" cy="75" rx="10" ry="6" fill="#38bdf8" className={speaking ? "animate-pulse" : ""} />
        
        {/* Antenna */}
        <rect x="90" y="30" width="20" height="10" rx="5" fill="#7dd3fc" />
        <rect x="95" y="15" width="10" height="15" rx="5" fill="#e6e6e6" />
        
        {/* Ears */}
        <rect x="50" y="60" width="10" height="20" rx="5" fill="#d4d4d4" />
        <rect x="140" y="60" width="10" height="20" rx="5" fill="#d4d4d4" />
        
        {/* Body */}
        <path d="M70,110 C70,140 70,160 100,160 C130,160 130,140 130,110 Z" fill="#f5f5f5" />
        
        {/* Chest light */}
        <circle cx="100" cy="130" r="10" fill="#38bdf8" className={speaking ? "animate-pulse" : ""} opacity="0.8" />
        
        {/* Arms */}
        <path d="M70,115 C50,125 50,140 60,150" fill="none" stroke="#e6e6e6" strokeWidth="10" strokeLinecap="round" />
        <path d="M130,115 C150,125 150,140 140,150" fill="none" stroke="#e6e6e6" strokeWidth="10" strokeLinecap="round" />
      </svg>
    </div>
  );
}