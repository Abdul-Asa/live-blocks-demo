"use client";
import { ReactNode, useEffect, useState } from "react";
import {
  useBroadcastEvent,
  useEventListener,
  useMyPresence,
  useOthers,
} from "@/liveblocks.config";
import { useMousePosition } from "@/lib/hooks/use-mouse";
import Cursor from "./cursor";
import ReactionSelector from "./reaction-selector";
import useInterval from "@/lib/hooks/use-interval";

type Reaction = {
  value: string;
  timestamp: number;
};

export function Boundary({ children }: { children: ReactNode }) {
  const { x, y } = useMousePosition();
  const broadcast = useBroadcastEvent();
  const [myPresence, updateMyPresence] = useMyPresence();
  const others = useOthers();

  const [isReactionBarVisible, setIsReactionBarVisible] = useState(false);
  const [CursorState, setCursorState] = useState<Reaction>({
    value: "❤️",
    timestamp: Date.now(),
  });
  const [myReactions, setMyReactions] = useState<Reaction[]>([]);
  const [reactions, setReactions] = useState<Reaction[]>([]);

  useInterval(() => {
    setReactions((currentReactions) =>
      currentReactions.filter(
        (reaction) => Date.now() - reaction.timestamp < 4000
      )
    );
  }, 1000);

  const handleMouseMove = () => {
    if (!isReactionBarVisible) {
      updateMyPresence({ cursor: { x, y } });
    }
  };

  const handleMouseLeave = () => {
    setIsReactionBarVisible(false);
    updateMyPresence({ cursor: null });
  };

  const sendReaction = (reaction: string) => {
    if (!myPresence.cursor) return;
    setCursorState({ value: reaction, timestamp: Date.now() });
    broadcast({
      value: reaction,
    });
    setIsReactionBarVisible(false);
  };

  const handleMouseClick = () => {
    if (isReactionBarVisible) return;
    setMyReactions((currentReactions) => [...currentReactions, CursorState]);
  };

  useEventListener(({ event, user }) => {
    if (user && user.presence.cursor) {
      setReactions((currentReactions) => [
        ...currentReactions,
        {
          point: {
            x: user.presence.cursor!.x,
            y: user.presence.cursor!.y,
          },
          value: event.value,
          timestamp: Date.now(),
        },
      ]);
    }
  });

  useEffect(() => {
    const toggleReactionBar = (e: KeyboardEvent) => {
      if (e.key === "/") {
        setIsReactionBarVisible((visible) => !visible);
      }
    };

    window.addEventListener("keydown", toggleReactionBar);
    return () => {
      window.removeEventListener("keydown", toggleReactionBar);
    };
  }, []);

  return (
    <main
      className="min-h-screen p-4 text-sm lg:px-16 lg:py-10 flex flex-col relative justify-between"
      onPointerMove={handleMouseMove}
      onPointerLeave={handleMouseLeave}
      onPointerDown={handleMouseClick}
    >
      {children}
      {myPresence.cursor && (
        <Cursor
          isLocalClient
          x={myPresence.cursor.x}
          y={myPresence.cursor.y}
          color={myPresence.color}
          nickName={myPresence.nickName}
          reactionValues={myReactions}
        />
      )}
      {isReactionBarVisible && myPresence.cursor && (
        <ReactionSelector
          x={myPresence.cursor.x}
          y={myPresence.cursor.y}
          setReaction={sendReaction}
        />
      )}

      {others
        .filter((other) => other.presence.cursor !== null)
        .map(({ connectionId, presence }) => {
          if (!presence.cursor) return null;
          return (
            <Cursor
              key={connectionId}
              x={presence.cursor.x}
              y={presence.cursor.y}
              color={presence.color}
              nickName={presence.nickName}
              reactionValues={[]}
            />
          );
        })}
    </main>
  );
}
