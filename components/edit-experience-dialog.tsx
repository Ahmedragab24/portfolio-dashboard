import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Experience } from "@/types";

interface IProps {
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleSubmit: React.FormEventHandler<HTMLFormElement>;
  handleInputChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  >;
  handleNumberInputChange: React.ChangeEventHandler<HTMLInputElement>;
  formData: Experience;
}

const EditExperienceDialog = ({
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
          <DialogTitle>Edit Experience</DialogTitle>
          <DialogDescription>Update your experience details</DialogDescription>
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
                  <Label htmlFor="edit-title" className="text-right">
                    Title
                  </Label>
                  <Input
                    id="edit-title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-titleLink" className="text-right">
                    Title Link
                  </Label>
                  <Input
                    id="edit-titleLink"
                    name="titleLink"
                    value={formData.titleLink || ""}
                    onChange={handleInputChange}
                    className="col-span-3"
                    placeholder="Optional"
                  />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="edit-description" className="text-right pt-2">
                    Description
                  </Label>
                  <Textarea
                    id="edit-description"
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
                  <Label htmlFor="edit-arabicTitle" className="text-right">
                    Arabic Title
                  </Label>
                  <Input
                    id="edit-arabicTitle"
                    name="arabicTitle"
                    value={formData.arabicTitle}
                    onChange={handleInputChange}
                    className="col-span-3 text-right"
                    dir="rtl"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-arabicTitleLink" className="text-right">
                    Arabic Title Link
                  </Label>
                  <Input
                    id="edit-arabicTitleLink"
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
                    htmlFor="edit-arabicDescription"
                    className="text-right pt-2"
                  >
                    Arabic Description
                  </Label>
                  <Textarea
                    id="edit-arabicDescription"
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
              <Label htmlFor="edit-link" className="text-right">
                Link
              </Label>
              <Input
                id="edit-link"
                name="link"
                value={formData.link || ""}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="Optional"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-motion" className="text-right">
                Motion
              </Label>
              <Input
                id="edit-motion"
                name="motion"
                type="number"
                min="-100"
                max="100"
                value={formData.motion}
                onChange={handleNumberInputChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-duration" className="text-right">
                Duration
              </Label>
              <Input
                id="edit-duration"
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
            <Button type="submit">Update</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditExperienceDialog;
