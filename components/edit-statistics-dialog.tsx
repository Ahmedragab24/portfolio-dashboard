import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Statistics } from "@/lib/appwrite";

interface IProps {
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleSubmit: React.FormEventHandler<HTMLFormElement>;
  handleInputChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  >;
  handleNumberInputChange: React.ChangeEventHandler<HTMLInputElement>;
  formData: Statistics;
}

const EditStatisticsDialog = ({
  isEditDialogOpen,
  setIsEditDialogOpen,
  handleSubmit,
  handleInputChange,
  handleNumberInputChange,
  formData,
}: IProps) => {
  return (
    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle>Edit Statistics</DialogTitle>
          <DialogDescription>Update your statistics details</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                English Title
              </Label>
              <Input
                id="title"
                name="title"
                type="text"
                value={formData.title || ""}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="English Title"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="arTitle" className="text-right">
                Arabic Title
              </Label>
              <Input
                id="arTitle"
                name="arTitle"
                type="text"
                value={formData.arTitle || ""}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="Arabic Title"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="number" className="text-right">
                Count
              </Label>
              <Input
                id="number"
                name="number"
                type="number"
                min="0"
                max="1000"
                value={formData.number || 0}
                onChange={handleNumberInputChange}
                className="col-span-3"
                placeholder="Count"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Update</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditStatisticsDialog;
