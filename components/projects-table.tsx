import Link from "next/link";
import { Pencil } from "lucide-react";

import { getProjects, getCategories } from "@/lib/appwrite";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeleteProjectButton } from "@/components/delete-project-button";
import { ViewProjectDialog } from "@/components/view-project-dialog";
import DialogEditProject from "./dialogEditProject";

export async function ProjectsTable() {
  const projects = await getProjects();
  const categories = await getCategories();

  // Format categories for the dialog component
  const categoryOptions = categories.map((category) => ({
    label: category.name,
    value: category.$id || "",
  }));

  const getCategoryNames = (categoryIds: string[] = []) => {
    return categoryIds
      .map(({ $id }: any) => {
        const category = categories.find((cat) => cat.$id === $id);
        return category ? category.name : "Unknown";
      })
      .join(", ");
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Categories</TableHead>
            <TableHead>Technologies</TableHead>
            <TableHead className="w-[150px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center">
                No projects found.
              </TableCell>
            </TableRow>
          ) : (
            projects.reverse().map((project) => (
              <TableRow key={project.$id}>
                <TableCell className="font-medium">{project.title}</TableCell>
                <TableCell>{getCategoryNames(project.categories)}</TableCell>
                <TableCell>
                  {project.Technologies?.join(", ") || "None"}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <ViewProjectDialog
                      project={project}
                      categories={categoryOptions}
                    />
                    <DialogEditProject
                      project={project}
                      categoryOptions={categoryOptions}
                    >
                      <Button variant="outline" size="icon">
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                    </DialogEditProject>
                    <DeleteProjectButton id={project.$id || ""} />
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
