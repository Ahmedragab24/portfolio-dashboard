import Link from "next/link";
import { Edit, Pencil } from "lucide-react";

import { getCategories } from "@/lib/appwrite";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeleteCategoryButton } from "@/components/delete-category-button";
import EditCategory from "./edit-category";

export async function CategoriesTable() {
  const categories = await getCategories();

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.length === 0 ? (
            <TableRow>
              <TableCell colSpan={2} className="h-24 text-center">
                No categories found.
              </TableCell>
            </TableRow>
          ) : (
            categories.map((category) => (
              <TableRow key={category.$id}>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <EditCategory Category={category}>
                      <Button>
                        <Pencil className="h-4 w-4" />
                        Edit
                      </Button>
                    </EditCategory>

                    <DeleteCategoryButton id={category.$id || ""} />
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
