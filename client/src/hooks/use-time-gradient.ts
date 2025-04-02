import { useState, useEffect } from 'react';

interface GradientColors {
  primary: string;
  secondary: string;
}

export function useTimeGradient(): GradientColors {
  const [gradientColors, setGradientColors] = useState<GradientColors>({
    primary: 'rgb(255, 225, 175)', // Default morning colors
    secondary: 'rgb(255, 255, 235)',
  });

  useEffect(() => {
    function updateGradient() {
      const hour = new Date().getHours();
      
      // Early morning (5-8)
      if (hour >= 5 && hour < 8) {
        setGradientColors({
          primary: 'rgb(255, 225, 175)',
          secondary: 'rgb(255, 255, 235)',
        });
      }
      // Morning (8-12)
      else if (hour >= 8 && hour < 12) {
        setGradientColors({
          primary: 'rgb(200, 240, 255)',
          secondary: 'rgb(255, 255, 245)',
        });
      }
      // Afternoon (12-16)
      else if (hour >= 12 && hour < 16) {
        setGradientColors({
          primary: 'rgb(145, 205, 255)',
          secondary: 'rgb(255, 255, 250)',
        });
      }
      // Late afternoon (16-19)
      else if (hour >= 16 && hour < 19) {
        setGradientColors({
          primary: 'rgb(255, 190, 150)',
          secondary: 'rgb(255, 255, 240)',
        });
      }
      // Evening (19-22)
      else if (hour >= 19 && hour < 22) {
        setGradientColors({
          primary: 'rgb(150, 125, 185)',
          secondary: 'rgb(255, 240, 245)',
        });
      }
      // Night (22-5)
      else {
        setGradientColors({
          primary: 'rgb(75, 85, 125)',
          secondary: 'rgb(25, 35, 60)',
        });
      }
    }

    // Update immediately and then every minute
    updateGradient();
    const interval = setInterval(updateGradient, 60000);

    return () => clearInterval(interval);
  }, []);

  return gradientColors;
}
