"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, ExternalLink, Github, Pencil } from "lucide-react";

import type { Project } from "@/lib/appwrite";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "./ui/scroll-area";

interface ViewProjectDialogProps {
  project: Project;
  categories?: { label: string; value: string }[];
}

export function ViewProjectDialog({
  project,
  categories = [],
}: ViewProjectDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const getCategoryName = (id: string) => {
    const category = categories.find((cat) => cat.value === id);
    return category ? category.label : "Unknown";
  };

  const handleEdit = () => {
    setIsOpen(false);
    router.push(`/dashboard/projects/${project.$id}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Eye className="h-4 w-4" />
          <span className="sr-only">View</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{project.title}</DialogTitle>
          <DialogDescription>Project details</DialogDescription>
        </DialogHeader>
        <ScrollArea className="w-full h-[70vh] rounded-md border md:px-2 pt-4 pb-14 md:py-8">
          <div className="grid gap-6 py-4">
            <div className="relative aspect-video overflow-hidden rounded-lg border">
              <Image
                src={project.image || "/placeholder.svg"}
                alt={project.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Description
                </h3>
                <p className="mt-1 whitespace-pre-wrap">
                  {project.description}
                </p>
              </div>

              {project.Technologies && project.Technologies.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Technologies
                  </h3>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {project.Technologies.map((tech) => (
                      <Badge key={tech} variant="secondary">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {project.categories && project.categories.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Categories
                  </h3>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {project.categories.map((catId) => (
                      <Badge key={catId} variant="outline">
                        {getCategoryName(catId)}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <Separator />

              <div className="flex flex-wrap gap-4">
                {project.DemoLink && (
                  <Link
                    href={project.DemoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" size="sm">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Live Demo
                    </Button>
                  </Link>
                )}
                {project.githubLink && (
                  <Link
                    href={project.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" size="sm">
                      <Github className="mr-2 h-4 w-4" />
                      GitHub
                    </Button>
                  </Link>
                )}
                <Button onClick={handleEdit} size="sm">
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit Project
                </Button>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
