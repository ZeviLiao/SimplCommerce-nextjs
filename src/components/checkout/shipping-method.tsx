"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type ShippingData = {
	shippingMethod: string;
};

interface ShippingMethodProps {
	data: ShippingData;
	onUpdate: (data: Partial<ShippingData>) => void;
	onNext: () => void;
	onBack: () => void;
}

// TODO: Fetch from shipping providers API
const shippingMethods = [
	{ id: "standard", name: "Standard Shipping", price: 0, estimatedDays: "5-7 business days" },
	{ id: "express", name: "Express Shipping", price: 15, estimatedDays: "2-3 business days" },
	{ id: "overnight", name: "Overnight Shipping", price: 30, estimatedDays: "1 business day" },
];

export function ShippingMethod({ data, onUpdate, onNext, onBack }: ShippingMethodProps) {
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

	return (
		<div className="space-y-6">
			<h2 className="text-xl font-semibold">Select Shipping Method</h2>

			<RadioGroup value={data.shippingMethod} onValueChange={handleChange}>
				{shippingMethods.map((method) => (
					<div key={method.id} className="flex items-start space-x-3 p-4 border rounded-lg">
						<RadioGroupItem value={method.id} id={method.id} />
						<Label htmlFor={method.id} className="flex-1 cursor-pointer">
							<div className="flex justify-between">
								<div>
									<div className="font-medium">{method.name}</div>
									<div className="text-sm text-gray-600">{method.estimatedDays}</div>
								</div>
								<div className="font-semibold">
									{method.price === 0 ? "Free" : `$${method.price.toFixed(2)}`}
								</div>
							</div>
						</Label>
					</div>
				))}
			</RadioGroup>

			<div className="flex justify-between">
				<Button variant="outline" onClick={onBack}>
					Back
				</Button>
				<Button onClick={handleNext}>Continue to Payment</Button>
			</div>
		</div>
	);
}
