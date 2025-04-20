"use client";

import type React from "react";

import { useState, useEffect } from "react";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  createStatistics,
  deleteStatistics,
  Statistics,
  getStatistics,
  updateStatistics,
} from "@/lib/appwrite";
import { BookOpenCheck } from "lucide-react";
import AddStatisticsDialog from "./add-statistics-dialog";
import CardStatistics from "./card-statistics";
import EditStatisticsDialog from "./edit-statistics-dialog";

export default function StatisticsPage() {
  const [Statistics, setStatistics] = useState<Statistics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentStatistics, setCurrentStatistics] = useState<Statistics | null>(
    null
  );

  const emptyStatistics: Statistics = {
    title: "",
    arTitle: "",
    number: 0,
  };

  const [formData, setFormData] = useState<Statistics>(emptyStatistics);

  // Fetch Statistics on component mount
  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    setLoading(true);
    try {
      const data = await getStatistics();
      setStatistics(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch sStatistics");
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
      if (currentStatistics && currentStatistics.$id) {
        // Update existing sStatistics
        await updateStatistics(currentStatistics.$id, formData as Statistics);
      } else {
        // Create new sStatistics
        await createStatistics(formData);
      }

      // Reset form and refresh data
      setFormData(emptyStatistics);
      setIsAddDialogOpen(false);
      setIsEditDialogOpen(false);
      fetchStatistics();
    } catch (err) {
      setError("Failed to save sStatistics");
      console.error(err);
    }
  };

  const handleEdit = (sStatistics: Statistics) => {
    setCurrentStatistics(sStatistics);
    setFormData(sStatistics);
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteStatistics(id);
      fetchStatistics();
    } catch (err) {
      setError("Failed to delete sStatistics");
      console.error(err);
    }
  };

  if (loading)
    return <div className="flex justify-center p-8">Loading Statistics...</div>;

  return (
    <div>
      <div className="flex justify-between gap-2 items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Statistics</h1>
        <AddStatisticsDialog
          currentStatistics={currentStatistics}
          emptyStatistics={emptyStatistics}
          formData={formData}
          handleInputChange={handleInputChange}
          handleNumberInputChange={handleNumberInputChange}
          handleSubmit={handleSubmit}
          isAddDialogOpen={isAddDialogOpen}
          setIsAddDialogOpen={setIsAddDialogOpen}
          setCurrentStatistics={setCurrentStatistics}
          setFormData={setFormData}
        />
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {Statistics.length === 0 ? (
        <div className="text-center py-12 flex flex-col justify-center h-[70vh]">
          <BookOpenCheck className="mx-auto h-20 w-20 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium">No Statistics added yet</h3>
          <p className="mt-1 text-gray-500">
            Get started by adding your Statistics.
          </p>
        </div>
      ) : (
        <CardStatistics
          statistics={Statistics}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
      )}

      {/* Edit Statistics Dialog */}
      <EditStatisticsDialog
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
