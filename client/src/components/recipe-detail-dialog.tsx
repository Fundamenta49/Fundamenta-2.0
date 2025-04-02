import React from 'react';
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, Clock, Users, ThumbsUp } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Recipe } from '@/services/spoonacular-service';
import { Badge } from '@/components/ui/badge';

interface RecipeDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipe: Recipe;
}

export function RecipeDetailDialog({
  open,
  onOpenChange,
  recipe
}: RecipeDetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-screen h-screen max-w-none p-0 m-0 rounded-none border-none">
        <div className="absolute top-4 right-4 z-50">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)} 
            className="h-10 w-10 p-0 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>
        
        <ScrollArea className="w-full h-full">
          <div className="max-w-5xl mx-auto p-6 md:p-8 space-y-8 pb-16">
            <div className="space-y-4">
              <h1 className="text-2xl md:text-3xl font-bold">{recipe.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-gray-600">
                {recipe.readyInMinutes && (
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    {recipe.readyInMinutes} min
                  </div>
                )}
                {recipe.servings && (
                  <div className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    {recipe.servings} servings
                  </div>
                )}
                {recipe.aggregateLikes !== undefined && (
                  <div className="flex items-center">
                    <ThumbsUp className="h-5 w-5 mr-2" />
                    {recipe.aggregateLikes} likes
                  </div>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                {recipe.image && (
                  <img 
                    src={recipe.image} 
                    alt={recipe.title} 
                    className="w-full rounded-xl shadow-md" 
                  />
                )}
                <div>
                  <h3 className="font-medium text-xl mb-3">Description</h3>
                  <div 
                    className="text-gray-700"
                    dangerouslySetInnerHTML={{ __html: recipe.summary }}
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {recipe.diets?.map(diet => (
                    <Badge key={diet} className="bg-green-100 text-green-800 hover:bg-green-200 px-3 py-1 text-sm">
                      {diet}
                    </Badge>
                  ))}
                  {recipe.dishTypes?.map(type => (
                    <Badge key={type} variant="outline" className="px-3 py-1 text-sm">
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-xl mb-3">Ingredients</h3>
                  <ul className="space-y-2">
                    {recipe.extendedIngredients?.map((ingredient, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500 flex-shrink-0"></div>
                        <span>{ingredient.original}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-xl mb-3">Instructions</h3>
                  <div 
                    className="text-gray-700 space-y-4"
                    dangerouslySetInnerHTML={{ __html: recipe.instructions }}
                  />
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}