"use client";

import type React from "react";

import { useState } from "react";
import { Star } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Review } from "@/lib/appwrite";

interface EditReviewDialogProps {
  review: Review;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (review: Review) => void;
}

export function EditReviewDialog({
  review,
  open,
  onOpenChange,
  onSave,
}: EditReviewDialogProps) {
  const [name, setName] = useState(review.name);
  const [reviewText, setReviewText] = useState(review.review);
  const [rating, setRating] = useState(review.rating);
  const [avatar, setAvatar] = useState(review.avatar || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !reviewText || rating < 1) {
      return;
    }

    setIsSubmitting(true);

    try {
      const updatedReview: Review = {
        ...review,
        name,
        review: reviewText,
        rating,
        avatar,
      };

      onSave(updatedReview);
    } catch (error) {
      console.error("Error updating review:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Review</DialogTitle>
          <DialogDescription>
            Make changes to the review here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-avatar">Avatar URL</Label>
              <Input
                id="edit-avatar"
                type="url"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label>Rating</Label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="focus:outline-none"
                    onClick={() => setRating(star)}
                  >
                    <Star
                      className={`h-6 w-6 ${
                        rating >= star
                          ? "text-yellow-500 fill-yellow-500"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-review">Review</Label>
              <Textarea
                id="edit-review"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                required
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
