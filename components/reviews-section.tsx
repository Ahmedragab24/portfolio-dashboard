"use client";

import { useState, useCallback } from "react";
import { ReviewForm } from "./reviews-form";
import { ReviewsList } from "./reviews-list";

export function ReviewsSection() {
  // Add a state to trigger refreshes
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Create a callback function to refresh the reviews list
  const handleReviewAdded = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  return (
    <section className="py-12">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Client Reviews
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              See what others are saying about my work
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl gap-8 py-8 lg:grid-cols-2">
          <div>
            <h3 className="mb-4 text-xl font-bold">Add Your Review</h3>
            <ReviewForm onReviewAdded={handleReviewAdded} />
          </div>
          <div>
            <h3 className="mb-4 text-xl font-bold">Recent Reviews</h3>
            <ReviewsList refreshTrigger={refreshTrigger} />
          </div>
        </div>
      </div>
    </section>
  );
}
