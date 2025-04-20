import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Experience } from "@/lib/appwrite";

interface IProps {
  isAddDialogOpen: boolean;
  setIsAddDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleSubmit: React.FormEventHandler<HTMLFormElement>;
  handleInputChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  >;
  handleNumberInputChange: React.ChangeEventHandler<HTMLInputElement>;
  formData: Experience;
  setFormData: React.Dispatch<React.SetStateAction<Experience>>;
  currentExperience: Experience | null;
  setCurrentExperience: React.Dispatch<React.SetStateAction<Experience | null>>;
  emptyExperience: Experience;
}

const AddExperienceDialog = ({
  setCurrentExperience,
  formData,
  setFormData,
  isAddDialogOpen,
  setIsAddDialogOpen,
  handleSubmit,
  handleInputChange,
  handleNumberInputChange,
  emptyExperience,
}: IProps) => {
  return (
    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
      <DialogTrigger asChild>
        <Button
          className="text-[10px] md:text-sm p-2 md:px-6"
          onClick={() => {
            setCurrentExperience(null);
            setFormData(emptyExperience);
          }}
        >
          <Plus className="md:mr-2 h-2 w-2 md:h-4 md:w-4" /> Add Experience
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle>Add New Experience</DialogTitle>
          <DialogDescription>
            Add details about your experience in both English and Arabic
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="english" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="english">English</TabsTrigger>
              <TabsTrigger value="arabic">Arabic</TabsTrigger>
            </TabsList>
            <TabsContent value="english" className="space-y-4">
              <div className="grid gap-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">
                    Title
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="titleLink" className="text-right">
                    Title Link
                  </Label>
                  <Input
                    id="titleLink"
                    name="titleLink"
                    value={formData.titleLink || ""}
                    onChange={handleInputChange}
                    className="col-span-3"
                    placeholder="Optional"
                  />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="description" className="text-right pt-2">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="col-span-3"
                    rows={4}
                    required
                  />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="arabic" className="space-y-4">
              <div className="grid gap-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="arabicTitle" className="text-right">
                    Arabic Title
                  </Label>
                  <Input
                    id="arabicTitle"
                    name="arabicTitle"
                    value={formData.arabicTitle}
                    onChange={handleInputChange}
                    className="col-span-3 text-right"
                    dir="rtl"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="arabicTitleLink" className="text-right">
                    Arabic Title Link
                  </Label>
                  <Input
                    id="arabicTitleLink"
                    name="arabicTitleLink"
                    value={formData.arabicTitleLink || ""}
                    onChange={handleInputChange}
                    className="col-span-3 text-right"
                    dir="rtl"
                    placeholder="Optional"
                  />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label
                    htmlFor="arabicDescription"
                    className="text-right pt-2"
                  >
                    Arabic Description
                  </Label>
                  <Textarea
                    id="arabicDescription"
                    name="arabicDescription"
                    value={formData.arabicDescription}
                    onChange={handleInputChange}
                    className="col-span-3 text-right"
                    dir="rtl"
                    rows={4}
                    required
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="link" className="text-right">
                Link
              </Label>
              <Input
                id="link"
                name="link"
                value={formData.link || ""}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="Optional"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="motion" className="text-right">
                Motion
              </Label>
              <Input
                id="motion"
                name="motion"
                type="number"
                min="0"
                max="100"
                value={formData.motion}
                onChange={handleNumberInputChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="duration" className="text-right">
                Duration
              </Label>
              <Input
                id="duration"
                name="duration"
                type="number"
                min="0.1"
                step="0.1"
                value={formData.duration}
                onChange={handleNumberInputChange}
                className="col-span-3"
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

export default AddExperienceDialog;
