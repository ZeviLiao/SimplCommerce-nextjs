import { CheckCircle2 } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
	title: "Order Success",
	description: "Your order has been placed successfully",
};

export default function CheckoutSuccessPage({
	searchParams,
}: {
	searchParams: { orderId?: string };
}) {
	const orderId = searchParams.orderId;

	return (
		<div className="container py-12">
			<div className="max-w-2xl mx-auto">
				<Card>
					<CardHeader className="text-center">
						<div className="flex justify-center mb-4">
							<CheckCircle2 className="h-16 w-16 text-green-500" />
						</div>
						<CardTitle className="text-2xl">Order Placed Successfully!</CardTitle>
						<CardDescription>
							Thank you for your order. We'll send you a confirmation email shortly.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						{orderId && (
							<div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg text-center">
								<p className="text-sm text-gray-600 dark:text-gray-400">Order ID</p>
								<p className="font-mono font-semibold text-lg">{orderId}</p>
							</div>
						)}

						<div className="space-y-3">
							<h3 className="font-semibold">What's Next?</h3>
							<ul className="list-disc list-inside space-y-2 text-sm text-gray-600 dark:text-gray-400">
								<li>You'll receive an email confirmation shortly</li>
								<li>We'll notify you when your order ships</li>
								<li>You can track your order in your account</li>
							</ul>
						</div>

						<div className="flex flex-col sm:flex-row gap-3">
							<Button asChild className="flex-1">
								<Link href="/account/orders">View My Orders</Link>
							</Button>
							<Button asChild variant="outline" className="flex-1">
								<Link href="/">Continue Shopping</Link>
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
