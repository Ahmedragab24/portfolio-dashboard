import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "./ui/button";
import { Edit, ExternalLink, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Experience } from "@/lib/appwrite";

interface IProps {
  experiences: Experience[];
  activeTab: string;
  handleEdit: (experience: Experience) => void;
  handleDelete: (id: string) => void;
}

const CardExperience = ({
  experiences,
  activeTab,
  handleEdit,
  handleDelete,
}: IProps) => {
  return (
    <div className="grid gap-6">
      {experiences.map((experience) => (
        <Card key={experience.$id} className="overflow-hidden">
          <CardHeader
            className="pb-2"
            dir={activeTab === "arabic" ? "rtl" : "ltr"}
          >
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl flex items-center gap-2">
                  {activeTab === "english" ? (
                    <>
                      {experience.titleLink ? (
                        <a
                          href={experience.titleLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline flex items-center"
                        >
                          {experience.title}
                          <ExternalLink className="ml-1 h-4 w-4" />
                        </a>
                      ) : (
                        experience.title
                      )}
                    </>
                  ) : (
                    <div className="w-full text-right" dir="rtl">
                      {experience.arabicTitleLink ? (
                        <a
                          href={experience.arabicTitleLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline flex items-center justify-end"
                        >
                          {experience.arabicTitle}
                          <ExternalLink className="mr-1 h-4 w-4" />
                        </a>
                      ) : (
                        experience.arabicTitle
                      )}
                    </div>
                  )}
                </CardTitle>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleEdit(experience)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete this experience entry.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() =>
                          experience.$id && handleDelete(experience.$id)
                        }
                        className="bg-red-500 hover:bg-red-600"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </CardHeader>
          <CardContent dir={activeTab === "arabic" ? "rtl" : "ltr"}>
            <div>
              <p className="whitespace-pre-line">
                {activeTab === "english"
                  ? experience.description
                  : experience.arabicDescription}
              </p>
            </div>

            {experience.link && (
              <div className="mt-4">
                <a
                  href={experience.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline flex items-center w-fit"
                >
                  {activeTab === "english"
                    ? experience.titleLink
                    : experience.arabicTitleLink}
                  <ExternalLink className="ml-1 h-4 w-4" />
                </a>
              </div>
            )}

            <div className="mt-4 text-sm text-muted-foreground">
              <span>Motion: {experience.motion}</span>
              <span className="mx-2">•</span>
              <span>Duration: {experience.duration}s</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CardExperience;
