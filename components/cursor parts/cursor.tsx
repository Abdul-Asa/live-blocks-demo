import React, { useEffect, useRef, useState } from "react";
import { Badge } from "../ui/badge";

type Props = {
  color: [string, string];
  x: number;
  y: number;
  nickName: string;
  isLocalClient?: boolean;
  isTyping: boolean;
  message: string;
  onUpdateMessage?: (message: string) => void;
  showMessageBubble?: boolean;
};

export default function Cursor({
  color,
  x,
  y,
  showMessageBubble = false,
  isLocalClient,
  onUpdateMessage = () => {},
  nickName,
  isTyping,
  message,
}: Props) {
  const _isLocalClient = !x || !y || isLocalClient;
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showMessageBubble) {
      inputRef.current?.focus();
    } else {
      setInputValue("");
    }
  }, [showMessageBubble]);

  return (
    <div
      className="absolute top-0 left-0 pointer-events-none"
      style={{
        transform: `translateX(${x}px) translateY(${y}px)`,
      }}
    >
      <svg
        width="18"
        height="24"
        viewBox="0 0 18 24"
        fill="none"
        className={`${_isLocalClient ? "invisible" : ""}`}
        style={{
          color: color[0],
        }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient
            id={`gradient-${nickName}`}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" style={{ stopColor: color[0] }} />
            <stop offset="70%" style={{ stopColor: color[0] }} />
            <stop offset="100%" style={{ stopColor: color[1] }} />
          </linearGradient>
        </defs>
        <path
          d="M2.717 2.22918L15.9831 15.8743C16.5994 16.5083 16.1503 17.5714 15.2661 17.5714H9.35976C8.59988 17.5714 7.86831 17.8598 7.3128 18.3783L2.68232 22.7C2.0431 23.2966 1 22.8434 1 21.969V2.92626C1 2.02855 2.09122 1.58553 2.717 2.22918Z"
          fill={`url(#gradient-${nickName})`}
          stroke={color[1]}
          strokeWidth="1"
        />
      </svg>
      <Badge
        variant={"outline"}
        className="font-bold uppercase truncate font-open -translate-x-1/3"
        style={{
          background: `linear-gradient(to bottom right, ${color[0]}, ${color[1]})`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        {nickName}
      </Badge>

      <div
        className="absolute flex items-center px-4 py-2 transition-all duration-300 ease-linear border shadow-sm pointer-events-none w-fit -top-full left-2 rounded-3xl"
        style={{
          background: `linear-gradient(to bottom right, ${color[0]}, ${color[1]})`,
          opacity: showMessageBubble ? 1 : 0,
        }}
      >
        {isLocalClient ? (
          isTyping ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                onUpdateMessage(inputValue);
              }}
              autoComplete="off"
            >
              <input
                ref={inputRef}
                type="text"
                className="text-white bg-transparent border-none outline-none min-w-60"
                autoFocus
                name="message"
                disabled={!showMessageBubble}
                value={inputValue}
                onBlur={() => {
                  if (showMessageBubble) {
                    inputRef.current?.focus();
                  }
                }}
                onChange={(e) => setInputValue(e.target.value)}
              />
            </form>
          ) : (
            <span className="text-white">{message}</span>
          )
        ) : isTyping ? (
          <div>Typing...</div>
        ) : (
          <span className="text-white">{message}</span>
        )}
      </div>
    </div>
  );
}
