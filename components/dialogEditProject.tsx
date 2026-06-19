import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ProjectForm } from "./project-form";
import { project } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";

interface IProps {
  children: React.ReactNode;
  project: project;
  categoryOptions: any[];
}

const DialogEditProject = ({ children, categoryOptions, project }: IProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="w-full h-[70vh] rounded-md border md:px-2 pt-4 pb-14 md:py-8">
          <ProjectForm project={project} categories={categoryOptions} />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default DialogEditProject;
