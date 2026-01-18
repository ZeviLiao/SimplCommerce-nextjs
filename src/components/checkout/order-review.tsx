"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createOrder } from "@/actions/checkout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

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

interface OrderReviewProps {
	data: {
		shippingAddressId: string;
		billingAddressId: string;
		shippingMethod: string;
		paymentMethod: string;
		orderNote: string;
	};
	cartItems: CartItem[];
	onBack: () => void;
}

export function OrderReview({ data, cartItems, onBack }: OrderReviewProps) {
	const router = useRouter();
	const [orderNote, setOrderNote] = useState(data.orderNote || "");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Calculate totals
	const subtotal = cartItems.reduce((sum, item) => {
		const price = Number(item.product.specialPrice || item.product.price);
		return sum + price * item.quantity;
	}, 0);

	const shippingFee =
		data.shippingMethod === "express" ? 15 : data.shippingMethod === "overnight" ? 30 : 0;
	const taxAmount = 0; // TODO: Calculate tax
	const total = subtotal + shippingFee + taxAmount;

	const handlePlaceOrder = async () => {
		setLoading(true);
		setError(null);

		const result = await createOrder({
			...data,
			orderNote,
		});

		if (result.success) {
			router.push(`/checkout/success?orderId=${result.orderId}`);
		} else {
			setError(result.error || "Failed to create order");
			setLoading(false);
		}
	};

	return (
		<div className="space-y-6">
			<h2 className="text-xl font-semibold">Review Your Order</h2>

			{/* Order Items */}
			<div>
				<h3 className="font-medium mb-3">Order Items</h3>
				<div className="border rounded-lg divide-y">
					{cartItems.map((item) => {
						const price = Number(item.product.specialPrice || item.product.price);
						return (
							<div key={item.id} className="p-4 flex justify-between items-center">
								<div className="flex-1">
									<div className="font-medium">{item.product.name}</div>
									<div className="text-sm text-gray-600">Quantity: {item.quantity}</div>
								</div>
								<div className="font-semibold">${(price * item.quantity).toFixed(2)}</div>
							</div>
						);
					})}
				</div>
			</div>

			{/* Order Summary */}
			<div className="border rounded-lg p-4 space-y-2">
				<h3 className="font-medium mb-3">Order Summary</h3>
				<div className="flex justify-between text-sm">
					<span>Subtotal</span>
					<span>${subtotal.toFixed(2)}</span>
				</div>
				<div className="flex justify-between text-sm">
					<span>Shipping</span>
					<span>{shippingFee === 0 ? "Free" : `$${shippingFee.toFixed(2)}`}</span>
				</div>
				<div className="flex justify-between text-sm">
					<span>Tax</span>
					<span>${taxAmount.toFixed(2)}</span>
				</div>
				<div className="border-t pt-2 flex justify-between font-semibold text-lg">
					<span>Total</span>
					<span>${total.toFixed(2)}</span>
				</div>
			</div>

			{/* Order Note */}
			<div>
				<Label htmlFor="orderNote">Order Note (Optional)</Label>
				<Textarea
					id="orderNote"
					placeholder="Add any special instructions for your order..."
					value={orderNote}
					onChange={(e) => setOrderNote(e.target.value)}
					rows={3}
					disabled={loading}
				/>
			</div>

			{error && (
				<div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">{error}</div>
			)}

			<div className="flex justify-between">
				<Button variant="outline" onClick={onBack} disabled={loading}>
					Back
				</Button>
				<Button onClick={handlePlaceOrder} disabled={loading}>
					{loading ? "Placing Order..." : "Place Order"}
				</Button>
			</div>
		</div>
	);
}
