"use client";

import { Star } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface StarRatingInputProps {
	value: number;
	onChange: (rating: number) => void;
	maxRating?: number;
	size?: "sm" | "md" | "lg";
	disabled?: boolean;
	required?: boolean;
	name?: string;
}

export function StarRatingInput({
	value,
	onChange,
	maxRating = 5,
	size = "lg",
	disabled = false,
	required = false,
	name = "rating",
}: StarRatingInputProps) {
	const [hoverRating, setHoverRating] = useState(0);

	const sizeClasses = {
		sm: "w-4 h-4",
		md: "w-6 h-6",
		lg: "w-8 h-8",
	};

	const displayRating = hoverRating || value;

	return (
		<div className="flex flex-col gap-2">
			<div className="flex items-center gap-1">
				{Array.from({ length: maxRating }, (_, index) => {
					const starValue = index + 1;
					const isFilled = starValue <= displayRating;

					return (
						<button
							key={starValue}
							type="button"
							disabled={disabled}
							onClick={() => onChange(starValue)}
							onMouseEnter={() => setHoverRating(starValue)}
							onMouseLeave={() => setHoverRating(0)}
							className={cn(
								"transition-all hover:scale-110",
								disabled && "cursor-not-allowed opacity-50",
							)}
							aria-label={`Rate ${starValue} out of ${maxRating} stars`}
						>
							<Star
								className={cn(
									sizeClasses[size],
									isFilled
										? "text-yellow-400 fill-yellow-400"
										: "text-gray-300 hover:text-yellow-200",
								)}
							/>
						</button>
					);
				})}
				{value > 0 && (
					<span className="ml-2 text-sm text-muted-foreground">
						{value} out of {maxRating}
					</span>
				)}
			</div>
			{/* Hidden input for form submission */}
			<input type="hidden" name={name} value={value} required={required} />
			{required && value === 0 && <p className="text-sm text-red-600">Please select a rating</p>}
		</div>
	);
}
