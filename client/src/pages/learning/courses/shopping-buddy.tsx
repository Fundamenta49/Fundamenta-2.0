import { useState } from 'react';
import { useLocation } from 'wouter';
import { ShoppingBag, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FloatingChat from '@/components/floating-chat';
import { LEARNING_CATEGORY } from '@/components/chat-interface';
import ShoppingBuddy from '@/components/shopping-buddy';

export default function ShoppingBuddyCourse() {
  const [, navigate] = useLocation();

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/learning')}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Learning
        </Button>
        
        <h1 className="text-2xl font-bold flex items-center">
          <ShoppingBag className="h-6 w-6 mr-2 text-orange-500" />
          Shopping Buddy
        </h1>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border p-5 mb-8">
        <h2 className="text-lg font-semibold mb-3">Get help with grocery planning and healthy food choices</h2>
        <p className="text-gray-700 mb-5">
          Shopping Buddy helps you make smarter grocery shopping decisions, find recipes based on ingredients you have, 
          and create budget-friendly meal plans. You can add custom products, optimize your shopping list for better nutrition, 
          and discover new recipe ideas.
        </p>
        
        <div className="mt-4">
          <ShoppingBuddy />
        </div>
      </div>

      {/* Hide Learning Coach button on mobile, show only on SM and larger screens */}
      <div className="mt-8 hidden sm:block">
        <Button 
          onClick={() => document.dispatchEvent(new CustomEvent('toggle-chat', { detail: true }))}
          className="bg-orange-500 hover:bg-orange-600"
        >
          Ask Learning Coach
        </Button>
      </div>
      
      <FloatingChat category={LEARNING_CATEGORY} />
    </div>
  );
}