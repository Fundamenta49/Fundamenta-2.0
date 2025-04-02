import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion, PanInfo, useMotionValue, useTransform } from "framer-motion";

const FullScreenDialog = DialogPrimitive.Root;

const FullScreenDialogTrigger = DialogPrimitive.Trigger;

const FullScreenDialogPortal = DialogPrimitive.Portal;

const FullScreenDialogClose = DialogPrimitive.Close;

const FullScreenDialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => {
  const isMobile = useIsMobile();
  
  return (
    <DialogPrimitive.Overlay
      ref={ref}
      className={cn(
        "fixed inset-0 z-40 bg-black/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        className
      )}
      style={{
        // Style that creates a clickable hole for the navigation button
        ...(isMobile ? {
          maskImage: 'radial-gradient(circle at 20px 40px, transparent 24px, black 25px)',
          WebkitMaskImage: 'radial-gradient(circle at 20px 40px, transparent 24px, black 25px)'
        } : {})
      }}
      {...props}
    />
  );
});
FullScreenDialogOverlay.displayName = "FullScreenDialogOverlay";

interface FullScreenDialogContentProps extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  themeColor?: string;
}

const FullScreenDialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  FullScreenDialogContentProps
>(({ className, themeColor = "#3b82f6", children, ...props }, ref) => {
  const isMobile = useIsMobile();
  const closeRef = React.useRef<HTMLButtonElement>(null);
  
  // For swipe gesture
  const y = useMotionValue(0);
  const opacity = useTransform(y, [0, 300], [1, 0.5]);
  const scale = useTransform(y, [0, 300], [1, 0.8]);
  
  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    // If user swiped down enough, trigger the close button
    if (info.offset.y > 100 && isMobile && closeRef.current) {
      closeRef.current.click();
    } else {
      // Otherwise, animate back to original position
      y.set(0);
    }
  };
  
  return (
    <FullScreenDialogPortal>
      <FullScreenDialogOverlay />
      {isMobile ? (
        <motion.div
          style={{ 
            y,
            opacity,
            scale,
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 45,
            width: '100%',
            height: '100%',
            overflow: 'auto',
            backgroundColor: 'white',
            // Ensure full-screen dialog doesn't block the sidebar menu button
            boxSizing: 'border-box',
            // Add the same mask as the overlay for the hamburger menu button
            maskImage: 'radial-gradient(circle at 20px 40px, transparent 24px, black 25px)',
            WebkitMaskImage: 'radial-gradient(circle at 20px 40px, transparent 24px, black 25px)'
          }}
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
        >
          <DialogPrimitive.Content
            ref={ref}
            className={cn(
              "w-full h-full bg-white dark:bg-gray-950 shadow-xl duration-200 overflow-auto",
              className
            )}
            {...props}
          >
            {/* Swipe handle indicator */}
            <div className="w-full flex flex-col items-center sticky top-0 z-20 pt-1 pb-2 bg-white dark:bg-gray-950">
              <div className="w-12 h-1 rounded-full bg-gray-300 dark:bg-gray-700" />
              <p className="text-xs text-gray-400 mt-1">Swipe down to close</p>
            </div>
            
            {children}
            
            {/* Hidden close button for programmatic clicking */}
            <DialogPrimitive.Close 
              ref={closeRef}
              className="sr-only"
            >
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
          </DialogPrimitive.Content>
        </motion.div>
      ) : (
        <DialogPrimitive.Content
          ref={ref}
          className={cn(
            "fixed inset-4 z-50 w-auto h-auto overflow-auto bg-white dark:bg-gray-950 shadow-xl duration-200 rounded-xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            className
          )}
          {...props}
        >
          {children}
          
          {/* Close button for desktop */}
          <DialogPrimitive.Close 
            className="absolute right-4 top-4 rounded-full p-2 opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
            style={{ backgroundColor: `${themeColor}20` }}
          >
            <X className="h-6 w-6" style={{ color: themeColor }} />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      )}
    </FullScreenDialogPortal>
  );
});
FullScreenDialogContent.displayName = "FullScreenDialogContent";

const FullScreenDialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  const isMobile = useIsMobile();
  
  return (
    <div
      className={cn(
        "sticky z-10 bg-white dark:bg-gray-950 px-6 pb-4 flex flex-col gap-1.5 border-b",
        isMobile ? "top-5" : "top-0 pt-6", // Adjust top position for mobile to account for swipe indicator
        className
      )}
      {...props}
    />
  );
};
FullScreenDialogHeader.displayName = "FullScreenDialogHeader";

const FullScreenDialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "sticky bottom-0 z-10 bg-white dark:bg-gray-950 px-6 py-4 flex justify-between items-center border-t",
      className
    )}
    {...props}
  />
);
FullScreenDialogFooter.displayName = "FullScreenDialogFooter";

const FullScreenDialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-2xl font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));
FullScreenDialogTitle.displayName = "FullScreenDialogTitle";

const FullScreenDialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
FullScreenDialogDescription.displayName = "FullScreenDialogDescription";

const FullScreenDialogBody = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  const isMobile = useIsMobile();
  
  return (
    <div
      className={cn(
        "px-6 py-4", 
        isMobile ? "pb-24" : "", // Add bottom padding on mobile for better scrolling experience
        className
      )}
      {...props}
    />
  );
};
FullScreenDialogBody.displayName = "FullScreenDialogBody";

export {
  FullScreenDialog,
  FullScreenDialogPortal,
  FullScreenDialogOverlay,
  FullScreenDialogClose,
  FullScreenDialogTrigger,
  FullScreenDialogContent,
  FullScreenDialogHeader,
  FullScreenDialogFooter,
  FullScreenDialogTitle,
  FullScreenDialogDescription,
  FullScreenDialogBody,
};