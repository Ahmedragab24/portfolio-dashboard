"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Plus, ExternalLink } from "lucide-react";
import Image from "next/image";

import { createProject, updateProject, type Project } from "@/lib/appwrite";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { MultiSelect } from "@/components/multi-select";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  image: z.any().optional(),
  DemoLink: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  githubLink: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
  categories: z.array(z.string()).optional(),
  Technologies: z
    .array(z.string())
    .min(1, "At least one technology is required"),
  projectType: z
    .array(
      z.enum([
        "ecommerce",
        "landing",
        "website",
        "dashboard",
        "mobile",
        "other",
      ])
    )
    .optional(),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

interface ProjectFormProps {
  project?: Project;
  categories?: { label: string; value: string }[];
}

export function ProjectForm({ project, categories = [] }: ProjectFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [technologies, setTechnologies] = useState<string[]>(
    project?.Technologies || []
  );
  const [newTech, setNewTech] = useState("");
  const [imagePreview, setImagePreview] = useState<string>(
    project?.image || ""
  );

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: project?.title || "",
      description: project?.description || "",
      image: project?.image || "",
      DemoLink: project?.DemoLink || "",
      githubLink: project?.githubLink || "",
      categories: project?.categories || [],
      Technologies: project?.Technologies || [],
      projectType: Array.isArray(project?.projectType)
        ? project.projectType
        : project?.projectType
        ? [project.projectType]
        : [],
    },
  });

  async function onSubmit(data: ProjectFormValues) {
    setIsSubmitting(true);
    try {
      // Remove projectType from data before sending to Appwrite (it's only for UI)
      const { projectType, ...restData } = data;

      // Ensure image has a value (required by Project type)
      const dataToSubmit = {
        ...restData,
        image: restData.image || "",
      };

      if (project?.$id) {
        await updateProject(project.$id, dataToSubmit);
        toast({
          title: "Project updated",
          description: "The project has been updated successfully.",
        });
      } else {
        await createProject(dataToSubmit);
        toast({
          title: "Project created",
          description: "The project has been created successfully.",
        });
      }
      router.push("/dashboard/projects");
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save the project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  function addTechnology() {
    if (newTech.trim() && !technologies.includes(newTech.trim())) {
      const updatedTech = [...technologies, newTech.trim()];
      setTechnologies(updatedTech);
      form.setValue("Technologies", updatedTech);
      setNewTech("");
    }
  }

  function removeTechnology(tech: string) {
    const updatedTech = technologies.filter((t) => t !== tech);
    setTechnologies(updatedTech);
    form.setValue("Technologies", updatedTech);
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const url = e.target.value;
    form.setValue("image", url);
    setImagePreview(url);
  }

  // Get selected project type labels
  const getProjectTypeLabels = (values: string[] | undefined) => {
    if (!values || values.length === 0) return [];
    return values.map(
      (value) => categories.find((cat) => cat.value === value)?.label || value
    );
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 px-2">
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Project title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Project description"
                      className="min-h-32"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com/image.jpg"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        handleImageChange(e);
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    URL to the project's cover image
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 gap-6">
              <FormField
                control={form.control}
                name="DemoLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Demo Link (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://demo.example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="githubLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GitHub Link (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://github.com/username/repo"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {categories.length > 0 && (
              <FormField
                control={form.control}
                name="categories"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categories</FormLabel>
                    <FormControl>
                      <MultiSelect
                        options={categories}
                        selected={field.value || []}
                        onChange={field.onChange}
                        placeholder="Select categories"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="Technologies"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Technologies</FormLabel>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {technologies.map((tech) => (
                      <div
                        key={tech}
                        className="flex items-center gap-1 bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm"
                      >
                        {tech}
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 rounded-full"
                          onClick={() => removeTechnology(tech)}
                        >
                          <X className="h-3 w-3" />
                          <span className="sr-only">Remove {tech}</span>
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add technology"
                      value={newTech}
                      onChange={(e) => setNewTech(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addTechnology();
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addTechnology}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard/projects")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? "Saving..."
                  : project?.$id
                  ? "Update Project"
                  : "Create Project"}
              </Button>
            </div>
          </form>
        </Form>
      </div>

      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Project Preview</h2>
            <Separator className="mb-4" />

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Image Preview
                </h3>
                <div className="relative aspect-video overflow-hidden rounded-lg border bg-muted">
                  {imagePreview ? (
                    <Image
                      src={imagePreview || "/placeholder.svg"}
                      alt="Project preview"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      onError={() => setImagePreview("")}
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                      No image preview available
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Title
                </h3>
                <p className="font-semibold">
                  {form.watch("title") || "Project Title"}
                </p>
              </div>

              {form.watch("projectType") &&
                form.watch("projectType")!.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Project Type / نوع المشروع
                    </h3>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {getProjectTypeLabels(form.watch("projectType")).map(
                        (label, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary"
                          >
                            {label}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                )}

              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Description
                </h3>
                <p className="line-clamp-4">
                  {form.watch("description") ||
                    "Project description will appear here."}
                </p>
              </div>

              {form.watch("DemoLink") && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Demo Link
                  </h3>
                  <a
                    href={form.watch("DemoLink")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary flex items-center hover:underline"
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    {form.watch("DemoLink")}
                  </a>
                </div>
              )}

              {technologies.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Technologies
                  </h3>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {technologies.map((tech) => (
                      <span
                        key={tech}
                        className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-xs"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
