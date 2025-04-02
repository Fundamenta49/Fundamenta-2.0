#!/bin/bash

# Find all buttons in coach components that should be hidden on mobile
echo "Looking for coach buttons to update for mobile responsiveness..."

# Check for coach-related buttons in various sections
FILES=(
  "client/src/pages/career.tsx"
  "client/src/pages/finance.tsx"
  "client/src/pages/wellness.tsx"
)

# Helper function to process each file
process_file() {
  local file=$1
  echo "Processing $file..."
  
  # Make specific changes based on file
  if [[ $file == *"career.tsx" ]]; then
    # Find any direct coach buttons (outside of dialogs) and make them responsive
    # Look for buttons that open the coach dialog and aren't already responsive
    grep -n "className=\"w-full\"" "$file" | grep -i "coach\|advisor" | while read -r line; do
      line_num=$(echo "$line" | cut -d: -f1)
      echo "  Found button at line $line_num in $file"
      sed -i "${line_num}s/className=\"w-full\"/className=\"w-full hidden sm:block\"/" "$file"
      # Add comment above the modified line
      prev_line=$((line_num - 1))
      sed -i "${prev_line}a\                      {/* Hide on mobile, visible on larger screens */}" "$file"
    done
  
  elif [[ $file == *"finance.tsx" ]]; then
    # Similar patterns for finance page
    grep -n "Financial AI Advisor" "$file" -A 5 | grep -n "className" | grep -v "hidden" | while read -r line; do
      file_line=$(echo "$line" | cut -d- -f1)
      line_num=$(echo "$line" | cut -d: -f1)
      actual_line=$((file_line + line_num - 1))
      echo "  Found button at line $actual_line in $file"
      sed -i "${actual_line}s/className=\"/className=\"hidden sm:block /" "$file"
      # Add comment above the modified line
      prev_line=$((actual_line - 1))
      sed -i "${prev_line}a\                      {/* Hide on mobile, visible on larger screens */}" "$file"
    done
  
  elif [[ $file == *"wellness.tsx" ]]; then
    # Similar patterns for wellness page
    grep -n "Wellness AI Coach" "$file" -A 5 | grep -n "className" | grep -v "hidden" | while read -r line; do
      file_line=$(echo "$line" | cut -d- -f1)
      line_num=$(echo "$line" | cut -d: -f1)
      actual_line=$((file_line + line_num - 1))
      echo "  Found button at line $actual_line in $file"
      sed -i "${actual_line}s/className=\"/className=\"hidden sm:block /" "$file"
      # Add comment above the modified line
      prev_line=$((actual_line - 1))
      sed -i "${prev_line}a\                      {/* Hide on mobile, visible on larger screens */}" "$file"
    done
  fi
  
  # For all files, look for any "Ask X Coach" or "X Coach" buttons
  grep -n "Ask.*Coach\|Coach.*Button" "$file" | grep -n "className" | grep -v "hidden" | while read -r line; do
    file_line=$(echo "$line" | cut -d- -f1)
    line_num=$(echo "$line" | cut -d: -f1)
    actual_line=$((file_line + line_num - 1))
    echo "  Found coach button at line $actual_line in $file"
    sed -i "${actual_line}s/className=\"/className=\"hidden sm:block /" "$file"
    # Add comment above the modified line
    prev_line=$((actual_line - 1))
    sed -i "${prev_line}a\      {/* Hide coach button on mobile, show only on SM and larger screens */}" "$file"
  done
  
  echo "Completed processing $file"
}

# Process each file
for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    process_file "$file"
  else
    echo "Warning: $file not found, skipping."
  fi
done

echo "All files processed. Mobile responsiveness updates complete."