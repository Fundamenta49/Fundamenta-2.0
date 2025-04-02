import Navigation from "@/components/navigation";
import FloatingChat from "@/components/floating-chat";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { User, Settings, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { MoodSelector } from "@/components/mood-selector";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const isMobile = useIsMobile();
  const isHomePage = location === "/" || location === "/home";
  
  // Determine current category based on the URL path
  const getCurrentCategory = () => {
    if (location.includes('/finance')) return 'finance';
    if (location.includes('/career')) return 'career';
    if (location.includes('/wellness')) return 'wellness';
    if (location.includes('/learning')) return 'learning';
    if (location.includes('/emergency')) return 'emergency';
    if (location.includes('/cooking')) return 'cooking';
    if (location.includes('/fitness')) return 'fitness';
    return 'general';
  };
  
  const currentCategory = getCurrentCategory();

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-col md:flex-row flex-1">
        <div className="flex flex-col w-full md:w-64 bg-white border-r">
          <Navigation />
        </div>
        
        <main className={cn(
          "transition-all duration-300 bg-background min-h-screen",
          isMobile ? "ml-0 p-4 pt-16" : "ml-64 p-6", 
          document.body.classList.contains("sidebar-minimized") && !isMobile ? "ml-16" : ""
        )}>
          {/* All headers are now handled directly in each page component */}
          
          <div className={cn(
            "pb-24", // Add padding at bottom to accommodate floating chat
            isHomePage ? "mt-0" : "mt-4"
          )}>
            {children}
          </div>
        </main>
        
        <div className="flex-1">
          <FloatingChat category={currentCategory} />
        </div>
      </div>
    </div>
  );
}
