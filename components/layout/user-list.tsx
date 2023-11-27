"use client";
import {
  useMyPresence,
  useOthers,
  useOthersMapped,
  useSelf,
  useUpdateMyPresence,
} from "@/liveblocks.config";
import { FormEvent, useEffect, useRef, useState } from "react";
import { Minimize2Icon, Maximize2Icon } from "lucide-react";
import { Shell } from "./shell";
import { Badge } from "../ui/badge";
import { shallow } from "@liveblocks/client";
import { Separator } from "../ui/separator";
import { containsColor, getNewRandomColor } from "@/lib/generate-colors";

export function UserList() {
  const onlineUsers = useOthersMapped(
    (user) => [user.presence.nickName, user.presence.color],
    shallow
  );
  const { presence } = useSelf();
  const updateMyPresence = useUpdateMyPresence();

  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [userNickName, setUserNickName] = useState(presence.nickName);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserNickName(e.target.value);
  };

  return (
    <Shell
      className={`lg:w-[400px] w-full space-y-8 h-fit flex flex-col transition-all ${
        isExpanded ? "max-h-[300px]" : "max-h-[70px]"
      } duration-500 overflow-hidden`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center w-full gap-1 space-x-2">
          <div
            style={{
              background: `linear-gradient(to bottom right, ${presence.color[0]}, ${presence.color[1]})`,
            }}
            className="h-6 border-border rounded-full border-[1px] w-6"
          />
          {isEditing ? (
            <form
              onSubmit={(e) => {
                e.preventDefault(); // Prevent page reload
                const existingNickNames: string[] = onlineUsers.map(
                  (user) => user[1][0] as string
                );
                const isDuplicateNickName = existingNickNames.includes(
                  e.currentTarget.nickName.value
                );
                if (isDuplicateNickName) {
                  alert("Nickname already taken, please choose another one");
                  setUserNickName(presence.nickName);
                  return;
                }
                updateMyPresence({ nickName: e.currentTarget.nickName.value });

                const existingColors: [string, string][] = onlineUsers.map(
                  (user) => user[1][1] as [string, string]
                );
                const isDuplicateColor = containsColor(
                  existingColors,
                  presence.color
                );
                isDuplicateColor &&
                  updateMyPresence({
                    color: getNewRandomColor(existingColors),
                  });

                setIsEditing(false); // Close the input field
              }}
            >
              <input
                autoFocus
                className="border-none outline-none font-anon"
                value={userNickName}
                required
                name="nickName"
                onChange={handleInputChange}
                minLength={2}
                type="text"
              />
              <button type="submit" className="check-icon">
                ✔
              </button>
              <button
                type="button"
                className="cross-icon"
                onClick={() => {
                  setUserNickName(presence.nickName);
                  setIsEditing(false);
                }}
              >
                ✖
              </button>
            </form>
          ) : (
            <p
              className="cursor-pointer"
              onClick={() => {
                setIsEditing(true);
                setIsExpanded(false);
              }}
            >
              {presence.nickName}
            </p>
          )}
        </div>
        <div className="flex items-center w-[150px]  justify-end gap-3">
          {isExpanded ? (
            <Minimize2Icon
              className="transition-all cursor-pointer text-scale-900 hover:text-scale-1200 hover:scale-105"
              strokeWidth={2}
              size={16}
              onClick={() => setIsExpanded(false)}
            />
          ) : (
            <>
              <Badge
                variant={"outline"}
                className="cursor-pointer "
                onClick={() => {
                  setIsEditing(false);
                  setUserNickName(presence.nickName);
                  setIsExpanded(true);
                }}
              >
                {onlineUsers.length + 1} online
              </Badge>
              <Maximize2Icon
                className="transition-all cursor-pointer text-scale-900 hover:text-scale-1200 hover:scale-105"
                strokeWidth={2}
                size={16}
                onClick={() => {
                  setIsEditing(false);
                  setUserNickName(presence.nickName);
                  setIsExpanded(true);
                }}
              />
            </>
          )}
        </div>
      </div>

      <div className="flex flex-col items-start h-full space-y-6 overflow-scroll">
        <Separator />
        {!onlineUsers.length && (
          <>
            <p className="w-full font-bold text-center font-anon">
              {"👀 Looks like you're the only one here"}
            </p>
          </>
        )}
        {onlineUsers.map((onlineUser) => {
          const id = onlineUser[0];
          const name = onlineUser[1][0] || "{nick_name:null}";
          const colors = onlineUser[1][1];

          return (
            <div
              key={id}
              className="flex items-center justify-center gap-2 space-x-2"
            >
              <div
                style={{
                  background: `linear-gradient(to bottom right, ${colors[0]}, ${colors[1]})`,
                }}
                className="h-6 border-border rounded-full border-[1px] w-6"
              />
              {name}
            </div>
          );
        })}
      </div>
    </Shell>
  );
}
