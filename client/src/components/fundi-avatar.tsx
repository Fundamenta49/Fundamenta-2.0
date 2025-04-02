import React from 'react';
import { cn } from '@/lib/utils';

interface FundiAvatarProps {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  speaking?: boolean;
  category?: string;
  className?: string;
}

export default function FundiAvatar({
  size = 'md',
  speaking = false,
  category = 'general',
  className
}: FundiAvatarProps) {
  // Category colors
  const categoryColors: Record<string, string> = {
    finance: '#22c55e', // green-500
    career: '#3b82f6', // blue-500
    wellness: '#a855f7', // purple-500
    learning: '#f97316', // orange-500
    emergency: '#ef4444', // red-500
    cooking: '#f59e0b', // amber-500
    fitness: '#06b6d4', // cyan-500
    general: '#6366f1', // indigo-500
    tour: '#6366f1', // indigo-500
  };

  // Size mapping
  const sizes = {
    xs: 'w-8 h-8',
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
  };

  const color = categoryColors[category] || categoryColors.general;

  // Using SVG for consistent rendering across browsers
  return (
    <div className={cn(
      "flex items-center justify-center",
      sizes[size],
      className
    )}>
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        {/* Outer Container - now rectangular with rounded corners instead of circular */}
        <rect x="5" y="5" width="90" height="90" rx="15" fill="white" opacity="0.15" />
        
        {/* Main Background */}
        <rect x="10" y="10" width="80" height="80" rx="12" fill={color} />
        
        {/* Simple, friendly avatar - clean chat interface */}
        <g>
          {/* Speech bubble */}
          <path 
            d="M 30 40 
               Q 30 30 40 30 
               H 60 
               Q 70 30 70 40 
               V 55 
               Q 70 65 60 65 
               H 45 
               L 35 75 
               V 65 
               H 40 
               Q 30 65 30 55 
               Z" 
            fill="white" 
            opacity="0.9" 
          />
          
          {/* Chat dots or speaking animation */}
          {speaking ? (
            <>
              <circle cx="40" cy="47.5" r="3" fill={color} className="animate-pulse" />
              <circle cx="50" cy="47.5" r="3" fill={color} className="animate-pulse" style={{ animationDelay: '0.5s' }} />
              <circle cx="60" cy="47.5" r="3" fill={color} className="animate-pulse" style={{ animationDelay: '1s' }} />
            </>
          ) : (
            <>
              <circle cx="40" cy="47.5" r="3" fill={color} />
              <circle cx="50" cy="47.5" r="3" fill={color} />
              <circle cx="60" cy="47.5" r="3" fill={color} />
            </>
          )}
        </g>
      </svg>
    </div>
  );
}