"use client";

import type React from "react";

import { useState, useEffect } from "react";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  createExperience,
  deleteExperience,
  Experience,
  getExperiences,
  updateExperience,
} from "@/lib/appwrite";
import EditExperienceDialog from "@/components/edit-experience-dialog";
import CardExperience from "@/components/card-experience";
import AddExperienceDialog from "@/components/add-experieance-dialog";
import { BookOpenCheck } from "lucide-react";

export default function ExperiencePage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentExperience, setCurrentExperience] = useState<Experience | null>(
    null
  );
  const [activeTab, setActiveTab] = useState("english");

  const emptyExperience: Experience = {
    title: "",
    arabicTitle: "",
    description: "",
    arabicDescription: "",
    link: "",
    titleLink: "",
    arabicTitleLink: "",
    motion: 0,
    duration: 1,
  };

  const [formData, setFormData] = useState<Experience>(emptyExperience);

  // Fetch experiences on component mount
  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    setLoading(true);
    try {
      const data = await getExperiences();
      setExperiences(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch experiences");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: Number(value) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (currentExperience && currentExperience.$id) {
        // Update existing experience
        await updateExperience(currentExperience.$id, formData as Experience);
      } else {
        // Create new experience
        await createExperience(formData);
      }

      // Reset form and refresh data
      setFormData(emptyExperience);
      setIsAddDialogOpen(false);
      setIsEditDialogOpen(false);
      fetchExperiences();
    } catch (err) {
      setError("Failed to save experience");
      console.error(err);
    }
  };

  const handleEdit = (experience: Experience) => {
    setCurrentExperience(experience);
    setFormData(experience);
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteExperience(id);
      fetchExperiences();
    } catch (err) {
      setError("Failed to delete experience");
      console.error(err);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center p-8">Loading experiences...</div>
    );

  return (
    <div>
      <div className="flex justify-between gap-2 items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Experiences</h1>
        <AddExperienceDialog
          currentExperience={currentExperience}
          emptyExperience={emptyExperience}
          formData={formData}
          handleInputChange={handleInputChange}
          handleNumberInputChange={handleNumberInputChange}
          handleSubmit={handleSubmit}
          isAddDialogOpen={isAddDialogOpen}
          setIsAddDialogOpen={setIsAddDialogOpen}
          setCurrentExperience={setCurrentExperience}
          setFormData={setFormData}
        />
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
          <TabsTrigger value="english">English</TabsTrigger>
          <TabsTrigger value="arabic">Arabic</TabsTrigger>
        </TabsList>
      </Tabs>

      {experiences.length === 0 ? (
        <div className="text-center py-12">
          <BookOpenCheck className="mx-auto h-20 w-20 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium">No experiences added yet</h3>
          <p className="mt-1 text-gray-500">
            Get started by adding your experiences.
          </p>
        </div>
      ) : (
        <CardExperience
          experiences={experiences}
          activeTab={activeTab}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
      )}

      {/* Edit Experience Dialog */}
      <EditExperienceDialog
        isEditDialogOpen={isEditDialogOpen}
        setIsEditDialogOpen={setIsEditDialogOpen}
        handleSubmit={handleSubmit}
        handleInputChange={handleInputChange}
        handleNumberInputChange={handleNumberInputChange}
        formData={formData}
      />
    </div>
  );
}
