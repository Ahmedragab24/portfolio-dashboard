"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Calendar, Clock, Edit, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";

import type { TodoList as TodoItem } from "@/lib/appwrite";

interface TodoListProps {
  todos: TodoItem[];
  onToggleComplete: (todo: TodoItem) => void;
  onEdit: (todo: TodoItem) => void;
  onDelete: (id: string) => void;
}

export default function TodoList({
  todos,
  onToggleComplete,
  onEdit,
  onDelete,
}: TodoListProps) {
  const [expandedTodoId, setExpandedTodoId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedTodoId(expandedTodoId === id ? null : id);
  };

  const getPriorityColor = (priority: TodoItem["Priority"]) => {
    switch (priority) {
      case "High":
        return "bg-red-500/10 text-red-500 hover:bg-red-500/20";
      case "Medium":
        return "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20";
      case "Low":
        return "bg-green-500/10 text-green-500 hover:bg-green-500/20";
      default:
        return "bg-muted";
    }
  };

  const getCategoryColor = (category: TodoItem["Category"]) => {
    switch (category) {
      case "Work":
        return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20";
      case "Personality":
        return "bg-purple-500/10 text-purple-500 hover:bg-purple-500/20";
      case "Programming":
        return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20";
      case "Health":
      case "Worship":
        return "bg-green-500/10 text-yellow-500 hover:bg-yellow-500/20";
      case "Health":
        return "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20";
      case "Other":
        return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20";
      default:
        return "bg-muted";
    }
  };

  const isOverdue = (dueDate: Date | null) => {
    if (!dueDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return dueDate < today;
  };

  if (todos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-muted p-6 mb-4">
          <Calendar className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold">No todos found</h3>
        <p className="text-muted-foreground mt-2 max-w-md">
          You don't have any todos that match your current filters. Try
          adjusting your filters or add a new todo.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {todos.map((todo) => (
        <Card
          key={todo.$id}
          className={`transition-all ${todo.completed ? "opacity-70" : ""}`}
        >
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Checkbox
                id={`todo-${todo.$id}`}
                checked={todo.completed}
                onCheckedChange={() => onToggleComplete(todo)}
                className="mt-1"
              />
              <div className="flex-1 min-w-0">
                <div
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 cursor-pointer"
                  onClick={() => todo.$id && toggleExpand(todo.$id)}
                >
                  <div>
                    <h3
                      className={`font-medium text-lg ${
                        todo.completed
                          ? "line-through text-muted-foreground"
                          : ""
                      }`}
                    >
                      {todo.Title}
                    </h3>
                    {todo.Date && (
                      <div className="flex items-center text-sm mt-1">
                        <Clock className="h-3.5 w-3.5 mr-1" />
                        <span
                          className={
                            isOverdue(
                              todo.Date instanceof Date
                                ? todo.Date
                                : new Date(todo.Date)
                            ) && !todo.completed
                              ? "text-red-500"
                              : "text-muted-foreground"
                          }
                        >
                          Due{" "}
                          {format(
                            todo.Date instanceof Date
                              ? todo.Date
                              : new Date(todo.Date),
                            "PPP"
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge
                      variant="secondary"
                      className={getCategoryColor(todo.Category)}
                    >
                      {todo.Category.charAt(0).toUpperCase() +
                        todo.Category.slice(1)}
                    </Badge>
                    <Badge
                      variant="secondary"
                      className={getPriorityColor(todo.Priority)}
                    >
                      {todo.Priority.charAt(0).toUpperCase() +
                        todo.Priority.slice(1)}
                    </Badge>
                  </div>
                </div>

                {todo.$id && expandedTodoId === todo.$id && (
                  <div className="mt-3 text-muted-foreground">
                    <p className="whitespace-pre-wrap">
                      {todo.Description || "No description provided."}
                    </p>
                    <div className="flex items-center justify-between mt-4">
                      <div className="text-xs text-muted-foreground">
                        Created{" "}
                        {format(
                          todo.Date instanceof Date
                            ? todo.Date
                            : new Date(todo.Date),
                          "PPP"
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(todo);
                          }}
                        >
                          <Edit className="h-3.5 w-3.5 mr-1" />
                          Edit
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Trash2 className="h-3.5 w-3.5 mr-1" />
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Are you absolutely sure?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete your todo.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => todo.$id && onDelete(todo.$id)}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
