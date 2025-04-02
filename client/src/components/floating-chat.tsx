import { useState, useEffect } from 'react';
import { Bot, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import ChatInterface from '@/components/chat-interface';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface FloatingChatProps {
  category?: string;
}

export default function FloatingChat({ category = 'general' }: FloatingChatProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const isMobile = useIsMobile();

  const categoryColors: Record<string, string> = {
    finance: '#22c55e', 
    career: '#3b82f6', 
    wellness: '#a855f7',
    learning: '#f97316',
    emergency: '#ef4444',
    cooking: '#f59e0b',
    fitness: '#06b6d4',
    general: '#6366f1',
  };

  // Add a pulsing animation effect to draw attention
  useEffect(() => {
    const animationInterval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 1000);
    }, 30000); // Reduced frequency to every 30 seconds
    
    return () => clearInterval(animationInterval);
  }, []);

  // Hide button when scrolling down, show when scrolling up
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          setIsVisible(
            currentScrollY <= 0 || // Always show at top of page
            currentScrollY < lastScrollY || // Show when scrolling up
            currentScrollY + window.innerHeight >= document.documentElement.scrollHeight // Show at bottom of page
          );
          lastScrollY = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Get the color for the current category
  const getCategoryColor = (category: string) => {
    return categoryColors[category] || categoryColors.general;
  };
  
  return (
    <>
      {isExpanded ? (
        <div className={cn(
          "fixed z-50 w-full max-w-md transition-all duration-300 ease-in-out",
          isMobile 
            ? "inset-0 m-0 h-full" 
            : "bottom-4 right-4 opacity-100 translate-y-0",
          !isVisible && !isMobile && "opacity-0 translate-y-4"
        )}>
          <ChatInterface 
            category={category}
            expanded={isMobile}
            onToggleExpand={() => setIsExpanded(false)}
            initialContext={{
              currentPage: category,
              availableActions: [`/${category}`]
            }}
            className="shadow-xl rounded-2xl overflow-hidden h-full"
          />
        </div>
      ) : (
        <Button
          className={cn(
            "fixed z-50 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ease-in-out",
            isMobile 
              ? "bottom-4 right-4 h-12 w-12" 
              : "bottom-4 right-4 h-10 w-10",
            isAnimating ? 'scale-110' : 'scale-100',
            !isVisible && !isMobile && "translate-y-20",
            isHovered ? "opacity-100" : "opacity-70"
          )}
          style={{
            backgroundColor: 'white',
            borderColor: getCategoryColor(category),
            transform: `scale(${isAnimating ? 1.1 : 1})`,
          }}
          onClick={() => setIsExpanded(true)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          title="Chat with Fundi"
        >
          {/* Chat icon */}
          <div className="flex items-center justify-center w-full h-full relative">
            <MessageSquare 
              className={cn(
                "transition-colors duration-200",
                isMobile ? "h-5 w-5" : "h-4 w-4"
              )}
              style={{ 
                color: getCategoryColor(category),
                opacity: isHovered ? 1 : 0.8
              }}
            />
            {/* Subtle activity indicator */}
            <span className={cn(
              "absolute bottom-0.5 right-0.5 h-1.5 w-1.5 rounded-full",
              "transition-opacity duration-500",
              isHovered ? "opacity-100" : "opacity-60"
            )}
              style={{ 
                backgroundColor: getCategoryColor(category),
                boxShadow: `0 0 6px ${getCategoryColor(category)}`
              }}
            />
          </div>
        </Button>
      )}
    </>
  );
}