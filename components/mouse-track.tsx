"use client";

import { useMousePosition } from "@/lib/hooks/use-mouse";
import { Shell } from "./layout.tsx/shell";

// import LiveCursors from "./live";

export default function MouseTrack() {
  const { x, y } = useMousePosition();

  return (
    <div className="flex flex-col items-center justify-center">
      <Shell>
        <p>
          my position: x:{x.toFixed(2)}%, y:{y.toFixed(2)}%
        </p>
      </Shell>
    </div>
  );
}
