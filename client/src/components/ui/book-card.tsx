import React, { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

export interface BookCardProps {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  isExpanded: boolean;
  onToggle: (id: string) => void;
  children: ReactNode;
  color?: string; // Color class for the card elements, e.g. "text-red-500"
}

export function BookCard({
  id,
  title,
  description,
  icon: Icon,
  isExpanded,
  onToggle,
  children,
  color = "text-primary" // Default color if none provided
}: BookCardProps) {
  const isMobile = useIsMobile();
  
  return (
    <Card 
      className={cn(
        "border-2 shadow-md bg-white flex flex-col",
        color.replace("text-", "border-").replace("-500", "-100"),
        isMobile ? "h-full" : isExpanded ? "h-[calc(80vh-6rem)]" : "h-[400px]"
      )}
      onClick={() => !isExpanded && onToggle(id)}
    >
      {!isExpanded ? (
        // Book cover design - only shows when collapsed
        <div className="h-full flex flex-col cursor-pointer py-4">
          {/* Top section with icon */}
          <div className="flex-1 flex items-center justify-center flex-col text-center px-6 py-8">
            <div className={cn("w-24 h-24 rounded-full flex items-center justify-center mb-6", 
                               color.replace("text-", "bg-").replace("-500", "-50"))}>
              <Icon className={cn("h-12 w-12", color)} />
            </div>
            <CardTitle className="text-3xl mb-3">{title}</CardTitle>
            <CardDescription className="text-xl">{description}</CardDescription>
          </div>
          
          {/* Bottom hint to open */}
          <div className="text-center pb-6 text-muted-foreground">
            <p className="text-sm">Tap to open</p>
            <ChevronDown className="h-5 w-5 mx-auto mt-1" />
          </div>
        </div>
      ) : (
        // Content view - shows when expanded
        <>
          <CardHeader 
            className={cn(
              "border-b py-3 cursor-pointer flex flex-row items-center",
              color.replace("text-", "bg-").replace("-500", "-50"),
              color.replace("text-", "border-").replace("-500", "-100")
            )}
            onClick={(e) => {
              e.stopPropagation();
              onToggle(id);
            }}
          >
            <div className="flex items-center gap-3">
              <Icon className={cn("h-6 w-6", color)} />
              <CardTitle className="text-xl">{title}</CardTitle>
            </div>
            <ChevronUp className="h-5 w-5 text-muted-foreground ml-auto" />
          </CardHeader>
          
          <CardContent className="flex-1 overflow-y-auto p-4">
            {children}
          </CardContent>
        </>
      )}
    </Card>
  );
}

export interface BookCarouselProps {
  children: ReactNode;
}

export function BookCarousel({ children }: BookCarouselProps) {
  // Using useIsMobile hook to handle responsive layout
  const isMobile = useIsMobile();
  
  return isMobile ? (
    // Mobile layout: horizontal carousel
    <div 
      className="flex w-full overflow-x-auto snap-x snap-mandatory hide-scrollbar"
      style={{ 
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        height: 'calc(100vh - 4rem)' /* Maximize screen height */
      }}
    >
      {children}
    </div>
  ) : (
    // Desktop layout: grid
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12 pt-2 max-w-[1400px] mx-auto">
      {children}
    </div>
  );
}

export interface BookPageProps {
  id: string;
  children: ReactNode;
}

export function BookPage({ id, children }: BookPageProps) {
  const isMobile = useIsMobile();
  
  return isMobile ? (
    // Mobile layout: full-width snap page
    <div 
      key={id}
      className="snap-center flex-shrink-0 w-full px-2"
    >
      {children}
    </div>
  ) : (
    // Desktop layout: no special container needed, just render the children
    <>{children}</>
  );
}