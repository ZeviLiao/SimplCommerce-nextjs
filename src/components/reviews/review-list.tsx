import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { StarRating } from "./star-rating";

interface Review {
	id: string;
	rating: number;
	title: string | null;
	comment: string | null;
	reviewerName?: string;
	createdAt: Date;
	replies?: Reply[];
}

interface Reply {
	id: string;
	comment: string;
	replierName?: string;
	createdAt: Date;
	user: {
		name: string;
		role: string;
	};
}

interface ReviewListProps {
	reviews: Review[];
	totalReviews: number;
	averageRating: number;
	ratingCounts: Record<number, number>;
}

export function ReviewList({
	reviews,
	totalReviews,
	averageRating,
	ratingCounts,
}: ReviewListProps) {
	if (totalReviews === 0) {
		return (
			<div className="text-center py-12">
				<p className="text-muted-foreground">
					No reviews yet. Be the first to review this product!
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Rating Summary */}
			<Card>
				<CardContent className="pt-6">
					<div className="grid md:grid-cols-2 gap-6">
						{/* Average Rating */}
						<div className="flex flex-col items-center justify-center">
							<div className="text-5xl font-bold mb-2">{averageRating}</div>
							<StarRating rating={averageRating} size="lg" />
							<p className="text-sm text-muted-foreground mt-2">
								Based on {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
							</p>
						</div>

						{/* Rating Breakdown */}
						<div className="space-y-2">
							{[5, 4, 3, 2, 1].map((star) => {
								const count = ratingCounts[star] || 0;
								const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;

								return (
									<div key={star} className="flex items-center gap-2">
										<span className="text-sm w-8">{star} ★</span>
										<div className="flex-1 bg-gray-200 rounded-full h-2">
											<div
												className="bg-yellow-400 h-2 rounded-full transition-all"
												style={{ width: `${percentage}%` }}
											/>
										</div>
										<span className="text-sm text-muted-foreground w-12 text-right">{count}</span>
									</div>
								);
							})}
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Individual Reviews */}
			<div className="space-y-4">
				<h3 className="text-lg font-semibold">Customer Reviews</h3>
				{reviews.map((review) => (
					<Card key={review.id}>
						<CardContent className="pt-6">
							<div className="space-y-4">
								{/* Review Header */}
								<div className="flex items-start justify-between">
									<div>
										<div className="flex items-center gap-2 mb-1">
											<StarRating rating={review.rating} size="sm" />
											{review.title && <h4 className="font-semibold">{review.title}</h4>}
										</div>
										<p className="text-sm text-muted-foreground">
											{review.reviewerName} • {format(new Date(review.createdAt), "PPP")}
										</p>
									</div>
								</div>

								{/* Review Comment */}
								<p className="text-sm leading-relaxed">{review.comment}</p>

								{/* Replies */}
								{review.replies && review.replies.length > 0 && (
									<>
										<Separator />
										<div className="pl-4 space-y-4">
											{review.replies.map((reply) => (
												<div key={reply.id} className="space-y-2">
													<div className="flex items-center gap-2">
														<p className="text-sm font-medium">
															{reply.replierName || reply.user.name}
														</p>
														{(reply.user.role === "admin" || reply.user.role === "vendor") && (
															<Badge variant="secondary" className="text-xs">
																{reply.user.role}
															</Badge>
														)}
														<span className="text-xs text-muted-foreground">
															{format(new Date(reply.createdAt), "PPP")}
														</span>
													</div>
													<p className="text-sm text-muted-foreground">{reply.comment}</p>
												</div>
											))}
										</div>
									</>
								)}
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
}
