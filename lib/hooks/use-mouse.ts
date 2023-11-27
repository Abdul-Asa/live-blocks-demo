import { useEffect, useState } from "react";

interface MousePosition {
  x: number;
  y: number;
}

export function useMousePosition(): MousePosition {
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const xPercentage = (event.clientX / window.innerWidth) * 100;
      const yPercentage = (event.clientY / window.innerHeight) * 100;
      setMousePosition({ x: xPercentage, y: yPercentage });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return mousePosition;
}
