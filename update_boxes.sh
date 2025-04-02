#!/bin/bash

# Update all standard mortgage type boxes to green theme
sed -i 's/<div className="bg-muted p-4 rounded-lg">/<div className="bg-green-50\/60 dark:bg-green-950\/20 p-4 rounded-lg border border-green-100 dark:border-green-800">/g' client/src/components/mortgage-education.tsx

# Update font medium headers to green
sed -i 's/<h4 className="font-medium">/<h4 className="font-medium text-green-700 dark:text-green-400">/g' client/src/components/mortgage-education.tsx

# Update badge styling
sed -i 's/<Badge variant="outline">/<Badge variant="outline" className="border-green-200 text-green-700 dark:text-green-400">/g' client/src/components/mortgage-education.tsx

# Update document box styling
sed -i 's/<div className="mt-2 bg-muted p-3 rounded-md text-sm">/<div className="mt-2 bg-green-50\/80 dark:bg-green-950\/30 p-3 rounded-md text-sm border border-green-100 dark:border-green-800">/g' client/src/components/mortgage-education.tsx

# Fix the duplicate header in strategies section
sed -i 's/<h4 className="font-medium flex items-center gap-2 mb-2">\n              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-500" \/>\n              Strategies for Getting the Best Rate/<h4 className="font-medium flex items-center gap-2 mb-2">\n              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-500" \/>\n              Tips for Better Rates/g' client/src/components/mortgage-education.tsx

# Update refinancing break-even box
sed -i 's/<div className="bg-muted p-4 rounded-lg">\n            <h4 className="font-medium">Break-Even Point Analysis/<div className="bg-green-50\/60 dark:bg-green-950\/20 p-4 rounded-lg border border-green-100 dark:border-green-800">\n            <h4 className="font-medium text-green-700 dark:text-green-400">Break-Even Point Analysis/g' client/src/components/mortgage-education.tsx

chmod +x update_boxes.sh
./update_boxes.sh
