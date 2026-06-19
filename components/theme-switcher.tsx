"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Check, Moon, Palette, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Base themes (light/dark)
const baseThemes = [
  {
    name: "Light",
    id: "light",
    icon: Sun,
  },
  {
    name: "Dark",
    id: "dark",
    icon: Moon,
  },
];

// Color themes
const colorThemes = [
  {
    name: "Default",
    id: "",
    color: "#000000",
  },
  {
    name: "Red",
    id: "theme-red",
    color: "#ef4444",
  },
  {
    name: "Blue",
    id: "theme-blue",
    color: "#3b82f6",
  },
  {
    name: "Yellow",
    id: "theme-yellow",
    color: "#eab308",
  },
  {
    name: "Orange",
    id: "theme-orange",
    color: "#f97316",
  },
  {
    name: "Purple",
    id: "theme-purple",
    color: "#8b5cf6",
  },
];

export function ThemeSwitcher() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [activeColorTheme, setActiveColorTheme] = useState("");

  // Effect to handle theme class application
  useEffect(() => {
    // Get current color theme from localStorage or default to ""
    const storedColorTheme = localStorage.getItem("color-theme") || "";
    setActiveColorTheme(storedColorTheme);

    // Apply the color theme class if it exists
    if (storedColorTheme) {
      document.documentElement.classList.add(storedColorTheme);
    }

    setMounted(true);
  }, []);

  // Avoid hydration mismatch
  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="h-9 w-9">
        <Palette className="h-4 w-4" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }

  // Function to handle base theme change (light/dark)
  const handleBaseThemeChange = (themeId: string) => {
    setTheme(themeId);
  };

  // Function to handle color theme change
  const handleColorThemeChange = (themeId: string) => {
    // Remove current color theme class
    if (activeColorTheme) {
      document.documentElement.classList.remove(activeColorTheme);
    }

    // Add new color theme class if not default
    if (themeId) {
      // إزالة اللون القديم
      if (activeColorTheme) {
        document.documentElement.classList.remove(activeColorTheme);
      }

      // إضافة اللون الجديد فقط، بدون دمج مع "dark" أو "light"
      if (themeId && !themeId.includes(" ")) {
        document.documentElement.classList.add(themeId);
      }
    }

    // Store the color theme preference
    localStorage.setItem("color-theme", themeId);
    setActiveColorTheme(themeId);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Palette className="h-4 w-4" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Appearance</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel className="font-normal">Mode</DropdownMenuLabel>
          {baseThemes.map((theme) => (
            <DropdownMenuItem
              key={theme.id}
              onClick={() => handleBaseThemeChange(theme.id)}
            >
              <theme.icon className="mr-2 h-4 w-4" />
              <span>{theme.name}</span>
              {resolvedTheme === theme.id && (
                <Check className="ml-auto h-4 w-4" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel className="font-normal">Color</DropdownMenuLabel>
          {colorThemes.map((theme) => (
            <DropdownMenuItem
              key={theme.name}
              onClick={() => handleColorThemeChange(theme.id)}
            >
              <div
                className="mr-2 h-4 w-4 rounded-full border"
                style={{
                  backgroundColor: theme.color,
                  borderColor: "currentColor",
                }}
              />
              <span>{theme.name}</span>
              {activeColorTheme === theme.id && (
                <Check className="ml-auto h-4 w-4" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
