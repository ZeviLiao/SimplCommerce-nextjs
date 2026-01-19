import { toast as sonnerToast } from "sonner";

export interface ToastOptions {
	title?: string;
	description?: string;
	variant?: "default" | "destructive";
	duration?: number;
}

export function useToast() {
	const toast = ({ title, description, variant, duration }: ToastOptions) => {
		const message = description || title || "";
		const options = {
			duration: duration || 4000,
		};

		if (variant === "destructive") {
			sonnerToast.error(title || "Error", {
				description,
				...options,
			});
		} else {
			sonnerToast(title || message, {
				description: description && title ? description : undefined,
				...options,
			});
		}
	};

	return { toast };
}
