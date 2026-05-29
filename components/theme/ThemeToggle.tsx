"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by waiting for mount
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-9 h-9" />; // Placeholder spacer
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative w-9 h-9 flex items-center justify-center rounded-lg border border-border bg-card text-foreground hover:bg-accent transition-colors"
      aria-label="Toggle theme"
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        {/* Sun Icon */}
        <Sun
          size={18}
          className={`absolute transition-all duration-150 ${
            isDark ? "opacity-100 scale-100 rotate-0" : "opacity-0 scale-75 rotate-90"
          }`}
        />
        {/* Moon Icon */}
        <Moon
          size={18}
          className={`absolute transition-all duration-150 ${
            isDark ? "opacity-0 scale-75 -rotate-90" : "opacity-100 scale-100 rotate-0"
          }`}
        />
      </div>
    </button>
  );
}
