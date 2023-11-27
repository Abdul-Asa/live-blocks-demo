import { motion } from "framer-motion";
import { FC, FormEvent, useEffect, useRef, useState } from "react";
import { Badge } from "./ui/badge";
import { getContrastingColor } from "@/lib/generate-colors";
import FlyingReaction from "./flying-reactions";

interface Props {
  x: number;
  y: number;
  color: [string, string];
  nickName: string;
  isLocalClient?: boolean;
  reactionValues: { value: string; timestamp: number }[];
}

const Cursor: FC<Props> = ({
  x,
  y,
  color,
  nickName,
  isLocalClient,
  reactionValues,
  // onUpdateMessage = () => {},
}) => {
  // Don't show cursor for the local client
  const _isLocalClient = !x || !y || isLocalClient;
  return (
    <div
      className="absolute transition-all pointer-events-none duration-300 ease-linear"
      style={{
        left: `${x}%`,
        top: `${y}%`,
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
        className=" truncate uppercase -translate-x-1/3 font-anon border-none"
        style={{
          color: "white",
          background: `linear-gradient(to bottom right, ${color[0]}, ${color[1]})`,
        }}
      >
        {nickName}
      </Badge>
      {reactionValues.map((emoji) => (
        <FlyingReaction
          key={emoji.timestamp}
          timestamp={emoji.timestamp}
          value={emoji.value}
        />
      ))}
    </div>
  );
};

export default Cursor;
// import React, { useMemo } from "react";
// import Image from "next/image";
// import { motion } from "framer-motion";

// type AllProps = {
//   variant?: "basic" | "name" | "avatar";
//   x: number;
//   y: number;
//   color: [string, string];
// };

// type BasicCursorProps = AllProps & {
//   variant?: "basic";
//   name?: never;
//   avatar?: never;
//   size?: never;
// };

// type NameCursorProps = AllProps & {
//   variant: "name";
//   name: string;
//   avatar?: never;
//   size?: never;
// };

// type AvatarCursorProps = AllProps & {
//   variant: "avatar";
//   avatar: string;
//   name?: never;
//   size?: number;
// };

// type CursorProps = BasicCursorProps | NameCursorProps | AvatarCursorProps;

// export default function Cursor({
//   variant = "basic",
//   x,
//   y,
//   color = ["", ""],
//   name = "",
//   avatar = "",
//   size = 36,
// }: CursorProps) {
//   return (
//     <motion.div
//       className="fixed top-0 left-0 pointer-events-none select-none"
//       initial={{ x, y }}
//       animate={{ x, y }}
//       transition={{
//         type: "spring",
//         bounce: 0.6,
//         damping: 30,
//         mass: 0.8,
//         stiffness: 350,
//         restSpeed: 0.01,
//       }}
//     >
//       {variant === "basic" ? <BasicCursor color={color} /> : null}
//       {variant === "name" ? <NameCursor color={color} name={name} /> : null}
//       {variant === "avatar" ? (
//         <AvatarCursor color={color} avatar={avatar} size={size} />
//       ) : null}
//     </motion.div>
//   );
// }

// function BasicCursor({ color }: Pick<BasicCursorProps, "color">) {
//   return (
//     <svg width="32" height="44" viewBox="0 0 24 36" fill="none">
//       <defs>
//         <linearGradient id="gradient" x1="0%" y1="0%" x2="500%" y2="0%">
//           <stop offset="0%" stopColor={color[0]} />
//           <stop offset="100%" stopColor={color[1]} />
//         </linearGradient>
//       </defs>
//       <path
//         fill="url(#gradient)"
//         d="M0.928548 2.18278C0.619075 1.37094 1.42087 0.577818 2.2293 0.896107L14.3863 5.68247C15.2271 6.0135 15.2325 7.20148 14.3947 7.54008L9.85984 9.373C9.61167 9.47331 9.41408 9.66891 9.31127 9.91604L7.43907 14.4165C7.09186 15.2511 5.90335 15.2333 5.58136 14.3886L0.928548 2.18278Z"
//       />
//     </svg>
//   );
// }

// function NameCursor({ color, name }: Pick<NameCursorProps, "color" | "name">) {
//   const textColor = useMemo(() => (color ? color[1] : undefined), [color]);
//   return (
//     <div className="relative">
//       <svg
//         className="relative"
//         width="32"
//         height="44"
//         viewBox="0 0 24 36"
//         fill="none"
//       >
//         <defs>
//           <linearGradient id="gradient" x1="0%" y1="0%" x2="500%" y2="0%">
//             <stop offset="0%" stopColor={color[0]} />
//             <stop offset="100%" stopColor={color[1]} />
//           </linearGradient>
//         </defs>
//         <path
//           fill="url(#gradient)"
//           d="M0.928548 2.18278C0.619075 1.37094 1.42087 0.577818 2.2293 0.896107L14.3863 5.68247C15.2271 6.0135 15.2325 7.20148 14.3947 7.54008L9.85984 9.373C9.61167 9.47331 9.41408 9.66891 9.31127 9.91604L7.43907 14.4165C7.09186 15.2511 5.90335 15.2333 5.58136 14.3886L0.928548 2.18278Z"
//         />
//       </svg>
//       <div
//         className="absolute overflow-hidden top-4 left-4 pt-1.5 pb-1.5 pl-3 pr-3 text-xs leading-5 font-medium whitespace-nowrap rounded-md"
//         style={{
//           backgroundImage: `linear-gradient(to bottom right, ${color[0]}, ${color[1]})`,
//           color: textColor,
//         }}
//       >
//         <div className="relative z-10">{name}</div>
//       </div>
//     </div>
//   );
// }

// function AvatarCursor({
//   color,
//   avatar,
//   size,
// }: Pick<AvatarCursorProps, "color" | "avatar" | "size">) {
//   return (
//     <div className="relative">
//       <svg width="32" height="44" viewBox="0 0 24 36" fill="none">
//         <defs>
//           <linearGradient id="gradient" x1="0%" y1="0%" x2="500%" y2="0%">
//             <stop offset="0%" stopColor={color[0]} />
//             <stop offset="100%" stopColor={color[1]} />
//           </linearGradient>
//         </defs>
//         <path
//           fill="url(#gradient)"
//           d="M0.928548 2.18278C0.619075 1.37094 1.42087 0.577818 2.2293 0.896107L14.3863 5.68247C15.2271 6.0135 15.2325 7.20148 14.3947 7.54008L9.85984 9.373C9.61167 9.47331 9.41408 9.66891 9.31127 9.91604L7.43907 14.4165C7.09186 15.2511 5.90335 15.2333 5.58136 14.3886L0.928548 2.18278Z"
//         />
//       </svg>
//       <div
//         className="block absolute top-4 left-4 overflow-hidden rounded-full outline outline-2 outline-offset-2"
//         style={{
//           outlineColor: color[0],
//           width: size + "px",
//           height: size + "px",
//         }}
//       >
//         <Image src={avatar} height={size} width={size} alt="" />
//       </div>
//     </div>
//   );
// }

// // import { FC, FormEvent, useEffect, useRef, useState } from "react";

// // interface Props {
// //   x?: number;
// //   y?: number;
// //   color: string;
// //   hue: string;
// //   message: string;
// //   username: string;
// //   isTyping: boolean;
// //   isCancelled?: boolean;
// //   isLocalClient?: boolean;
// //   onUpdateMessage?: (message: string) => void;
// // }

// // const MAX_MESSAGE_LENGTH = 70;
// // const MAX_DURATION = 4000;

// // const Cursor: FC<Props> = ({
// //   x,
// //   y,
// //   color,
// //   username,
// //   hue,
// //   message,
// //   isTyping,
// //   isCancelled,
// //   isLocalClient,
// //   onUpdateMessage = () => {},
// // }) => {
// //   // Don't show cursor for the local client
// //   const _isLocalClient = !x || !y || isLocalClient;
// //   const inputRef = useRef() as any;
// //   const timeoutRef = useRef() as any;
// //   const chatBubbleRef = useRef() as any;

// //   const [hideInput, setHideInput] = useState(false);
// //   const [showMessageBubble, setShowMessageBubble] = useState(false);

// //   useEffect(() => {
// //     if (isTyping) {
// //       setShowMessageBubble(true);
// //       if (timeoutRef.current) clearTimeout(timeoutRef.current);

// //       if (isLocalClient) {
// //         if (inputRef.current) inputRef.current.focus();
// //         setHideInput(false);
// //       }
// //     } else {
// //       if (!message || isCancelled) {
// //         setShowMessageBubble(false);
// //       } else {
// //         if (timeoutRef.current) clearTimeout(timeoutRef.current);
// //         if (isLocalClient) setHideInput(true);
// //         const timeoutId = setTimeout(() => {
// //           setShowMessageBubble(false);
// //         }, MAX_DURATION);
// //         timeoutRef.current = timeoutId;
// //       }
// //     }
// //   }, [isLocalClient, isTyping, isCancelled, message, inputRef]);

// //   return (
// //     <>
// //       <div
// //         className="absolute transition-all duration-300 ease-linear -translate-x-1/2 -translate-y-1/2"
// //         style={{
// //           left: `${x}%`,
// //           top: `${y}%`,
// //         }}
// //       >
// //         {!_isLocalClient && (
// //           <svg
// //             width="18"
// //             height="24"
// //             viewBox="0 0 18 24"
// //             fill="none"
// //             className="absolute top-0 left-0 transition transform pointer-events-none"
// //             style={{
// //               color,
// //             }}
// //             xmlns="http://www.w3.org/2000/svg"
// //           >
// //             <path
// //               d="M2.717 2.22918L15.9831 15.8743C16.5994 16.5083 16.1503 17.5714 15.2661 17.5714H9.35976C8.59988 17.5714 7.86831 17.8598 7.3128 18.3783L2.68232 22.7C2.0431 23.2966 1 22.8434 1 21.969V2.92626C1 2.02855 2.09122 1.58553 2.717 2.22918Z"
// //               fill={color}
// //               stroke={hue}
// //               strokeWidth="2"
// //             />
// //           </svg>
// //         )}
// //         <div
// //           className="absolute truncate -translate-x-1/2 translate-y-full"
// //           style={{ color }}
// //         >
// //           {username}
// //         </div>{" "}
// //       </div>
// //       <div
// //         ref={chatBubbleRef}
// //         className={[
// //           "absolute transition-all duration-300 ease-linear py-2 rounded-full shadow-md -translate-x-1/2 -translate-y-full pointer-events-none",
// //           "flex items-center justify-between px-4 space-x-2 pointer-events-none",
// //           `${showMessageBubble ? "opacity-100" : "opacity-0"}`,
// //           `${
// //             _isLocalClient && !hideInput
// //               ? "w-[280px]"
// //               : "max-w-[280px] overflow-hidden"
// //           }`,
// //         ].join(" ")}
// //         style={{
// //           background: hue,
// //           left: `${x}%`,
// //           top: `${y}%`,
// //         }}
// //       >
// //         {_isLocalClient && !hideInput ? (
// //           <>
// //             <input
// //               ref={inputRef}
// //               value={message}
// //               className="w-full text-white bg-transparent border-none outline-none"
// //               onChange={(e: FormEvent<HTMLInputElement>) => {
// //                 const text = e.currentTarget.value;
// //                 if (text.length <= MAX_MESSAGE_LENGTH)
// //                   onUpdateMessage(e.currentTarget.value);
// //               }}
// //             />
// //             <p className="text-xs" style={{ color: hue }}>
// //               {message.length}/{MAX_MESSAGE_LENGTH}
// //             </p>
// //           </>
// //         ) : message.length ? (
// //           <div className="text-white truncate">{message}</div>
// //         ) : (
// //           <div className="flex items-center justify-center">
// //             <div className="relative block w-10 h-6 loader-dots">
// //               <div className="absolute top-0 my-2.5 w-1.5 h-1.5 rounded-full bg-white opacity-75"></div>
// //               <div className="absolute top-0 my-2.5 w-1.5 h-1.5 rounded-full bg-white opacity-75"></div>
// //               <div className="absolute top-0 my-2.5 w-1.5 h-1.5 rounded-full bg-white opacity-75"></div>
// //               <div className="absolute top-0 my-2.5 w-1.5 h-1.5 rounded-full bg-white opacity-75"></div>
// //             </div>
// //           </div>
// //         )}
// //       </div>
// //     </>
// //   );
// // };

// // export default Cursor;
