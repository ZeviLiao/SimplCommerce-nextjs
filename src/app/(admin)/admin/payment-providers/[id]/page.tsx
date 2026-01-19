import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPaymentProviderById } from "@/actions/admin/payment-providers";
import { PaymentProviderForm } from "@/components/admin/payment-providers/payment-provider-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
	title: "Edit Payment Provider - Admin",
	description: "Edit payment provider details",
};

interface PageProps {
	params: Promise<{
		id: string;
	}>;
}

export default async function EditPaymentProviderPage({ params }: PageProps) {
	const { id } = await params;
	const provider = await getPaymentProviderById(id);

	if (!provider) {
		notFound();
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center gap-4">
				<Button variant="ghost" size="icon" asChild>
					<Link href="/admin/payment-providers">
						<ArrowLeft className="h-4 w-4" />
					</Link>
				</Button>
				<div>
					<h1 className="text-3xl font-bold">Edit Payment Provider</h1>
					<p className="text-muted-foreground">Update provider details</p>
				</div>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Provider Details</CardTitle>
					<CardDescription>Update the details for {provider.name}</CardDescription>
				</CardHeader>
				<CardContent>
					<PaymentProviderForm provider={provider} />
				</CardContent>
			</Card>
		</div>
	);
}
