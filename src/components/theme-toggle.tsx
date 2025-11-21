"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const nextTheme = (resolvedTheme ?? theme) === "dark" ? "light" : "dark";
  const iconClass = "h-4 w-4";

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative h-9 w-9 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground"
      onClick={() => setTheme(nextTheme)}
      aria-label="Toggle color theme"
      disabled={!mounted}
    >
      <Sun className={`transition-all ${mounted && resolvedTheme === "dark" ? "scale-0" : "scale-100"} ${iconClass}`} />
      <Moon className={`absolute transition-all ${mounted && resolvedTheme === "dark" ? "scale-100" : "scale-0"} ${iconClass}`} />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
