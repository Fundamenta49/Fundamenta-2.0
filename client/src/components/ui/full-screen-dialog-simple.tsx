import React from 'react';
import {
  FullScreenDialog as BaseFullScreenDialog,
  FullScreenDialogContent,
  FullScreenDialogHeader,
  FullScreenDialogBody,
  FullScreenDialogFooter,
  FullScreenDialogTitle,
  FullScreenDialogDescription,
  FullScreenDialogClose
} from './full-screen-dialog';
import { Button } from './button';
import { X } from 'lucide-react';

interface FullScreenDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  themeColor?: string;
  footerContent?: React.ReactNode;
}

export function SimpleFullScreenDialog({
  isOpen,
  onClose,
  title,
  description,
  children,
  themeColor = "#22c55e", // Default to green for finance
  footerContent
}: FullScreenDialogProps) {
  return (
    <BaseFullScreenDialog open={isOpen} onOpenChange={onClose}>
      <FullScreenDialogContent themeColor={themeColor}>
        {(title || description) && (
          <FullScreenDialogHeader>
            {title && <FullScreenDialogTitle>{title}</FullScreenDialogTitle>}
            {description && <FullScreenDialogDescription>{description}</FullScreenDialogDescription>}
            
            {/* Add an explicit close button that's more visible */}
            <Button 
              variant="outline" 
              size="sm"
              className="absolute right-6 top-6 rounded-full h-10 w-10 p-0 border-2"
              style={{ borderColor: `${themeColor}`, color: `${themeColor}` }}
              onClick={onClose}
            >
              <X className="h-6 w-6" />
              <span className="sr-only">Close</span>
            </Button>
          </FullScreenDialogHeader>
        )}
        
        <FullScreenDialogBody>
          {children}
          
          {/* Floating close button at bottom right for mobile */}
          <Button 
            variant="default" 
            size="sm"
            className="fixed right-6 bottom-6 rounded-full h-12 w-12 p-0 shadow-lg md:hidden flex items-center justify-center"
            style={{ backgroundColor: themeColor }}
            onClick={onClose}
          >
            <X className="h-6 w-6" />
            <span className="sr-only">Close</span>
          </Button>
        </FullScreenDialogBody>
        
        {footerContent && (
          <FullScreenDialogFooter>
            {footerContent}
          </FullScreenDialogFooter>
        )}
      </FullScreenDialogContent>
    </BaseFullScreenDialog>
  );
}