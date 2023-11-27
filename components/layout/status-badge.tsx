"use client";
import React, { useState } from "react";
import { badgeVariants } from "../ui/badge";
import { useStatus } from "@/liveblocks.config";

const StatusBadge = () => {
  const status = useStatus();
  const capitalizedStatus =
    status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

  return (
    <div
      className={`${badgeVariants({
        variant: "outline",
      })} flex gap-3 items-center`}
    >
      <p>{capitalizedStatus}</p>
      <div className="relative flex items-center pr-3">
        <div
          className={`absolute w-2 h-2 ${
            status === "connected" ? "bg-green-500" : "bg-yellow-500"
          } rounded-full`}
        ></div>
        <div
          className={`absolute w-2 h-2 ${
            status === "connected" ? "bg-green-500" : "bg-yellow-500"
          } rounded-full animate-ping`}
        ></div>
      </div>
    </div>
  );
};

export default StatusBadge;
