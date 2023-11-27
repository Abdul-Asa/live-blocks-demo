"use client";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Moon as IconMoon, Sun as IconSun } from "lucide-react";

const ThemeSwitch = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const [value, setValue] = useState(theme == "dark" ? true : false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const toggleTheme = () => {
    setValue(!value);
    setTheme(value ? "light" : "dark");
  };

  return (
    <div className="flex items-center">
      <button
        type="button"
        aria-pressed="false"
        className={`
          relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer 
          transition-colors ease-in-out duration-200 focus:outline-none ${
            value
              ? "bg-gray-500 hover:bg-gray-700"
              : "bg-gray-900 hover:bg-gray-800"
          }
        `}
        onClick={toggleTheme}
      >
        <span className="sr-only">Toggle Themes</span>
        <span
          aria-hidden="true"
          className={`
            relative
            ${
              value ? "translate-x-5" : "translate-x-0"
            } inline-block h-5 w-5 rounded-full
            bg-white dark:bg-gray-300 shadow-lg transform ring-0 transition ease-in-out duration-200
          `}
        >
          <IconSun
            className={
              "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-900 " +
              (!value ? "opacity-100" : "opacity-0")
            }
            strokeWidth={2}
            size={12}
          />
          <IconMoon
            className={
              "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-900 " +
              (value ? "opacity-100" : "opacity-0")
            }
            strokeWidth={2}
            size={14}
          />
        </span>
      </button>
    </div>
  );
};

export default ThemeSwitch;
