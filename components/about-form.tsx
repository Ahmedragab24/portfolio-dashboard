"use client";

import type React from "react";

import { useState } from "react";
import { type About, createAbout, updateAbout } from "@/lib/appwrite";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Plus, Save, Trash } from "lucide-react";
import { useRouter } from "next/navigation";

interface AboutFormProps {
  initialData?: About;
  isEditing?: boolean;
}

export default function AboutForm({
  initialData,
  isEditing = false,
}: AboutFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<About>>(
    initialData || {
      name: "",
      arabicName: "",
      position: "",
      arabicPosition: "",
      description: "",
      arabicDescription: "",
      CV: "",
      email: "",
      socialMedia: [],
    }
  );
  const [socialMedia, setSocialMedia] = useState<
    { name: string; link: string }[]
  >(initialData?.socialMedia || []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSocialMediaChange = (
    index: number,
    field: "name" | "link",
    value: string
  ) => {
    const updatedSocialMedia = [...socialMedia];
    updatedSocialMedia[index][field] = value;
    setSocialMedia(updatedSocialMedia);
  };

  const addSocialMedia = () => {
    setSocialMedia([...socialMedia, { name: "", link: "" }]);
  };

  const removeSocialMedia = (index: number) => {
    const updatedSocialMedia = [...socialMedia];
    updatedSocialMedia.splice(index, 1);
    setSocialMedia(updatedSocialMedia);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const aboutData = {
        ...formData,
        socialMedia,
      } as About;

      if (isEditing && initialData?.$id) {
        await updateAbout(initialData.$id, aboutData);
        toast({
          title: "Success",
          description: "About information updated successfully",
        });
      } else {
        await createAbout(aboutData);
        toast({
          title: "Success",
          description: "About information created successfully",
        });
      }
      router.push("/about");
      router.refresh();
    } catch (error) {
      console.error("Error saving about data:", error);
      toast({
        title: "Error",
        description: "Failed to save about information",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isEditing ? "Edit About Information" : "Create About Information"}
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <div className="grid gap-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name || ""}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="arabicName">Arabic Name</Label>
                <Input
                  id="arabicName"
                  name="arabicName"
                  value={formData.arabicName || ""}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  name="position"
                  value={formData.position || ""}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="arabicPosition">Arabic Position</Label>
                <Input
                  id="arabicPosition"
                  name="arabicPosition"
                  value={formData.arabicPosition || ""}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description || ""}
                onChange={handleInputChange}
                rows={4}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="arabicDescription">Arabic Description</Label>
              <Textarea
                id="arabicDescription"
                name="arabicDescription"
                value={formData.arabicDescription || ""}
                onChange={handleInputChange}
                rows={4}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="CV">CV Link</Label>
                <Input
                  id="CV"
                  name="CV"
                  value={formData.CV || ""}
                  onChange={handleInputChange}
                  placeholder="https://example.com/cv.pdf"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email || ""}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Social Media</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addSocialMedia}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
              {socialMedia.map((social, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    placeholder="Platform (e.g., Twitter)"
                    value={social.name}
                    onChange={(e) =>
                      handleSocialMediaChange(index, "name", e.target.value)
                    }
                    required
                  />
                  <Input
                    placeholder="URL"
                    value={social.link}
                    onChange={(e) =>
                      handleSocialMediaChange(index, "link", e.target.value)
                    }
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeSocialMedia(index)}
                  >
                    <Trash className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
