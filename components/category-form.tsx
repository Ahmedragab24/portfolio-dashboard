"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { createCategory, updateCategory, type Category } from "@/lib/appwrite";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { category } from "@/types";

const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

interface CategoryFormProps {
  category?: Category;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function CategoryForm({ category, open, setOpen }: CategoryFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (category) {
      form.reset({
        name: category.name || "",
      });
    }
  }, [category, form]);

  async function onSubmit(data: CategoryFormValues) {
    setIsSubmitting(true);

    try {
      if (!category) {
        await createCategory(data);
        toast({
          title: "Category created",
          description: "The category has been created successfully.",
        });
      } else {
        if (!category.$id) throw new Error("Category ID is required");
        await updateCategory(category.$id, data);
        toast({
          title: "Category updated",
          description: "The category has been updated successfully.",
        });
      }
      setOpen(false);
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save the category. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter category name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? "loading..."
              : category
              ? "Update Category"
              : "Create Category"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
