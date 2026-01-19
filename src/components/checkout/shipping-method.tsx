"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type ShippingData = {
	shippingMethod: string;
};

interface ShippingProvider {
	id: string;
	name: string;
	code: string;
	description: string | null;
	configData: any;
}

interface ShippingMethodProps {
	data: ShippingData;
	providers: ShippingProvider[];
	onUpdate: (data: Partial<ShippingData>) => void;
	onNext: () => void;
	onBack: () => void;
}

export function ShippingMethod({ data, providers, onUpdate, onNext, onBack }: ShippingMethodProps) {
	const handleChange = (methodId: string) => {
		onUpdate({ shippingMethod: methodId });
	};

	const handleNext = () => {
		if (!data.shippingMethod) {
			alert("Please select a shipping method");
			return;
		}
		onNext();
	};

	const getProviderPrice = (provider: ShippingProvider) => {
		const config = provider.configData as any;
		if (!config) return 0;
		return config.basePrice || 0;
	};

	return (
		<div className="space-y-6">
			<h2 className="text-xl font-semibold">Select Shipping Method</h2>

			{providers.length === 0 ? (
				<div className="text-center text-muted-foreground py-8">No shipping methods available</div>
			) : (
				<RadioGroup value={data.shippingMethod} onValueChange={handleChange}>
					{providers.map((provider) => {
						const price = getProviderPrice(provider);
						return (
							<div key={provider.id} className="flex items-start space-x-3 p-4 border rounded-lg">
								<RadioGroupItem value={provider.code} id={provider.code} />
								<Label htmlFor={provider.code} className="flex-1 cursor-pointer">
									<div className="flex justify-between">
										<div>
											<div className="font-medium">{provider.name}</div>
											{provider.description && (
												<div className="text-sm text-gray-600">{provider.description}</div>
											)}
										</div>
										<div className="font-semibold">
											{price === 0 ? "Free" : `$${price.toFixed(2)}`}
										</div>
									</div>
								</Label>
							</div>
						);
					})}
				</RadioGroup>
			)}

			<div className="flex justify-between">
				<Button variant="outline" onClick={onBack}>
					Back
				</Button>
				<Button onClick={handleNext} disabled={providers.length === 0}>
					Continue to Payment
				</Button>
			</div>
		</div>
	);
}
