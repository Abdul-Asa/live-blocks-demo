"use client";

import { useMousePosition } from "@/lib/hooks/use-mouse";
import { Shell } from "../layout/shell";

// import LiveCursors from "./live";

export default function MouseTrack() {
  const { x, y } = useMousePosition();

  return (
    <div className="flex flex-col items-center justify-center pointer-events-none ">
      <Shell>
        <div className="flex flex-col justify-between w-full gap-4 md:flex-row ">
          <div className="flex items-center justify-center px-3 py-2 space-x-2 border rounded-md border-border">
            <p className="text-sm opacity-40">Chat</p>
            <code className="flex items-center justify-center h-6 px-1 border rounded opacity-40 ">
              Space
            </code>
          </div>
          <div className="flex items-center justify-center px-3 py-2 space-x-2 border rounded-md border-border ">
            <p className="text-sm opacity-40">Escape</p>
            <code className="flex items-center justify-center h-6 px-1 text-xs border rounded opacity-40">
              Esc
            </code>
          </div>
          <div className="flex items-center justify-center px-3 py-2 space-x-2 border rounded-md border-border ">
            <p className="text-sm opacity-40">Emojis</p>
            <code className="flex items-center justify-center h-6 px-1 text-xs border rounded opacity-40">
              Ctrl
            </code>
          </div>
        </div>
        <p className="pt-4 text-center opacity-40 font-anon">
          x:{x.toFixed(1)}%, y:{y.toFixed(1)}%
        </p>
      </Shell>
    </div>
  );
}
