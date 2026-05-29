"use client";

import { useState } from "react";
import { Star, MessageSquare, AlertCircle, Sparkles } from "lucide-react";

import { ReviewWithUser } from "@/types";
import { User } from "next-auth";

interface ReviewListProps {
  platformId: string;
  initialReviews: ReviewWithUser[];
  isLoggedIn: boolean;
  currentUser: User | null;
}

export default function ReviewList({
  platformId,
  initialReviews,
  isLoggedIn,
  currentUser,
}: ReviewListProps) {
  const [reviews, setReviews] = useState<ReviewWithUser[]>(initialReviews);
  const [rating, setRating] = useState(5);
  const [body, setBody] = useState("");
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (body.length < 10) {
      setError("Review body must be at least 10 characters long.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platformId,
          rating,
          body,
          role,
          company,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to submit review");
      }

      // Add newly created review to the list
      const newReview = {
        ...data.review,
        user: {
          name: currentUser?.name || "Me",
        },
      };

      setReviews([newReview, ...reviews]);
      setBody("");
      setRole("");
      setCompany("");
      setRating(5);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message || "Failed to post review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Review list */}
      <div className="lg:col-span-2 space-y-4">
        <h3 className="text-lg font-bold text-foreground flex items-center space-x-2">
          <MessageSquare size={18} className="text-primary" />
          <span>User Reviews ({reviews.length})</span>
        </h3>

        {reviews.length === 0 ? (
          <div className="p-8 border border-dashed border-border rounded-xl bg-card text-center text-muted-foreground text-sm">
            No reviews have been written for this platform yet. Be the first to share your experience!
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-3"
              >
                {/* Author row */}
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-sm text-foreground">
                      {review.user?.name || "Anonymous"}
                    </h4>
                    {(review.role || review.company) && (
                      <span className="text-xs text-muted-foreground">
                        {review.role} {review.role && review.company && "at"} {review.company}
                      </span>
                    )}
                  </div>

                  {/* Stars */}
                  <div className="flex items-center text-amber-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={i < review.rating ? "fill-amber-500" : "text-border"}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                  {review.body}
                </p>
                <div className="text-[10px] text-muted-foreground/60">
                  Reviewed on {new Date(review.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review form */}
      <div>
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4 sticky top-24">
          <h3 className="text-base font-bold text-foreground flex items-center space-x-1.5">
            <Sparkles size={16} className="text-primary" />
            <span>Write a Review</span>
          </h3>

          {isLoggedIn ? (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {error && (
                <div className="p-3 bg-destructive/10 text-destructive text-xs rounded-lg flex items-start space-x-1.5">
                  <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Star Rating Select */}
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
                  Satisfaction Score
                </label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="text-amber-500 hover:scale-110 transition-transform"
                    >
                      <Star
                        size={22}
                        className={star <= rating ? "fill-amber-500" : "text-border"}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Role */}
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                  Your Role
                </label>
                <input
                  type="text"
                  placeholder="e.g. Lead Engineer, Product Director"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-1.5 border border-border bg-background rounded-lg text-xs text-foreground focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* Company */}
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. ScaleCorp"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full px-3 py-1.5 border border-border bg-background rounded-lg text-xs text-foreground focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* Body */}
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                  Your Review
                </label>
                <textarea
                  rows={4}
                  placeholder="Describe what workflows you like, general criticisms, and performance tips..."
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="w-full px-3 py-2 border border-border bg-background rounded-lg text-xs text-foreground focus:ring-1 focus:ring-primary"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-bold rounded-lg shadow-sm transition-all uppercase tracking-wider"
              >
                {loading ? "Posting..." : "Submit Review"}
              </button>
            </form>
          ) : (
            <div className="p-4 border border-border rounded-lg bg-secondary/15 text-center text-xs text-muted-foreground leading-relaxed">
              Please log in to share your platform experience with the community.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
