import TodoApp from "@/components/todo-app";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TaskMaster with Appwrite - Todo List",
  description:
    "A comprehensive todo list application with Appwrite integration",
};

export default function TodosPage() {
  return (
    <main className="container mx-auto p-4 md:p-6 lg:p-8 min-h-screen">
      <TodoApp />
    </main>
  );
}
