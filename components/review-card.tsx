"use client";

import { useState } from "react";
import { Star, StarHalf, Edit, Trash } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EditReviewDialog } from "./edit-review-dialog";
import { DeleteReviewDialog } from "./delete-review-dialog";
import type { Review } from "@/lib/appwrite";

interface ReviewCardProps {
  review: Review;
  onEdit?: (review: Review) => void;
  onDelete?: (id: string) => void;
}

export function ReviewCard({ review, onEdit, onDelete }: ReviewCardProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleEdit = (updatedReview: Review) => {
    if (onEdit) {
      onEdit(updatedReview);
    }
    setShowEditDialog(false);
  };

  const handleDelete = () => {
    if (onDelete && review.$id) {
      onDelete(review.$id);
    }
    setShowDeleteDialog(false);
  };

  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{review.name}</CardTitle>
            <div className="flex flex-col gap-2 items-center">
              <Avatar className="bg-primary">
                <AvatarImage src={`${review.avatar}`} />
                <AvatarFallback>User</AvatarFallback>
              </Avatar>
              <RatingStars rating={review.rating} />
            </div>
          </div>
          <CardDescription>
            {review.$createdAt
              ? new Date(review.$createdAt).toLocaleDateString()
              : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{review.review}</p>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowEditDialog(true)}
          >
            <Edit className="mr-1 h-4 w-4" />
            Edit
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash className="mr-1 h-4 w-4" />
            Delete
          </Button>
        </CardFooter>
      </Card>

      {showEditDialog && (
        <EditReviewDialog
          review={review}
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          onSave={handleEdit}
        />
      )}

      {showDeleteDialog && (
        <DeleteReviewDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          onConfirm={handleDelete}
        />
      )}
    </>
  );
}

function RatingStars({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className="flex text-yellow-500">
      {Array.from({ length: fullStars }).map((_, i) => (
        <Star key={`star-${i}`} className="h-4 w-4 fill-current" />
      ))}
      {hasHalfStar && <StarHalf className="h-4 w-4 fill-current" />}
    </div>
  );
}
