#!/bin/bash

# File to update
FILE="client/src/components/kitchen-skills-learning.tsx"

# Update cutting-techniques
sed -i 's/id: '\''cutting-techniques'\'',/id: '\''cutting-techniques'\'',\n          image: '\''https:\/\/images.unsplash.com\/photo-1560252829-804f1aedf1be?q=80\&w=500\&auto=format\&fit=crop'\'',/' $FILE

# Update measuring-basics
sed -i 's/id: '\''measuring-basics'\'',/id: '\''measuring-basics'\'',\n          image: '\''https:\/\/images.unsplash.com\/photo-1603133872878-684f208fb84b?q=80\&w=500\&auto=format\&fit=crop'\'',/' $FILE

# Update grater-techniques
sed -i 's/id: '\''grater-techniques'\'',/id: '\''grater-techniques'\'',\n          image: '\''https:\/\/images.unsplash.com\/photo-1615228939096-9c99e81b55bd?q=80\&w=500\&auto=format\&fit=crop'\'',/' $FILE

# Update specialty-tools
sed -i 's/id: '\''specialty-tools'\'',/id: '\''specialty-tools'\'',\n          image: '\''https:\/\/images.unsplash.com\/photo-1565192259022-0427b058f372?q=80\&w=500\&auto=format\&fit=crop'\'',/' $FILE

# Update pan-selection
sed -i 's/id: '\''pan-selection'\'',/id: '\''pan-selection'\'',\n          image: '\''https:\/\/images.unsplash.com\/photo-1575318634028-6a0cfcb60c1f?q=80\&w=500\&auto=format\&fit=crop'\'',/' $FILE

# Update pan-techniques
sed -i 's/id: '\''pan-techniques'\'',/id: '\''pan-techniques'\'',\n          image: '\''https:\/\/images.unsplash.com\/photo-1620146344904-097a0002d797?q=80\&w=500\&auto=format\&fit=crop'\'',/' $FILE

# Update dutch-oven
sed -i 's/id: '\''dutch-oven'\'',/id: '\''dutch-oven'\'',\n          image: '\''https:\/\/images.unsplash.com\/photo-1621330690567-1bb1eaa0ddc5?q=80\&w=500\&auto=format\&fit=crop'\'',/' $FILE

echo "Images added to all skills"
