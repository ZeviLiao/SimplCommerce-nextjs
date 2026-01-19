import { Mail, MapPin, Phone } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Contact Us - SimplCommerce",
	description: "Get in touch with SimplCommerce",
};

export default function ContactPage() {
	return (
		<div className="container py-12">
			<div className="max-w-3xl mx-auto">
				<h1 className="text-4xl font-bold mb-6">Contact Us</h1>
				<p className="text-lg text-muted-foreground mb-12">
					Have a question or need assistance? We&apos;re here to help.
				</p>

				<div className="grid md:grid-cols-3 gap-8 mb-12">
					<div className="flex flex-col items-center text-center p-6 border rounded-lg">
						<div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
							<Mail className="h-6 w-6 text-primary" />
						</div>
						<h3 className="font-semibold mb-2">Email</h3>
						<p className="text-sm text-muted-foreground">support@simplcommerce.com</p>
					</div>

					<div className="flex flex-col items-center text-center p-6 border rounded-lg">
						<div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
							<Phone className="h-6 w-6 text-primary" />
						</div>
						<h3 className="font-semibold mb-2">Phone</h3>
						<p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
					</div>

					<div className="flex flex-col items-center text-center p-6 border rounded-lg">
						<div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
							<MapPin className="h-6 w-6 text-primary" />
						</div>
						<h3 className="font-semibold mb-2">Address</h3>
						<p className="text-sm text-muted-foreground">
							123 Commerce Street
							<br />
							San Francisco, CA 94102
						</p>
					</div>
				</div>

				<div className="border rounded-lg p-8">
					<h2 className="text-2xl font-semibold mb-6">Send us a message</h2>
					<p className="text-muted-foreground mb-6">
						For general inquiries, please email us at{" "}
						<a href="mailto:support@simplcommerce.com" className="text-primary hover:underline">
							support@simplcommerce.com
						</a>
					</p>
					<p className="text-sm text-muted-foreground">
						We typically respond within 24-48 hours during business days.
					</p>
				</div>
			</div>
		</div>
	);
}
