import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { ShippingProviderForm } from "@/components/admin/shipping-providers/shipping-provider-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
	title: "Create Shipping Provider - Admin",
	description: "Create a new shipping provider",
};

export default function CreateShippingProviderPage() {
	return (
		<div className="space-y-6">
			<div className="flex items-center gap-4">
				<Button variant="ghost" size="icon" asChild>
					<Link href="/admin/shipping-providers">
						<ArrowLeft className="h-4 w-4" />
					</Link>
				</Button>
				<div>
					<h1 className="text-3xl font-bold">Create Shipping Provider</h1>
					<p className="text-muted-foreground">Add a new shipping method</p>
				</div>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Provider Details</CardTitle>
					<CardDescription>Enter the details for the new shipping provider</CardDescription>
				</CardHeader>
				<CardContent>
					<ShippingProviderForm />
				</CardContent>
			</Card>
		</div>
	);
}
