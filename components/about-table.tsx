"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { type About, getAbout, updateAbout } from "@/lib/appwrite";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import {
  Pencil,
  Save,
  Plus,
  Trash,
  LinkIcon,
  Facebook,
  Github,
  Linkedin,
  MessageCircleMore,
  Instagram,
  Send,
  Twitter,
  Eye,
} from "lucide-react";
import Link from "next/link";

// Map social media names to their corresponding icons
const getSocialIcon = (name: string) => {
  const normalizedName = name.toLowerCase().trim();

  if (normalizedName.includes("facebook")) return Facebook;
  if (normalizedName.includes("github")) return Github;
  if (normalizedName.includes("linkedin")) return Linkedin;
  if (normalizedName.includes("instagram")) return Instagram;
  if (normalizedName.includes("whatsapp")) return MessageCircleMore;
  if (normalizedName.includes("telegram")) return Send;
  if (normalizedName.includes("twitter")) return Twitter;
  return MessageCircleMore;

  // Default icon if no match is found
  return LinkIcon;
};

export default function AboutTable() {
  const [about, setAbout] = useState<About | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<Partial<About>>({});
  const [socialMedia, setSocialMedia] = useState<
    { name: string; link: string; icon: string }[]
  >([]);

  useEffect(() => {
    async function fetchAbout() {
      try {
        const aboutData = await getAbout();
        setAbout(aboutData);
        setFormData(aboutData);
        setSocialMedia(aboutData.socialMedia || []);
      } catch (error) {
        console.error("Error fetching about data:", error);
        toast({
          title: "Error",
          description: "Failed to load about information",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchAbout();
  }, []);

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

    // If the name field is being updated, automatically set the icon
    if (field === "name") {
      updatedSocialMedia[index].icon = ""; // We'll use the getSocialIcon function instead
    }

    setSocialMedia(updatedSocialMedia);
  };

  const addSocialMedia = () => {
    setSocialMedia([...socialMedia, { name: "", link: "", icon: "" }]);
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
      const updatedAbout = await updateAbout(about?.$id || "", {
        ...formData,
        socialMedia,
      });
      setAbout(updatedAbout);
      setIsEditing(false);
      toast({
        title: "Success",
        description: "About information updated successfully",
      });
    } catch (error) {
      console.error("Error updating about data:", error);
      toast({
        title: "Error",
        description: "Failed to update about information",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !about) {
    return <div className="text-center py-8">Loading about information...</div>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>About Information</CardTitle>
          <CardDescription>
            Manage your personal information and social media links
          </CardDescription>
        </div>
        <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? "Cancel" : <Pencil className="h-4 w-4 mr-2" />}
          {isEditing ? "Cancel" : "Edit"}
        </Button>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <form onSubmit={handleSubmit}>
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
            <CardFooter className="flex justify-end pt-6 px-0">
              <Button type="submit" disabled={isLoading}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </CardFooter>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Name
                </h3>
                <p className="text-base">{about?.name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Arabic Name
                </h3>
                <p className="text-base">{about?.arabicName}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Position
                </h3>
                <p className="text-base">{about?.position}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Arabic Position
                </h3>
                <p className="text-base">{about?.arabicPosition}</p>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Description
              </h3>
              <p className="text-base whitespace-pre-line">
                {about?.description}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Arabic Description
              </h3>
              <p className="text-base whitespace-pre-line">
                {about?.arabicDescription}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  CV
                </h3>
                {about?.CV ? (
                  <Link
                    href={about.CV}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary flex items-center gap-1"
                  >
                    <Eye className="h-4 w-4" />
                    View CV
                  </Link>
                ) : (
                  <p className="text-muted-foreground">No CV available</p>
                )}
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Email
                </h3>
                <a href={`mailto:${about?.email}`} className="text-primary">
                  {about?.email}
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Social Media
              </h3>
              <div className="flex flex-wrap gap-3 mt-2">
                {about?.socialMedia && about.socialMedia.length > 0 ? (
                  about.socialMedia.map((social, index) => {
                    const Icon = getSocialIcon(social.name);
                    return (
                      <a
                        key={index}
                        href={social.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-primary"
                      >
                        <Icon className="h-4 w-4 mr-1" />
                        {social.name}
                      </a>
                    );
                  })
                ) : (
                  <p className="text-muted-foreground">
                    No social media links available
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
