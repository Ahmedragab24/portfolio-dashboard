"use client";

import * as React from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";

// Define a proper type for the selected items
type SelectedItem = {
  $id?: string;
  value?: string;
  name?: string;
};

interface MultiSelectProps {
  options: { label: string; value: string }[];
  selected: SelectedItem[] | string[];
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

  // Normalize selected items to handle both object format and string format
  const normalizedSelected = React.useMemo(() => {
    return selected.map((item) => {
      if (typeof item === "string") {
        return { $id: item };
      }
      return item;
    });
  }, [selected]);

  // Get ID safely from item, checking multiple possible ID fields
  const getItemId = (item: any): string => {
    if (!item) return "";
    return item.$id || item.value || "";
  };

  // Get label for an item based on its ID
  const getItemLabel = (id: string): string => {
    const option = options.find((opt) => opt.value === id);
    if (option) return option.label;

    // If we can't find it in options, look in the original selected items
    const selectedItem = normalizedSelected.find(
      (item) => getItemId(item) === id
    );
    return selectedItem?.name || id;
  };

  // Safely map selected items to their IDs
  const selectedIds = normalizedSelected.map(getItemId).filter(Boolean);

  const handleUnselect = (id: string) => {
    onChange(selectedIds.filter((selectedId) => selectedId !== id));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const input = inputRef.current;
    if (!input) return;

    if (
      (e.key === "Backspace" || e.key === "Delete") &&
      input.value === "" &&
      selectedIds.length > 0
    ) {
      const newSelectedIds = [...selectedIds];
      newSelectedIds.pop();
      onChange(newSelectedIds);
    }

    if (e.key === "Escape") {
      input.blur();
      setOpen(false);
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
            {selectedIds.map((id) => (
              <Badge
                key={id}
                variant="secondary"
                className="rounded-sm px-1 font-normal"
              >
                {getItemLabel(id)}
                <button
                  type="button"
                  className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onClick={() => handleUnselect(id)}
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Remove {getItemLabel(id)}</span>
                </button>
              </Badge>
            ))}
            <CommandPrimitive.Input
              ref={inputRef}
              value={inputValue}
              onValueChange={setInputValue}
              onFocus={() => setOpen(true)}
              placeholder={selectedIds.length === 0 ? placeholder : ""}
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
