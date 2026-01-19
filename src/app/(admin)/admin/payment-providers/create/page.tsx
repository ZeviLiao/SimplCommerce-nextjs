import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { PaymentProviderForm } from "@/components/admin/payment-providers/payment-provider-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
	title: "Create Payment Provider - Admin",
	description: "Create a new payment provider",
};

export default function CreatePaymentProviderPage() {
	return (
		<div className="space-y-6">
			<div className="flex items-center gap-4">
				<Button variant="ghost" size="icon" asChild>
					<Link href="/admin/payment-providers">
						<ArrowLeft className="h-4 w-4" />
					</Link>
				</Button>
				<div>
					<h1 className="text-3xl font-bold">Create Payment Provider</h1>
					<p className="text-muted-foreground">Add a new payment method</p>
				</div>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Provider Details</CardTitle>
					<CardDescription>Enter the details for the new payment provider</CardDescription>
				</CardHeader>
				<CardContent>
					<PaymentProviderForm />
				</CardContent>
			</Card>
		</div>
	);
}
