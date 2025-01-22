import { useEffect, useState } from "react";

export function useCountUp(end: number, duration: number = 1000, start?: number) {
  const [count, setCount] = useState(start ?? end);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;
    const startValue = count;

    const animation = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const current = Math.round(startValue + (end - startValue) * easeOutQuart);
      
      setCount(current);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animation);
      }
    };

    animationFrame = requestAnimationFrame(animation);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return count;
} 