```typescript
import { useState, useEffect } from 'react';
import { moodColors, type MoodType } from '@/lib/mood-colors';

export function useMoodTheme() {
  const [currentMood, setCurrentMood] = useState<MoodType>(() => {
    // Try to get the saved mood from localStorage
    const savedMood = localStorage.getItem('userMood');
    return (savedMood as MoodType) || 'calm';
  });

  useEffect(() => {
    // Save mood to localStorage
    localStorage.setItem('userMood', currentMood);

    // Update CSS variables for the theme
    const root = document.documentElement;
    const colors = moodColors[currentMood];

    root.style.setProperty('--primary', colors.primary);
    root.style.setProperty('--background', colors.background);
    root.style.setProperty('--foreground', colors.text);
    root.style.setProperty('--muted', colors.muted);
    root.style.setProperty('--accent', colors.accent);

    // Add transition for smooth color changes
    root.style.setProperty('transition', 'background-color 0.5s ease, color 0.5s ease');
  }, [currentMood]);

  return {
    currentMood,
    setCurrentMood,
  };
}
```
