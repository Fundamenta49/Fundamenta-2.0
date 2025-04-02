#!/bin/bash

# A more targeted approach to make specific coach components mobile-responsive

echo "Updating coach components for mobile responsiveness..."

# Update learning coach components in more learning courses
FILES_TO_UPDATE=(
  "client/src/pages/learning/courses/financial-literacy.tsx"
  "client/src/pages/learning/courses/public-speaking.tsx"
  "client/src/pages/learning/courses/healthy-relationships.tsx"
  "client/src/pages/learning/courses/digital-literacy.tsx"
  "client/src/pages/learning/courses/emotional-intelligence.tsx"
  "client/src/pages/learning/courses/goal-setting.tsx"
)

# Process learning course files
for file in "${FILES_TO_UPDATE[@]}"; do
  if [ -f "$file" ]; then
    echo "Updating $file..."
    
    # Find the div containing the Ask Learning Coach button and make it responsive
    # Check if it doesn't already have 'hidden sm:block' class
    if grep -q '<div className="mt-8">' "$file"; then
      # Add the hidden class for mobile responsiveness
      sed -i 's/<div className="mt-8">/<div className="mt-8 hidden sm:block">/' "$file"
      
      # Add a comment explaining the purpose
      sed -i 's/<div className="mt-8 hidden sm:block">/{\/\* Hide Learning Coach button on mobile, show only on SM and larger screens \*\/}\n      <div className="mt-8 hidden sm:block">/' "$file"
      
      echo "Updated $file successfully."
    else
      echo "$file already has mobile optimizations or has a different structure."
    fi
  else
    echo "File $file not found, skipping."
  fi
done

# Let's also update coach button logic in floating-chat component to ensure it's mobile-friendly
FLOATING_CHAT="client/src/components/floating-chat.tsx"
if [ -f "$FLOATING_CHAT" ]; then
  echo "Ensuring floating chat is optimized for mobile..."
  
  # Check if we need to add any specific mobile optimizations to floating chat
  if ! grep -q "z-50 h-16 w-16 rounded-full shadow-lg" "$FLOATING_CHAT"; then
    echo "Adding enhanced mobile styling to floating chat button..."
    sed -i 's/z-50/z-50 h-16 w-16 rounded-full shadow-lg/' "$FLOATING_CHAT"
  else
    echo "Floating chat already has mobile optimizations."
  fi
  
  # Make sure animation is properly visible on mobile
  if ! grep -q "fixed bottom-6 right-6 sm:bottom-8 sm:right-8" "$FLOATING_CHAT"; then
    echo "Updating floating chat positioning for better mobile experience..."
    sed -i 's/fixed bottom-8 right-8/fixed bottom-6 right-6 sm:bottom-8 sm:right-8/' "$FLOATING_CHAT"
  else
    echo "Floating chat already has proper mobile positioning."
  fi
else
  echo "Floating chat component not found at expected location."
fi

echo "Mobile optimization updates complete."