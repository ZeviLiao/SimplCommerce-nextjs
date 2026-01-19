"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { createShippingProvider, updateShippingProvider } from "@/actions/admin/shipping-providers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

interface ShippingProviderFormProps {
	provider?: {
		id: string;
		name: string;
		code: string;
		description: string | null;
		isEnabled: boolean;
		displayOrder: number;
		configData: any;
	};
}

export function ShippingProviderForm({ provider }: ShippingProviderFormProps) {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	const [formData, setFormData] = useState({
		name: provider?.name || "",
		code: provider?.code || "",
		description: provider?.description || "",
		isEnabled: provider?.isEnabled ?? true,
		displayOrder: provider?.displayOrder || 0,
		basePrice: "",
		pricePerKg: "",
		freeShippingThreshold: "",
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!formData.name.trim()) {
			toast.error("Name is required");
			return;
		}

		if (!formData.code.trim()) {
			toast.error("Code is required");
			return;
		}

		setIsLoading(true);

		try {
			const configData: Record<string, any> = {};
			if (formData.basePrice) configData.basePrice = Number(formData.basePrice);
			if (formData.pricePerKg) configData.pricePerKg = Number(formData.pricePerKg);
			if (formData.freeShippingThreshold)
				configData.freeShippingThreshold = Number(formData.freeShippingThreshold);

			if (provider) {
				await updateShippingProvider(provider.id, {
					name: formData.name,
					code: formData.code,
					description: formData.description || undefined,
					isEnabled: formData.isEnabled,
					displayOrder: formData.displayOrder,
					configData: Object.keys(configData).length > 0 ? configData : undefined,
				});
				toast.success("Shipping provider updated successfully");
			} else {
				await createShippingProvider({
					name: formData.name,
					code: formData.code,
					description: formData.description || undefined,
					isEnabled: formData.isEnabled,
					displayOrder: formData.displayOrder,
					configData: Object.keys(configData).length > 0 ? configData : undefined,
				});
				toast.success("Shipping provider created successfully");
			}

			router.push("/admin/shipping-providers");
			router.refresh();
		} catch (error) {
			console.error("Failed to save shipping provider:", error);
			toast.error("Failed to save shipping provider");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			<div className="grid gap-4">
				<div className="grid gap-2">
					<Label htmlFor="name">
						Name <span className="text-destructive">*</span>
					</Label>
					<Input
						id="name"
						value={formData.name}
						onChange={(e) => setFormData({ ...formData, name: e.target.value })}
						placeholder="Standard Shipping"
						required
					/>
				</div>

				<div className="grid gap-2">
					<Label htmlFor="code">
						Code <span className="text-destructive">*</span>
					</Label>
					<Input
						id="code"
						value={formData.code}
						onChange={(e) => setFormData({ ...formData, code: e.target.value })}
						placeholder="standard_shipping"
						required
						disabled={!!provider}
					/>
					<p className="text-xs text-muted-foreground">
						Unique identifier for this provider (cannot be changed after creation)
					</p>
				</div>

				<div className="grid gap-2">
					<Label htmlFor="description">Description</Label>
					<Textarea
						id="description"
						value={formData.description}
						onChange={(e) => setFormData({ ...formData, description: e.target.value })}
						placeholder="Describe this shipping method..."
						rows={3}
					/>
				</div>

				<div className="grid gap-4 md:grid-cols-3">
					<div className="grid gap-2">
						<Label htmlFor="basePrice">Base Price ($)</Label>
						<Input
							id="basePrice"
							type="number"
							step="0.01"
							min="0"
							value={formData.basePrice}
							onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
							placeholder="0.00"
						/>
					</div>

					<div className="grid gap-2">
						<Label htmlFor="pricePerKg">Price per KG ($)</Label>
						<Input
							id="pricePerKg"
							type="number"
							step="0.01"
							min="0"
							value={formData.pricePerKg}
							onChange={(e) => setFormData({ ...formData, pricePerKg: e.target.value })}
							placeholder="0.00"
						/>
					</div>

					<div className="grid gap-2">
						<Label htmlFor="freeShippingThreshold">Free Shipping Threshold ($)</Label>
						<Input
							id="freeShippingThreshold"
							type="number"
							step="0.01"
							min="0"
							value={formData.freeShippingThreshold}
							onChange={(e) => setFormData({ ...formData, freeShippingThreshold: e.target.value })}
							placeholder="0.00"
						/>
					</div>
				</div>

				<div className="grid gap-2">
					<Label htmlFor="displayOrder">Display Order</Label>
					<Input
						id="displayOrder"
						type="number"
						min="0"
						value={formData.displayOrder}
						onChange={(e) => setFormData({ ...formData, displayOrder: Number(e.target.value) })}
					/>
					<p className="text-xs text-muted-foreground">Lower numbers appear first in the list</p>
				</div>

				<div className="flex items-center space-x-2">
					<Switch
						id="isEnabled"
						checked={formData.isEnabled}
						onCheckedChange={(checked) => setFormData({ ...formData, isEnabled: checked })}
					/>
					<Label htmlFor="isEnabled">Enable this shipping provider</Label>
				</div>
			</div>

			<div className="flex gap-4">
				<Button type="submit" disabled={isLoading}>
					{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
					{provider ? "Update Provider" : "Create Provider"}
				</Button>
				<Button
					type="button"
					variant="outline"
					onClick={() => router.push("/admin/shipping-providers")}
					disabled={isLoading}
				>
					Cancel
				</Button>
			</div>
		</form>
	);
}
