"use client";

import type React from "react";

import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TodoCategory, Priority } from "@/lib/appwrite";

interface FilterPanelProps {
  activeFilter: {
    status: "all" | "active" | "completed";
    priority: Priority | "all";
    category: TodoCategory | "all";
    date: "all" | "overdue" | "today" | "upcoming" | "noDueDate";
  };
  setActiveFilter: React.Dispatch<
    React.SetStateAction<{
      status: "all" | "active" | "completed";
      priority: Priority | "all";
      category: TodoCategory | "all";
      date: "all" | "overdue" | "today" | "upcoming" | "noDueDate";
    }>
  >;
}

export default function FilterPanel({
  activeFilter,
  setActiveFilter,
}: FilterPanelProps) {
  const resetFilters = () => {
    setActiveFilter({
      status: "all",
      priority: "all",
      category: "all",
      date: "all",
    });
  };

  const hasActiveFilters =
    activeFilter.priority !== "all" ||
    activeFilter.category !== "all" ||
    activeFilter.date !== "all";

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">Filters</h3>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="h-8 px-2 text-xs"
            >
              <X className="h-3.5 w-3.5 mr-1" />
              Reset filters
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label htmlFor="priority-filter" className="text-sm font-medium">
              Priority
            </label>
            <Select
              value={activeFilter.priority}
              onValueChange={(value) =>
                setActiveFilter((prev) => ({ ...prev, priority: value as any }))
              }
            >
              <SelectTrigger id="priority-filter" className="h-8">
                <SelectValue placeholder="All priorities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All priorities</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="category-filter" className="text-sm font-medium">
              Category
            </label>
            <Select
              value={String(activeFilter.category)}
              onValueChange={(value) =>
                setActiveFilter((prev) => ({
                  ...prev,
                  category: value as TodoCategory | "all",
                }))
              }
            >
              <SelectTrigger id="category-filter" className="h-8">
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                <SelectItem value="Worship">Worship</SelectItem>
                <SelectItem value="Work">Work</SelectItem>
                <SelectItem value="Personality">Personality</SelectItem>
                <SelectItem value="Programming">Programming</SelectItem>
                <SelectItem value="Health">Health</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="due-date-filter" className="text-sm font-medium">
              Due Date
            </label>
            <Select
              value={activeFilter.date}
              onValueChange={(value) =>
                setActiveFilter((prev) => ({ ...prev, dueDate: value as any }))
              }
            >
              <SelectTrigger id="due-date-filter" className="h-8">
                <SelectValue placeholder="All due dates" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All due dates</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="today">Due today</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="noDueDate">No due date</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
