import { ReviewsSection } from "@/components/reviews-section";

export const metadata = {
  title: "Manage Reviews | Admin Dashboard",
  description: "Approve or delete user reviews",
};

export default function AdminReviewsPage() {
  return (
    <div>
      <ReviewsSection />
    </div>
  );
}
