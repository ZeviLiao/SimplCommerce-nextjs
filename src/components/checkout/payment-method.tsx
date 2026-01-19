"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type PaymentData = {
	paymentMethod: string;
};

interface PaymentProvider {
	id: string;
	name: string;
	code: string;
	description: string | null;
	configData: any;
}

interface PaymentMethodProps {
	data: PaymentData;
	providers: PaymentProvider[];
	onUpdate: (data: Partial<PaymentData>) => void;
	onNext: () => void;
	onBack: () => void;
}

export function PaymentMethod({ data, providers, onUpdate, onNext, onBack }: PaymentMethodProps) {
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

	const getProviderFee = (provider: PaymentProvider) => {
		const config = provider.configData as any;
		if (!config || !config.paymentFee) return null;

		const fee = config.paymentFee;
		const feeType = config.paymentFeeType || "fixed";

		if (feeType === "percentage") {
			return `${fee}% fee`;
		}
		return `$${fee.toFixed(2)} fee`;
	};

	return (
		<div className="space-y-6">
			<h2 className="text-xl font-semibold">Select Payment Method</h2>

			{providers.length === 0 ? (
				<div className="text-center text-muted-foreground py-8">No payment methods available</div>
			) : (
				<RadioGroup value={data.paymentMethod} onValueChange={handleChange}>
					{providers.map((provider) => {
						const fee = getProviderFee(provider);
						return (
							<div key={provider.id} className="flex items-start space-x-3 p-4 border rounded-lg">
								<RadioGroupItem value={provider.code} id={provider.code} />
								<Label htmlFor={provider.code} className="flex-1 cursor-pointer">
									<div className="flex justify-between items-start">
										<div>
											<div className="font-medium">{provider.name}</div>
											{provider.description && (
												<div className="text-sm text-gray-600">{provider.description}</div>
											)}
										</div>
										{fee && <div className="text-sm text-gray-600">{fee}</div>}
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
					Review Order
				</Button>
			</div>
		</div>
	);
}
