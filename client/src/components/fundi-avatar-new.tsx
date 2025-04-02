import { cn } from "@/lib/utils";

interface FundiAvatarProps {
  speaking?: boolean;
  size?: "xs" | "sm" | "md" | "lg";
  category?: string;
  className?: string;
}

export default function FundiAvatar({ speaking = false, size = "md", category = 'general', className }: FundiAvatarProps) {
  const sizeClasses = {
    xs: "w-8 h-8",
    sm: "w-12 h-12",
    md: "w-16 h-16",
    lg: "w-24 h-24",
  };

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

  const color = categoryColors[category] || categoryColors.general;

  return (
    <div className={cn(
      "relative flex items-center justify-center",
      sizeClasses[size],
      className
    )}>
      <div className={cn(
        "absolute inset-0 rounded-lg flex items-center justify-center",
        speaking ? "animate-pulse" : ""
      )}
      style={{ backgroundColor: color }}
      >
        <svg
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full p-1"
        >
          {/* Main robot body - slightly rounded rectangle */}
          <rect x="25" y="28" width="50" height="45" rx="8" fill="#f5f5f5" />
          
          {/* Friendly face with slightly curved bottom */}
          <path 
            d="M25,50 
               Q25,73 50,73 
               Q75,73 75,50 
               V36 
               Q75,28 67,28 
               H33 
               Q25,28 25,36 
               Z" 
            fill="#f8fafc" 
          />
          
          {/* Antenna/sensors - more subtle */}
          <rect x="46" y="20" width="8" height="8" rx="4" fill="#e0e0e0" />
          <line x1="50" y1="28" x2="50" y2="32" stroke="#e0e0e0" strokeWidth="2" />
          
          {/* Display panel - more rectangular, professional looking */}
          <rect x="30" y="35" width="40" height="10" rx="2" fill="#f1f5f9" stroke="#e2e8f0" strokeWidth="1" />
          
          {/* Professional looking eyes - slightly smiling */}
          <g>
            {/* Left eye */}
            <ellipse cx="40" cy="45" rx="4" ry="3" fill="#1e293b" />
            <circle cx="38.5" cy="44" r="1" fill="white" />
            
            {/* Right eye */}
            <ellipse cx="60" cy="45" rx="4" ry="3" fill="#1e293b" />
            <circle cx="58.5" cy="44" r="1" fill="white" />
            
            {/* Subtle smile */}
            <path
              d="M42,58 Q50,62 58,58"
              fill="none"
              stroke="#64748b"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </g>
          
          {/* Status indicators */}
          <circle cx="35" cy="65" r="2" fill={color} opacity={speaking ? "0.9" : "0.7"} className={speaking ? "animate-pulse" : ""} />
          <circle cx="42" cy="65" r="2" fill={color} opacity={speaking ? "0.9" : "0.7"} className={speaking ? "animate-pulse" : ""} style={{ animationDelay: "0.2s" }} />
          <circle cx="49" cy="65" r="2" fill={color} opacity={speaking ? "0.9" : "0.7"} className={speaking ? "animate-pulse" : ""} style={{ animationDelay: "0.4s" }} />
          
          {/* Side panels - more integrated into design */}
          <rect x="18" y="40" width="7" height="15" rx="2" fill="#e2e8f0" />
          <rect x="75" y="40" width="7" height="15" rx="2" fill="#e2e8f0" />
        </svg>
      </div>
    </div>
  );
}