"use client";

import useInterval from "@/lib/hooks/use-interval";
import {
  useOthers,
  useMyPresence,
  useBroadcastEvent,
  useEventListener,
} from "@/liveblocks.config";
import { useState, useCallback, useEffect, useRef } from "react";
import Cursor from "./cursor";
import FlyingReaction from "./flying-reactions";
import ReactionSelector from "./reaction-selector";
import { useMousePosition } from "@/lib/hooks/use-mouse";
import { useBoundingClientRectRef } from "@/lib/hooks/use-bounding-client";
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

  const { x, y } = useMousePosition();
  //using percentage based x and y values
  const mainRef = useRef<HTMLDivElement>(null);
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [selectedEmoji, setSelectedEmoji] = useState("❤️"); // Default emoji
  const [isReactionBarVisible, setIsReactionBarVisible] = useState(false);
  const [isPointerDown, setIsPointerDown] = useState(false);
  const [showMessageBubble, setShowMessageBubble] = useState(false);
  const [countdown, setCountdown] = useState(5);

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
        updateMyPresence({
          message: "",
        });
        setShowMessageBubble(false);
      } else {
        updateMyPresence({
          message: message,
        });
        setShowMessageBubble(true);
        setCountdown(5);
      }
    },
    [updateMyPresence]
  );

  //countdown timer for message bubble
  useInterval(() => {
    if (countdown > 0) {
      setCountdown(countdown - 1);
    } else if (showMessageBubble && !isTyping) {
      setShowMessageBubble(false);
      updateMyPresence({
        message: "",
      });
    }
  }, 1000);

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
          message: "",
        });
      } else if (e.key === "Enter") {
        updateMyPresence({
          isTyping: false,
        });
        setIsReactionBarVisible(false);
      } else if (e.key === "Control") {
        setIsReactionBarVisible(!isReactionBarVisible);
      }
    }

    window.addEventListener("keyup", onKeyUp);

    return () => {
      window.removeEventListener("keyup", onKeyUp);
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

  //Updates cursor position on pointer move
  const onPointerMove = (event: React.PointerEvent) => {
    event.preventDefault();
    if (cursor == null || !isReactionBarVisible) {
      updateMyPresence({
        cursor: {
          x: x,
          y: y,
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
          x: x,
          y: y,
        },
      });

      setIsPointerDown(true);
    }
  };

  const onPointerUp = () => {
    setIsPointerDown(false);
  };

  return (
    <main
      ref={mainRef}
      className="relative flex flex-col items-center justify-between w-full min-h-screen p-4 overflow-hidden text-sm touch-none lg:px-16 lg:py-10"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
    >
      {children}
      {/* Reactions */}
      {reactions.map((reaction) => {
        if (!mainRef.current) return null;
        return (
          <FlyingReaction
            key={reaction.timestamp.toString()}
            x={
              (reaction.point.x / 100) *
              mainRef.current.getBoundingClientRect().width
            }
            y={
              (reaction.point.y / 100) *
              mainRef.current.getBoundingClientRect().height
            }
            timestamp={reaction.timestamp}
            value={reaction.value}
          />
        );
      })}
      {/* my cursor */}
      {cursor && mainRef.current && (
        <Cursor
          color={color}
          x={(cursor.x / 100) * mainRef.current.getBoundingClientRect().width}
          y={(cursor.y / 100) * mainRef.current.getBoundingClientRect().height}
          nickName={nickName}
          isTyping={isTyping}
          message={message}
          isLocalClient
          showMessageBubble={showMessageBubble}
          onUpdateMessage={onMessageSubmit}
        />
      )}
      {/* Reactionbar */}
      {isReactionBarVisible && cursor && mainRef.current && (
        <ReactionSelector
          x={(cursor.x / 100) * mainRef.current.getBoundingClientRect().width}
          y={(cursor.y / 100) * mainRef.current.getBoundingClientRect().height}
          setReaction={(reaction) => {
            {
              isReactionBarVisible && setIsReactionBarVisible(false);
            }
            setReaction(reaction);
          }}
        />
      )}

      {/* other cursors */}
      {others.map(({ connectionId, presence }) => {
        if (presence == null || !presence.cursor || mainRef.current == null) {
          return null;
        }

        return (
          <Cursor
            key={connectionId}
            color={presence.color}
            x={
              (presence.cursor.x / 100) *
              mainRef.current.getBoundingClientRect().width
            }
            y={
              (presence.cursor.y / 100) *
              mainRef.current.getBoundingClientRect().height
            }
            nickName={presence.nickName}
            isTyping={presence.isTyping}
            message={presence.message}
            showMessageBubble={presence.message !== "" || presence.isTyping}
          />
        );
      })}
    </main>
  );
}
