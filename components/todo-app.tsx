"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Plus, Search, SlidersHorizontal, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

import {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  type TodoList as TodoItem,
  type Priority,
  type TodoCategory,
} from "@/lib/appwrite";
import FilterPanel from "./filter-panel";
import TodoList from "./todo-list";
import TodoForm from "./todo-form";

export default function TodoApp() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<TodoItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<{
    status: "all" | "active" | "completed";
    priority: Priority | "all";
    category: TodoCategory | "all";
    date: "all" | "overdue" | "today" | "upcoming" | "noDueDate";
  }>({
    status: "all",
    priority: "all",
    category: "all",
    date: "all",
  });

  const { toast } = useToast();
  const searchParams = useSearchParams();

  // Load todos from Appwrite
  const loadTodos = async () => {
    try {
      setLoading(true);
      const loadedTodos = await getTodos();

      // Convert date strings to Date objects
      const processedTodos = loadedTodos.map((todo) => ({
        ...todo,
      }));

      setTodos(processedTodos);
    } catch (error) {
      console.error("Failed to load todos:", error);
      toast({
        title: "Error loading todos",
        description: "Could not load your todos. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Initialize active tab from URL if present
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam && ["all", "active", "completed"].includes(tabParam)) {
      setActiveFilter((prev) => ({ ...prev, status: tabParam as any }));
    }
    loadTodos();
  }, [searchParams]);

  const addTodo = async (
    todo: Omit<TodoItem, "$id" | "$createdAt" | "$updatedAt">
  ) => {
    try {
      const newTodo = await createTodo({
        ...todo,
        Date: new Date(), // Using current date for the required date field
      });

      setTodos((prev) => [
        {
          ...newTodo,
        },
        ...prev,
      ]);

      setIsFormOpen(false);
      toast({
        title: "Todo added",
        description: "Your todo has been successfully added.",
      });
    } catch (error) {
      console.error("Failed to add todo:", error);
      toast({
        title: "Error adding todo",
        description: "Could not add your todo. Please try again.",
        variant: "destructive",
      });
    }
  };

  const updateTodoItem = async (updatedTodo: TodoItem) => {
    try {
      if (!updatedTodo.$id) {
        throw new Error("Todo ID is missing");
      }

      await updateTodo(updatedTodo.$id, updatedTodo);

      setTodos((prev) =>
        prev.map((todo) =>
          todo.$id === updatedTodo.$id
            ? {
                ...updatedTodo,
              }
            : todo
        )
      );

      setEditingTodo(null);
      setIsFormOpen(false);
      toast({
        title: "Todo updated",
        description: "Your todo has been successfully updated.",
      });
    } catch (error) {
      console.error("Failed to update todo:", error);
      toast({
        title: "Error updating todo",
        description: "Could not update your todo. Please try again.",
        variant: "destructive",
      });
    }
  };

  const deleteTodoItem = async (id: string) => {
    try {
      await deleteTodo(id);
      setTodos((prev) => prev.filter((todo) => todo.$id !== id));
      toast({
        title: "Todo deleted",
        description: "Your todo has been successfully deleted.",
        variant: "destructive",
      });
    } catch (error) {
      console.error("Failed to delete todo:", error);
      toast({
        title: "Error deleting todo",
        description: "Could not delete your todo. Please try again.",
        variant: "destructive",
      });
    }
  };

  const toggleComplete = async (todo: TodoItem) => {
    try {
      if (!todo.$id) return;

      const updatedTodo = {
        ...todo,
        completed: !todo.completed,
      };

      await updateTodo(todo.$id, updatedTodo);

      setTodos((prev) =>
        prev.map((t) =>
          t.$id === todo.$id ? { ...t, completed: !t.completed } : t
        )
      );
    } catch (error) {
      console.error("Failed to toggle todo completion:", error);
      toast({
        title: "Error updating todo",
        description: "Could not update your todo status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const editTodo = (todo: TodoItem) => {
    setEditingTodo(todo);
    setIsFormOpen(true);
  };

  const filteredTodos = todos.filter((todo) => {
    // Search filter
    if (
      searchQuery &&
      !todo.Title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !todo.Description.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    // Status filter
    if (activeFilter.status === "active" && todo.completed) return false;
    if (activeFilter.status === "completed" && !todo.completed) return false;

    // Priority filter
    if (
      activeFilter.priority !== "all" &&
      todo.Priority !== activeFilter.priority
    )
      return false;

    // Category filter
    if (
      activeFilter.category !== "all" &&
      todo.Category !== activeFilter.category
    )
      return false;

    // Due date filter
    if (activeFilter.date !== "all" && todo.Date) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const date = new Date(todo.Date);

      if (activeFilter.date === "overdue") {
        if (!date || date >= today) return false;
      } else if (activeFilter.date === "today") {
        if (!date || date < today || date >= tomorrow) return false;
      } else if (activeFilter.date === "upcoming") {
        if (!date || date < tomorrow) return false;
      } else if (activeFilter.date === "noDueDate") {
        if (date) return false;
      }
    } else if (activeFilter.date === "noDueDate" && todo.Date) {
      return false;
    }

    return true;
  });

  return (
    <div className="space-y-6 w-full mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">TaskMaster</h1>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 items-center">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search todos..."
            className="pl-8 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-9 w-9"
              onClick={() => setSearchQuery("")}
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            className="flex-shrink-0"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button
            className="flex-shrink-0"
            onClick={() => {
              setEditingTodo(null);
              setIsFormOpen(true);
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Todo
          </Button>
        </div>
      </div>

      {isFilterOpen && (
        <FilterPanel
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
        />
      )}

      {isFormOpen && (
        <TodoForm
          onSubmit={editingTodo ? updateTodoItem : addTodo}
          onCancel={() => {
            setIsFormOpen(false);
            setEditingTodo(null);
          }}
          initialData={editingTodo}
        />
      )}

      <Tabs
        defaultValue="all"
        value={activeFilter.status}
        onValueChange={(value) =>
          setActiveFilter((prev) => ({ ...prev, status: value as any }))
        }
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-4">
          {loading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <TodoList
              todos={filteredTodos}
              onToggleComplete={toggleComplete}
              onEdit={editTodo}
              onDelete={deleteTodoItem}
            />
          )}
        </TabsContent>
        <TabsContent value="active" className="mt-4">
          {loading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <TodoList
              todos={filteredTodos}
              onToggleComplete={toggleComplete}
              onEdit={editTodo}
              onDelete={deleteTodoItem}
            />
          )}
        </TabsContent>
        <TabsContent value="completed" className="mt-4">
          {loading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <TodoList
              todos={filteredTodos}
              onToggleComplete={toggleComplete}
              onEdit={editTodo}
              onDelete={deleteTodoItem}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
