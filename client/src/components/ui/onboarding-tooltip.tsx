import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { TourStep } from '@/lib/onboarding-context';

interface TooltipProps {
  step: TourStep;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
  currentIndex: number;
  totalSteps: number;
}

export function OnboardingTooltip({
  step,
  isOpen,
  onClose,
  onNext,
  onPrev,
  onSkip,
  currentIndex,
  totalSteps
}: TooltipProps) {
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);
  
  // Handle click outside to close the tooltip
  useEffect(() => {
    if (!isOpen) return;
    
    const handleClickOutside = (e: MouseEvent) => {
      if (tooltipRef.current && 
          !tooltipRef.current.contains(e.target as Node) && 
          !step.disableOverlayClose) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, step.disableOverlayClose]);
  
  // Compute tooltip position based on target element and placement
  useEffect(() => {
    if (!isOpen) return;
    
    // Check if this is a centered tooltip with no target
    if (step.placement === 'center' && !step.targetSelector) {
      // Set position to center of screen in the next tick
      setTimeout(() => {
        const tooltipRect = tooltipRef.current?.getBoundingClientRect();
        if (tooltipRect) {
          setTooltipPosition({
            top: window.innerHeight / 2 - tooltipRect.height / 2,
            left: window.innerWidth / 2 - tooltipRect.width / 2
          });
        }
      }, 0);
      return;
    }
    
    // If there's no target selector, we can't position relative to an element
    if (!step.targetSelector) {
      return;
    }
    
    const element = document.querySelector(step.targetSelector) as HTMLElement;
    
    if (!element) {
      console.warn(`Target element not found: ${step.targetSelector}`);
      return;
    }
    
    setTargetElement(element);
    
    // Highlight target by adding a class
    element.classList.add('onboarding-target');
    
    // Scroll to the element with a slight offset to ensure it's visible
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Calculate position
    const updatePosition = () => {
      const rect = element.getBoundingClientRect();
      const tooltipRect = tooltipRef.current?.getBoundingClientRect();
      
      if (!tooltipRect) return;
      
      const placement = step.placement || 'bottom';
      let top = 0;
      let left = 0;
      
      switch (placement) {
        case 'top':
          top = rect.top - tooltipRect.height - 10;
          left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
          break;
        case 'right':
          top = rect.top + (rect.height / 2) - (tooltipRect.height / 2);
          left = rect.right + 10;
          break;
        case 'bottom':
          top = rect.bottom + 10;
          left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
          break;
        case 'left':
          top = rect.top + (rect.height / 2) - (tooltipRect.height / 2);
          left = rect.left - tooltipRect.width - 10;
          break;
        case 'center':
          top = window.innerHeight / 2 - tooltipRect.height / 2;
          left = window.innerWidth / 2 - tooltipRect.width / 2;
          break;
      }
      
      // Ensure tooltip stays within viewport
      if (left < 10) left = 10;
      if (left + tooltipRect.width > window.innerWidth - 10) {
        left = window.innerWidth - tooltipRect.width - 10;
      }
      
      if (top < 10) top = 10;
      if (top + tooltipRect.height > window.innerHeight - 10) {
        top = window.innerHeight - tooltipRect.height - 10;
      }
      
      setTooltipPosition({ top, left });
    };
    
    // Update position initially and on window resize
    updatePosition();
    window.addEventListener('resize', updatePosition);
    
    return () => {
      window.removeEventListener('resize', updatePosition);
      
      // Remove highlight when tooltip is closed
      if (element) {
        element.classList.remove('onboarding-target');
      }
    };
  }, [isOpen, step]);
  
  if (!isOpen) return null;
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay to prevent interactions with the rest of the page */}
          <div
            className="fixed inset-0 bg-black/30 z-50"
            onClick={() => step.disableOverlayClose ? null : onClose()}
          />
          
          {/* Tooltip */}
          <motion.div
            ref={tooltipRef}
            className="fixed z-[60] max-w-xs sm:max-w-sm rounded-lg bg-white shadow-lg p-4 border border-gray-200"
            style={{
              top: tooltipPosition.top,
              left: tooltipPosition.left,
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            {/* Tooltip Header */}
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <ChevronRight className="h-5 w-5 text-gray-700" />
                <h3 className="text-lg font-semibold">{step.title}</h3>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Tooltip Content */}
            <div className="my-3">
              <p className="text-sm text-gray-600">{step.content}</p>
            </div>
            
            {/* Progress indicator */}
            {step.showProgress !== false && (
              <div className="w-full h-1 bg-gray-200 rounded-full mt-2 mb-3">
                <div
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${((currentIndex + 1) / totalSteps) * 100}%` }}
                />
              </div>
            )}
            
            {/* Tooltip Footer with Navigation */}
            <div className="flex items-center justify-between mt-3">
              <div>
                <Button
                  variant="link"
                  size="sm"
                  className="text-gray-500"
                  onClick={onSkip}
                >
                  Skip tour
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onPrev}
                  disabled={currentIndex === 0}
                  className={cn(
                    currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''
                  )}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Back
                </Button>
                {currentIndex === totalSteps - 1 ? (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={onClose}
                  >
                    Finish
                  </Button>
                ) : (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={onNext}
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}