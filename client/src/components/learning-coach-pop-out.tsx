import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ChatInterface from '@/components/chat-interface';
import { LEARNING_CATEGORY } from '@/components/chat-interface';

interface LearningCoachPopOutProps {
  onClose: () => void;
}

export default function LearningCoachPopOut({ onClose }: LearningCoachPopOutProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50 w-full max-w-md">
      <Card className="shadow-xl border-2 border-orange-200">
        <CardHeader className="p-4 border-b bg-orange-50 flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-medium text-orange-700">Learning Coach</CardTitle>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <ChatInterface 
            category={LEARNING_CATEGORY} 
            initialContext={{
              currentPage: 'learning',
              currentSection: 'courses',
              availableActions: [
                '/learning/courses/economics',
                '/learning/courses/programming',
                '/learning/courses/spanish'
              ]
            }}
            className="border-none shadow-none"
          />
        </CardContent>
      </Card>
    </div>
  );
}