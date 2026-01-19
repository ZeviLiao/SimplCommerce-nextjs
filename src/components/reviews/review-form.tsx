"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createReview } from "@/actions/reviews";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { StarRatingInput } from "./star-rating-input";

interface ReviewFormProps {
	productId: string;
	productName: string;
}

export function ReviewForm({ productId, productName }: ReviewFormProps) {
	const router = useRouter();
	const { toast } = useToast();
	const [rating, setRating] = useState(0);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (rating === 0) {
			toast({
				title: "Rating required",
				description: "Please select a star rating before submitting",
				variant: "destructive",
			});
			return;
		}

		setIsSubmitting(true);

		try {
			const formData = new FormData(e.currentTarget);
			formData.set("productId", productId);
			formData.set("rating", rating.toString());

			const result = await createReview(formData);

			if (result.success) {
				toast({
					title: "Review submitted",
					description: result.message,
				});
				router.refresh();
				// Reset form
				setRating(0);
				e.currentTarget.reset();
			} else {
				toast({
					title: "Error",
					description: result.error || "Failed to submit review",
					variant: "destructive",
				});
			}
		} catch (_error) {
			toast({
				title: "Error",
				description: "An unexpected error occurred",
				variant: "destructive",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Write a Review</CardTitle>
				<CardDescription>Share your experience with {productName}</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className="space-y-4">
					{/* Rating */}
					<div className="space-y-2">
						<Label htmlFor="rating">
							Rating <span className="text-red-600">*</span>
						</Label>
						<StarRatingInput value={rating} onChange={setRating} required name="rating" />
					</div>

					{/* Title (Optional) */}
					<div className="space-y-2">
						<Label htmlFor="title">Review Title (Optional)</Label>
						<Input
							id="title"
							name="title"
							placeholder="Summarize your experience"
							disabled={isSubmitting}
							maxLength={200}
						/>
					</div>

					{/* Comment */}
					<div className="space-y-2">
						<Label htmlFor="comment">
							Your Review <span className="text-red-600">*</span>
						</Label>
						<Textarea
							id="comment"
							name="comment"
							placeholder="Tell us what you think about this product..."
							required
							disabled={isSubmitting}
							rows={5}
							maxLength={1000}
						/>
					</div>

					{/* Submit Button */}
					<Button type="submit" disabled={isSubmitting || rating === 0}>
						{isSubmitting ? "Submitting..." : "Submit Review"}
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}
