"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type PaymentData = {
	paymentMethod: string;
};

interface PaymentMethodProps {
	data: PaymentData;
	onUpdate: (data: Partial<PaymentData>) => void;
	onNext: () => void;
	onBack: () => void;
}

// TODO: Fetch from payment providers API
const paymentMethods = [
	{ id: "cod", name: "Cash on Delivery", description: "Pay when you receive your order" },
	{ id: "stripe", name: "Credit/Debit Card", description: "Pay securely with Stripe" },
	{ id: "paypal", name: "PayPal", description: "Pay with your PayPal account" },
];

export function PaymentMethod({ data, onUpdate, onNext, onBack }: PaymentMethodProps) {
	const handleChange = (methodId: string) => {
		onUpdate({ paymentMethod: methodId });
	};

	const handleNext = () => {
		if (!data.paymentMethod) {
			alert("Please select a payment method");
			return;
		}
		onNext();
	};

	return (
		<div className="space-y-6">
			<h2 className="text-xl font-semibold">Select Payment Method</h2>

			<RadioGroup value={data.paymentMethod} onValueChange={handleChange}>
				{paymentMethods.map((method) => (
					<div key={method.id} className="flex items-start space-x-3 p-4 border rounded-lg">
						<RadioGroupItem value={method.id} id={method.id} />
						<Label htmlFor={method.id} className="flex-1 cursor-pointer">
							<div className="font-medium">{method.name}</div>
							<div className="text-sm text-gray-600">{method.description}</div>
						</Label>
					</div>
				))}
			</RadioGroup>

			<div className="flex justify-between">
				<Button variant="outline" onClick={onBack}>
					Back
				</Button>
				<Button onClick={handleNext}>Review Order</Button>
			</div>
		</div>
	);
}
