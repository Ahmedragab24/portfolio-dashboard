"use client";

import React from "react";
import { CategoryForm } from "./category-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Category } from "@/lib/appwrite";

interface IProps {
  children: React.ReactNode;
  Category?: Category;
}

const EditCategory = ({ children, Category }: IProps) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Your Category</DialogTitle>
          <DialogDescription>
            Update details about your Category to your portfolio
          </DialogDescription>
        </DialogHeader>
        <CategoryForm open={open} setOpen={setOpen} category={Category} />
      </DialogContent>
    </Dialog>
  );
};

export default EditCategory;
