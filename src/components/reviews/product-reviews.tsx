import { headers } from "next/headers";
import Link from "next/link";
import { checkCanReview, getProductReviews } from "@/actions/reviews";
import { Button } from "@/components/ui/button";
import { type AuthSession, auth } from "@/lib/auth";
import { ReviewForm } from "./review-form";
import { ReviewList } from "./review-list";
import { StarRating } from "./star-rating";

interface ProductReviewsProps {
	productId: string;
	productName: string;
}

export async function ProductReviews({ productId, productName }: ProductReviewsProps) {
	const session = (await auth.api.getSession({
		headers: await headers(),
	})) as AuthSession | null;

	// Fetch reviews
	const reviewsData = await getProductReviews(productId);

	// Check if user can review
	let canReview = false;
	let canReviewReason = "";

	if (session?.user) {
		const eligibility = await checkCanReview(productId);
		canReview = eligibility.canReview;
		if (!eligibility.canReview) {
			const messages = {
				not_purchased: "You must purchase this product before you can review it",
				already_reviewed: "You have already reviewed this product",
				error: "",
			};
			canReviewReason = messages[eligibility.reason as keyof typeof messages] || "";
		}
	}

	if (!reviewsData.success) {
		return (
			<div className="mt-12">
				<h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
				<p className="text-muted-foreground">Failed to load reviews. Please try again later.</p>
			</div>
		);
	}

	return (
		<div className="mt-12">
			<div className="flex items-center justify-between mb-6">
				<h2 className="text-2xl font-bold">Customer Reviews</h2>
				{reviewsData.totalReviews > 0 && (
					<div className="flex items-center gap-2">
						<StarRating rating={reviewsData.averageRating} size="md" showValue />
						<span className="text-sm text-muted-foreground">
							({reviewsData.totalReviews} {reviewsData.totalReviews === 1 ? "review" : "reviews"})
						</span>
					</div>
				)}
			</div>

			<div className="grid lg:grid-cols-3 gap-8">
				{/* Review List */}
				<div className="lg:col-span-2">
					<ReviewList
						reviews={reviewsData.reviews}
						totalReviews={reviewsData.totalReviews}
						averageRating={reviewsData.averageRating}
						ratingCounts={reviewsData.ratingCounts}
					/>
				</div>

				{/* Review Form Sidebar */}
				<div>
					{!session?.user ? (
						<div className="bg-muted p-6 rounded-lg text-center">
							<p className="mb-4">Please log in to write a review</p>
							<Button asChild>
								<Link href="/login">Log In</Link>
							</Button>
						</div>
					) : canReview ? (
						<ReviewForm productId={productId} productName={productName} />
					) : (
						<div className="bg-muted p-6 rounded-lg text-center">
							<p className="text-sm text-muted-foreground">{canReviewReason}</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
