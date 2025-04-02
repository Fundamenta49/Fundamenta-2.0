#!/bin/bash

# Update the remaining accordion items
sed -i 's/<AccordionItem value="item-3">/<AccordionItem value="item-3" className="border-green-200 dark:border-green-800">/g' client/src/components/mortgage-education.tsx
sed -i 's/<AccordionItem value="item-4">/<AccordionItem value="item-4" className="border-green-200 dark:border-green-800">/g' client/src/components/mortgage-education.tsx
sed -i 's/<AccordionItem value="item-5">/<AccordionItem value="item-5" className="border-green-200 dark:border-green-800">/g' client/src/components/mortgage-education.tsx
sed -i 's/<AccordionItem value="item-6">/<AccordionItem value="item-6" className="border-green-200 dark:border-green-800">/g' client/src/components/mortgage-education.tsx

# Update bg-muted to green theme
sed -i 's/div className="bg-muted p-3 rounded">/div className="bg-green-50\/60 dark:bg-green-950\/20 p-3 rounded border border-green-100 dark:border-green-800">/g' client/src/components/mortgage-education.tsx
sed -i 's/div className="mt-3 p-3 bg-muted rounded text-sm">/div className="mt-3 p-3 bg-green-50\/60 dark:bg-green-950\/20 rounded text-sm border border-green-100 dark:border-green-800">/g' client/src/components/mortgage-education.tsx

# Update text-primary to green
sed -i 's/className="h-4 w-4 text-primary"/className="h-4 w-4 text-green-600 dark:text-green-500"/g' client/src/components/mortgage-education.tsx

chmod +x update_accordion.sh
./update_accordion.sh
