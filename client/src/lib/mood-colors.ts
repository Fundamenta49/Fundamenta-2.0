```typescript
// Mood-based color palettes that promote emotional well-being
export const moodColors = {
  calm: {
    primary: "#7BA7BF", // Soft blue - promotes tranquility
    background: "#F5F9FA",
    text: "#2C4251",
    accent: "#A8D3D8",
    muted: "#E1EEF2",
  },
  energetic: {
    primary: "#FF7E67", // Warm coral - promotes vitality
    background: "#FFF9F8",
    text: "#2D1810",
    accent: "#FFB4A2",
    muted: "#FFE8E2",
  },
  focused: {
    primary: "#6B9080", // Forest green - promotes concentration
    background: "#F4F7F6",
    text: "#2D3A33",
    accent: "#A4C3B2",
    muted: "#EAF0ED",
  },
  peaceful: {
    primary: "#B5838D", // Muted rose - promotes serenity
    background: "#FBF7F8",
    text: "#3A2529",
    accent: "#E5B3BC",
    muted: "#F5E6E8",
  },
  motivated: {
    primary: "#F6BD60", // Golden yellow - promotes optimism
    background: "#FFFAF0",
    text: "#4A3A1D",
    accent: "#F9D89C",
    muted: "#FDF3E3",
  }
};

export type MoodType = keyof typeof moodColors;

export const moodDescriptions = {
  calm: "A soothing palette for relaxation and peace",
  energetic: "Vibrant colors to boost energy and creativity",
  focused: "Natural tones for concentration and clarity",
  peaceful: "Gentle hues for tranquility and balance",
  motivated: "Warm colors for inspiration and drive"
};

export const moodEmojis = {
  calm: "🌊",
  energetic: "⚡",
  focused: "🎯",
  peaceful: "🌸",
  motivated: "✨"
};
```
