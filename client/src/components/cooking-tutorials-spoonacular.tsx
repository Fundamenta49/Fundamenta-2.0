import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import SpoonacularVideoTutorials from '@/components/spoonacular-video-tutorials';

const CookingTutorialsSpoonacular: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card className="bg-green-50 border-green-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl text-green-800">Cooking Tutorials</CardTitle>
          <CardDescription className="text-green-700">
            Learn essential cooking techniques and recipes with step-by-step videos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-green-700 mb-4">
            Our curated collection of cooking tutorials will help you master kitchen basics, 
            learn new techniques, and create delicious dishes with confidence.
          </p>
        </CardContent>
      </Card>
      
      {/* Spoonacular Video Tutorials Component */}
      <SpoonacularVideoTutorials />
    </div>
  );
};

export default CookingTutorialsSpoonacular;