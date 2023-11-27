"use client";

import { ReactNode } from "react";
import { ClientSideSuspense } from "@liveblocks/react";
import { RoomProvider } from "@/liveblocks.config";
import { generateRandomName } from "@/lib/generate-name";
import { getRandomColor } from "@/lib/generate-colors";

const initialName = generateRandomName();
const initialColor = getRandomColor();

export function Room({ children }: { children: ReactNode }) {
  return (
    <RoomProvider
      id="my-room"
      initialPresence={{
        cursor: null,
        isTyping: false,
        nickName: initialName,
        color: initialColor,
        message: "",
      }}
    >
      <ClientSideSuspense fallback={<div>Loading…</div>}>
        {() => children}
      </ClientSideSuspense>
    </RoomProvider>
  );
}
