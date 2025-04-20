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

interface IProps {
  children: React.ReactNode;
}

const AddCategory = ({ children }: IProps) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New Category</DialogTitle>
          <DialogDescription>
            Add details about your Category to your portfolio
          </DialogDescription>
        </DialogHeader>
        <CategoryForm open={open} setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
};

export default AddCategory;
