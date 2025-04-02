#!/bin/bash

# Update the Ask Learning Coach button to be hidden on mobile in all course pages
FILES=(
  "client/src/pages/learning/courses/conversation-skills.tsx"
  "client/src/pages/learning/courses/forming-positive-habits.tsx"
  "client/src/pages/learning/courses/critical-thinking.tsx"
  "client/src/pages/learning/courses/conflict-resolution.tsx"
  "client/src/pages/learning/courses/time-management.tsx"
  "client/src/pages/learning/courses/decision-making.tsx"
  "client/src/pages/learning/courses/coping-with-failure.tsx"
)

for file in "${FILES[@]}"; do
  # Check if file exists
  if [ -f "$file" ]; then
    echo "Updating $file..."
    
    # Use sed to replace the div containing the Ask Learning Coach button
    # Add "hidden sm:block" to hide on mobile and show on sm screens and larger
    sed -i 's/<div className="mt-8">/<div className="mt-8 hidden sm:block">/' "$file"
    
    # Add a comment above the div
    sed -i 's/<div className="mt-8 hidden sm:block">/{\/\* Hide Learning Coach button on mobile, show only on SM and larger screens \*\/}\n      <div className="mt-8 hidden sm:block">/' "$file"
    
    echo "Updated $file successfully."
  else
    echo "Warning: $file not found, skipping."
  fi
done

echo "All files updated successfully."