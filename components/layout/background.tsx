"use client";

import { useMousePosition } from "@/lib/hooks/use-mouse";
import { useEffect } from "react";

export default function Background({
  children,
}: {
  children: React.ReactNode;
}) {
  // --x and --y will be updated based on mouse position
  const { x, y } = useMousePosition();

  useEffect(() => {
    function updateBackgroundPosition() {
      const scale = window.visualViewport?.scale || 1;

      // Only update background position if not zoomed in
      if (scale === 1) {
        const body = document.body;
        const targetX = (window.innerWidth * x) / 100;
        const targetY = (window.innerHeight * y) / 100;

        body.style.setProperty("--x", `${targetX}px`);
        body.style.setProperty("--y", `${targetY}px`);
      }
    }

    updateBackgroundPosition();

    // Update position when mouse position changes
    window.addEventListener("resize", updateBackgroundPosition);
    return () => {
      window.removeEventListener("resize", updateBackgroundPosition);
    };
  }, [x, y]);
  return (
    <>
      <div className="fixed top-0 left-0 -z-50">
        <div className="sticky top-0 left-0 w-screen h-screen overflow-hidden">
          <div className="bg-muted-foreground/20 absolute inset-0 z-[-1] dark:bg-[#2A2A2A]" />
          <div className="bg-gradient-radial from-muted-foreground/80 absolute left-[--x] top-[--y] z-[-1] h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full from-0% to-transparent to-90% blur-md" />
          <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
            <defs>
              <pattern
                id="dotted-pattern"
                width="16"
                height="16"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="2" cy="2" r="1" fill="black" />
              </pattern>
              <mask id="dots-mask">
                <rect width="100%" height="100%" fill="white" />
                <rect width="100%" height="100%" fill="url(#dotted-pattern)" />
              </mask>
            </defs>
            <rect
              width="100%"
              height="100%"
              fill="hsl(var(--background))"
              mask="url(#dots-mask)"
            />
          </svg>
        </div>
      </div>

      {children}
    </>
  );
}
