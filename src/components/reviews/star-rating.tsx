import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
	rating: number;
	maxRating?: number;
	size?: "sm" | "md" | "lg";
	showValue?: boolean;
	className?: string;
}

export function StarRating({
	rating,
	maxRating = 5,
	size = "md",
	showValue = false,
	className,
}: StarRatingProps) {
	const sizeClasses = {
		sm: "w-3 h-3",
		md: "w-4 h-4",
		lg: "w-5 h-5",
	};

	const stars = Array.from({ length: maxRating }, (_, index) => {
		const starValue = index + 1;
		const isFilled = starValue <= Math.floor(rating);
		const isPartial = starValue > Math.floor(rating) && starValue <= Math.ceil(rating);
		const fillPercentage = isPartial ? (rating % 1) * 100 : 0;

		return (
			<div key={starValue} className="relative">
				{isPartial ? (
					<>
						{/* Background empty star */}
						<Star className={cn(sizeClasses[size], "text-gray-300")} />
						{/* Partially filled star */}
						<div
							className="absolute inset-0 overflow-hidden"
							style={{ width: `${fillPercentage}%` }}
						>
							<Star className={cn(sizeClasses[size], "text-yellow-400 fill-yellow-400")} />
						</div>
					</>
				) : (
					<Star
						className={cn(
							sizeClasses[size],
							isFilled ? "text-yellow-400 fill-yellow-400" : "text-gray-300",
						)}
					/>
				)}
			</div>
		);
	});

	return (
		<div className={cn("flex items-center gap-0.5", className)}>
			{stars}
			{showValue && <span className="ml-1 text-sm text-muted-foreground">{rating.toFixed(1)}</span>}
		</div>
	);
}
