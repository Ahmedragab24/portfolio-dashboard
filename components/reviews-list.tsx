"use client";

import { useEffect, useState } from "react";
import {
  getReviews,
  updateReview,
  deleteReview,
  type Review,
} from "@/lib/appwrite";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { ReviewCard } from "./review-card";

interface ReviewsListProps {
  refreshTrigger?: number;
}

export function ReviewsList({ refreshTrigger = 0 }: ReviewsListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const reviewsData = await getReviews();
      setReviews(reviewsData);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast({
        title: "Error",
        description: "Failed to load reviews",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [refreshTrigger]); // Re-fetch when refreshTrigger changes

  const handleEdit = async (updatedReview: Review) => {
    if (!updatedReview.$id) return;

    try {
      await updateReview(updatedReview.$id, updatedReview);
      toast({
        title: "Success",
        description: "Review updated successfully",
      });
      fetchReviews(); // Refresh the list
    } catch (error) {
      console.error("Error updating review:", error);
      toast({
        title: "Error",
        description: "Failed to update review",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteReview(id);
      toast({
        title: "Success",
        description: "Review deleted successfully",
      });
      fetchReviews(); // Refresh the list
    } catch (error) {
      console.error("Error deleting review:", error);
      toast({
        title: "Error",
        description: "Failed to delete review",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-[125px] w-full rounded-lg" />
        <Skeleton className="h-[125px] w-full rounded-lg" />
        <Skeleton className="h-[125px] w-full rounded-lg" />
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            No reviews yet. Be the first to leave a review!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.reverse().map((review) => (
        <ReviewCard
          key={review.$id}
          review={review}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}
