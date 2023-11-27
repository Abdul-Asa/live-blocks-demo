"use client";

import useInterval from "@/lib/hooks/use-interval";
import {
  useOthers,
  useMyPresence,
  useBroadcastEvent,
  useEventListener,
} from "@/liveblocks.config";
import { useState, useCallback, useEffect } from "react";
import Cursor from "./cursor";
import FlyingReaction from "./flying-reactions";
import ReactionSelector from "./reaction-selector";

type Reaction = {
  value: string;
  timestamp: number;
  point: { x: number; y: number };
};

type ReactionEvent = {
  x: number;
  y: number;
  value: string;
};

export default function Boundary({ children }: { children: React.ReactNode }) {
  const others = useOthers();
  const [{ cursor, nickName, color, message, isTyping }, updateMyPresence] =
    useMyPresence();
  const broadcast = useBroadcastEvent();

  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [selectedEmoji, setSelectedEmoji] = useState("❤️"); // Default emoji
  const [isReactionBarVisible, setIsReactionBarVisible] = useState(false);
  const [isPointerDown, setIsPointerDown] = useState(false);
  const [showMessageBubble, setShowMessageBubble] = useState(false);

  //using callback to avoid rerender, passed as prop in a component
  const setReaction = useCallback((reaction: string) => {
    setSelectedEmoji(reaction);
  }, []);

  const onMessageSubmit = useCallback(
    (message: string) => {
      updateMyPresence({
        isTyping: false,
      });

      if (message.trim() === "" || message.length <= 0) {
        setShowMessageBubble(false);
      } else {
        updateMyPresence({
          message: message,
        });
      }
    },
    [updateMyPresence]
  );

  //every 1000ms, remove reactions that are older than 4 seconds
  useInterval(() => {
    setReactions((reactions) =>
      reactions.filter((reaction) => reaction.timestamp > Date.now() - 4000)
    );
  }, 1000);
  //every 100ms, if the pointer is down and the cursor is not null, add a reaction to the list of reactions
  useInterval(() => {
    if (isPointerDown && cursor) {
      setReactions((reactions) =>
        reactions.concat([
          {
            point: { x: cursor.x, y: cursor.y },
            value: selectedEmoji,
            timestamp: Date.now(),
          },
        ])
      );
      broadcast({
        x: cursor.x,
        y: cursor.y,
        value: selectedEmoji,
      });
    }
  }, 100);

  //add keyboard event listeners
  useEffect(() => {
    function onKeyUp(e: KeyboardEvent) {
      e.preventDefault();
      if (e.key === " ") {
        setShowMessageBubble(true);
        updateMyPresence({
          isTyping: true,
        });
      } else if (e.key === "Escape") {
        setShowMessageBubble(false);

        setIsReactionBarVisible(false);
        updateMyPresence({
          isTyping: false,
        });
      } else if (e.key === "Enter") {
        updateMyPresence({
          isTyping: false,
        });
        setIsReactionBarVisible(false);
      } else if (e.key === "Shift") {
        setIsReactionBarVisible(!isReactionBarVisible);
      }
    }

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "/") {
        e.preventDefault();
        console.log("was popping");
      }
    }

    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isReactionBarVisible, updateMyPresence]);

  //Event listener for reaction events
  useEventListener((eventData) => {
    const event = eventData.event as ReactionEvent;
    setReactions((reactions) =>
      reactions.concat([
        {
          point: { x: event.x, y: event.y },
          value: event.value,
          timestamp: Date.now(),
        },
      ])
    );
  });

  //Functions for pointer events on the main boundary

  //Updates cursor position on pointer move
  const onPointerMove = (event: React.PointerEvent) => {
    event.preventDefault();
    if (cursor == null || !isReactionBarVisible) {
      updateMyPresence({
        cursor: {
          x: Math.round(event.clientX),
          y: Math.round(event.clientY),
        },
      });
    }
  };

  //Hides cursor when pointer leaves the boundary, sets cursor to null
  const onPointerLeave = () => {
    updateMyPresence({
      cursor: null,
    });
  };

  //setsPointerDown to true when pointer is down, and updates cursor position
  const onPointerDown = (event: React.PointerEvent) => {
    //prevent right clcks and other spams
    if (event.button !== 2) {
      updateMyPresence({
        cursor: {
          x: Math.round(event.clientX),
          y: Math.round(event.clientY),
        },
      });

      setIsPointerDown(true);
    }
  };

  //setsPointerDown to false when pointer is up
  const onPointerUp = () => {
    setIsPointerDown(false);
  };

  return (
    <main
      className="relative flex flex-col items-center justify-between w-full min-h-screen p-4 overflow-hidden text-sm touch-none lg:px-16 lg:py-10"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
    >
      {children}
      {reactions.map((reaction) => {
        return (
          <FlyingReaction
            key={reaction.timestamp.toString()}
            x={reaction.point.x}
            y={reaction.point.y}
            timestamp={reaction.timestamp}
            value={reaction.value}
          />
        );
      })}
      {cursor && (
        <Cursor
          color={color}
          x={cursor.x}
          y={cursor.y}
          nickName={nickName}
          isTyping={isTyping}
          message={message}
          isLocalClient
          showMessageBubble={showMessageBubble}
          onUpdateMessage={onMessageSubmit}
        />
      )}
      {isReactionBarVisible && cursor && (
        <ReactionSelector
          x={cursor.x}
          y={cursor.y}
          setReaction={(reaction) => {
            {
              isReactionBarVisible && setIsReactionBarVisible(false);
            }
            setReaction(reaction);
          }}
        />
      )}

      {others.map(({ connectionId, presence }) => {
        if (presence == null || !presence.cursor) {
          return null;
        }

        return (
          <Cursor
            key={connectionId}
            color={presence.color}
            x={presence.cursor.x}
            y={presence.cursor.y}
            nickName={presence.nickName}
            isTyping={presence.isTyping}
            message={presence.message}
          />
        );
      })}
    </main>
  );
}
