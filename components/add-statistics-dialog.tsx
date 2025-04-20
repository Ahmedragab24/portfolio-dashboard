import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Statistics } from "@/lib/appwrite";

interface IProps {
  currentStatistics: Statistics | null;
  emptyStatistics: Statistics;
  formData: Statistics;
  handleInputChange: React.ChangeEventHandler<HTMLInputElement>;
  handleNumberInputChange: React.ChangeEventHandler<HTMLInputElement>;
  handleSubmit: React.FormEventHandler<HTMLFormElement>;
  isAddDialogOpen: boolean;
  setIsAddDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentStatistics: React.Dispatch<React.SetStateAction<Statistics | null>>;
  setFormData: React.Dispatch<React.SetStateAction<Statistics>>;
}

const AddStatisticsDialog = ({
  emptyStatistics,
  formData,
  handleInputChange,
  handleNumberInputChange,
  setCurrentStatistics,
  handleSubmit,
  isAddDialogOpen,
  setIsAddDialogOpen,
  setFormData,
}: IProps) => {
  return (
    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
      <DialogTrigger asChild>
        <Button
          className="text-[10px] md:text-sm p-2 md:px-6"
          onClick={() => {
            setCurrentStatistics(null);
            setFormData(emptyStatistics);
          }}
        >
          <Plus className="md:mr-2 h-2 w-2 md:h-4 md:w-4" /> Add Experience
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="mb-8">
          <DialogTitle>Add New Statistic</DialogTitle>
          <DialogDescription>
            Add details about your Statistic to your portfolio
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid items-center gap-6 mb-4">
            <div className="flex flex-col gap-2 items-start">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="English Title"
                required
              />
            </div>
            <div className="flex flex-col gap-2 items-start">
              <Label htmlFor="arTitle" className="text-right">
                Arabic Title
              </Label>
              <Input
                id="arTitle"
                name="arTitle"
                value={formData.arTitle}
                onChange={handleInputChange}
                placeholder="Arabic Title"
                required
              />
            </div>
            <div className="flex flex-col gap-2 items-start">
              <Label htmlFor="number" className="text-right">
                Count
              </Label>
              <Input
                id="number"
                name="number"
                type="number"
                value={formData.number}
                onChange={handleNumberInputChange}
                placeholder="0"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddStatisticsDialog;
