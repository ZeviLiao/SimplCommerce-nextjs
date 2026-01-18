"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AddressSelection } from "./address-selection";
import { OrderReview } from "./order-review";
import { PaymentMethod } from "./payment-method";
import { ShippingMethod } from "./shipping-method";

type CheckoutStep = "address" | "shipping" | "payment" | "review";

type CartItem = {
	id: string;
	productId: string;
	quantity: number;
	product: {
		name: string;
		price: string;
		specialPrice: string | null;
	};
};

interface CheckoutFlowProps {
	cartItems: CartItem[];
}

export function CheckoutFlow({ cartItems }: CheckoutFlowProps) {
	const _router = useRouter();
	const [currentStep, setCurrentStep] = useState<CheckoutStep>("address");
	const [checkoutData, setCheckoutData] = useState({
		shippingAddressId: "",
		billingAddressId: "",
		shippingMethod: "",
		paymentMethod: "",
		orderNote: "",
	});

	const steps = [
		{ id: "address", name: "Shipping Address", number: 1 },
		{ id: "shipping", name: "Shipping Method", number: 2 },
		{ id: "payment", name: "Payment Method", number: 3 },
		{ id: "review", name: "Review Order", number: 4 },
	];

	const currentStepIndex = steps.findIndex((s) => s.id === currentStep);

	const handleNext = () => {
		const nextIndex = currentStepIndex + 1;
		if (nextIndex < steps.length) {
			setCurrentStep(steps[nextIndex].id as CheckoutStep);
		}
	};

	const handleBack = () => {
		const prevIndex = currentStepIndex - 1;
		if (prevIndex >= 0) {
			setCurrentStep(steps[prevIndex].id as CheckoutStep);
		}
	};

	const updateData = (data: Partial<typeof checkoutData>) => {
		setCheckoutData((prev) => ({ ...prev, ...data }));
	};

	return (
		<div className="max-w-5xl mx-auto">
			{/* Progress Steps */}
			<div className="mb-8">
				<div className="flex items-center justify-between">
					{steps.map((step, index) => (
						<div key={step.id} className="flex items-center flex-1">
							<div className="flex flex-col items-center flex-1">
								<div
									className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
										index <= currentStepIndex
											? "bg-primary text-primary-foreground"
											: "bg-gray-200 text-gray-500"
									}`}
								>
									{step.number}
								</div>
								<span
									className={`text-sm mt-2 ${
										index <= currentStepIndex ? "text-primary font-medium" : "text-gray-500"
									}`}
								>
									{step.name}
								</span>
							</div>
							{index < steps.length - 1 && (
								<div
									className={`h-1 flex-1 mx-2 ${
										index < currentStepIndex ? "bg-primary" : "bg-gray-200"
									}`}
								/>
							)}
						</div>
					))}
				</div>
			</div>

			{/* Step Content */}
			<Card>
				<CardContent className="p-6">
					{currentStep === "address" && (
						<AddressSelection data={checkoutData} onUpdate={updateData} onNext={handleNext} />
					)}

					{currentStep === "shipping" && (
						<ShippingMethod
							data={checkoutData}
							onUpdate={updateData}
							onNext={handleNext}
							onBack={handleBack}
						/>
					)}

					{currentStep === "payment" && (
						<PaymentMethod
							data={checkoutData}
							onUpdate={updateData}
							onNext={handleNext}
							onBack={handleBack}
						/>
					)}

					{currentStep === "review" && (
						<OrderReview data={checkoutData} cartItems={cartItems} onBack={handleBack} />
					)}
				</CardContent>
			</Card>
		</div>
	);
}
