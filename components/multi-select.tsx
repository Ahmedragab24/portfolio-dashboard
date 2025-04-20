"use client";

import * as React from "react";
import { X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";

// Define a proper type for the selected items
interface SelectedItem {
  $id?: string;
  id?: string;
  value?: string;
  name?: string;
  [key: string]: any; // Allow for other properties
}

interface MultiSelectProps {
  options: { label: string; value: string }[];
  selected: SelectedItem[];
  onChange: (selectedIds: string[]) => void;
  placeholder?: string;
  className?: string;
}

export function MultiSelect({
  options,
  selected = [], // Provide default empty array
  onChange,
  placeholder = "Select items",
  className,
}: MultiSelectProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  // Get ID safely from item, checking multiple possible ID fields
  const getItemId = (item: SelectedItem | undefined): string => {
    if (!item) return "";
    return item.$id || item.id || item.value || "";
  };

  // Safely map selected items to their IDs
  const selectedIds = selected.map(getItemId).filter(Boolean);

  const handleUnselect = (id: string) => {
    const newSelected = selected.filter((item) => getItemId(item) !== id);
    onChange(newSelected.map(getItemId).filter(Boolean));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const input = inputRef.current;
    if (!input) return;

    if ((e.key === "Backspace" || e.key === "Delete") && input.value === "") {
      const newSelected = selected.slice(0, -1);
      onChange(newSelected.map(getItemId).filter(Boolean));
    }

    if (e.key === "Escape") {
      input.blur();
    }
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
      setOpen(false);
    }
  };

  React.useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter(
    (option) =>
      !selectedIds.includes(option.value) &&
      option.label.toLowerCase().includes(inputValue.toLowerCase())
  );

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      <Command
        onKeyDown={handleKeyDown}
        className="overflow-visible bg-transparent"
      >
        <div className="group rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
          <div className="flex flex-wrap gap-1">
            {selected.map((item, index) => {
              const id = getItemId(item);
              // Find the label from options or use item.name as fallback
              const label =
                options.find((opt) => opt.value === id)?.label ||
                item.name ||
                "Item";

              return (
                <Badge
                  key={id || index}
                  variant="secondary"
                  className="rounded-sm px-1 font-normal"
                >
                  {label}
                  <button
                    type="button"
                    className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    onClick={() => handleUnselect(id)}
                  >
                    <X className="h-3 w-3" />
                    <span className="sr-only">Remove {label}</span>
                  </button>
                </Badge>
              );
            })}
            <CommandPrimitive.Input
              ref={inputRef}
              value={inputValue}
              onValueChange={setInputValue}
              onFocus={() => setOpen(true)}
              placeholder={selected.length === 0 ? placeholder : ""}
              className="ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
            />
          </div>
        </div>
        {open && filteredOptions.length > 0 && (
          <div className="absolute z-10 mt-1 w-full rounded-md border bg-popover text-popover-foreground shadow-md animate-in">
            <CommandGroup className="max-h-60 overflow-auto">
              {filteredOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  onSelect={() => {
                    onChange([...selectedIds, option.value]);
                    setInputValue("");
                  }}
                  className="cursor-pointer"
                >
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </div>
        )}
      </Command>
    </div>
  );
}
