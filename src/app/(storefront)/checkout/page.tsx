import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getEnabledPaymentProviders } from "@/actions/admin/payment-providers";
import { getEnabledShippingProviders } from "@/actions/admin/shipping-providers";
import { getCartItemsForCheckout } from "@/actions/checkout";
import { CheckoutFlow } from "@/components/checkout/checkout-flow";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
	title: "Checkout",
	description: "Complete your order",
};

export default async function CheckoutPage() {
	const session = await auth.api.getSession({ headers: await headers() });

	if (!session?.user) {
		redirect("/login?returnUrl=/checkout");
	}

	const [cartItems, shippingProviders, paymentProviders] = await Promise.all([
		getCartItemsForCheckout(),
		getEnabledShippingProviders(),
		getEnabledPaymentProviders(),
	]);

	if (!cartItems || cartItems.length === 0) {
		redirect("/cart");
	}

	return (
		<div className="container py-8">
			<h1 className="text-3xl font-bold mb-8">Checkout</h1>
			<CheckoutFlow
				cartItems={cartItems}
				shippingProviders={shippingProviders}
				paymentProviders={paymentProviders}
			/>
		</div>
	);
}
