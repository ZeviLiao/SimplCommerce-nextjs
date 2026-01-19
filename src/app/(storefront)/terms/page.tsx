import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Terms of Service - SimplCommerce",
	description: "Terms of Service for SimplCommerce",
};

export default function TermsPage() {
	return (
		<div className="container py-12">
			<div className="max-w-3xl mx-auto">
				<h1 className="text-4xl font-bold mb-6">Terms of Service</h1>
				<p className="text-sm text-muted-foreground mb-8">Last updated: January 20, 2026</p>

				<div className="prose prose-gray dark:prose-invert max-w-none space-y-6">
					<section>
						<h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
						<p className="text-muted-foreground">
							By accessing and using SimplCommerce, you accept and agree to be bound by the terms
							and provision of this agreement. If you do not agree to these terms, please do not use
							our service.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-semibold mb-4">2. Use License</h2>
						<p className="text-muted-foreground mb-4">
							Permission is granted to temporarily access the materials on SimplCommerce for
							personal, non-commercial transitory viewing only. This is the grant of a license, not
							a transfer of title.
						</p>
						<p className="text-muted-foreground">Under this license you may not:</p>
						<ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
							<li>Modify or copy the materials</li>
							<li>Use the materials for any commercial purpose</li>
							<li>Attempt to decompile or reverse engineer any software</li>
							<li>Remove any copyright or proprietary notations</li>
							<li>Transfer the materials to another person</li>
						</ul>
					</section>

					<section>
						<h2 className="text-2xl font-semibold mb-4">3. Account Terms</h2>
						<p className="text-muted-foreground">
							You are responsible for maintaining the security of your account and password.
							SimplCommerce cannot and will not be liable for any loss or damage from your failure
							to comply with this security obligation.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-semibold mb-4">4. Product Information</h2>
						<p className="text-muted-foreground">
							We strive to provide accurate product descriptions and pricing. However, we do not
							warrant that product descriptions, pricing, or other content is accurate, complete,
							reliable, current, or error-free.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-semibold mb-4">5. Orders and Payment</h2>
						<p className="text-muted-foreground">
							We reserve the right to refuse any order you place with us. We may, in our sole
							discretion, limit or cancel quantities purchased per person, per household or per
							order.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-semibold mb-4">6. Shipping and Delivery</h2>
						<p className="text-muted-foreground">
							Shipping times are estimates and are not guaranteed. We are not responsible for delays
							caused by the shipping carrier or events beyond our control.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-semibold mb-4">7. Returns and Refunds</h2>
						<p className="text-muted-foreground">
							Our return policy allows returns within 30 days of delivery. Items must be in original
							condition. Refunds will be processed to the original payment method within 5-10
							business days of receiving the returned item.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-semibold mb-4">8. Limitation of Liability</h2>
						<p className="text-muted-foreground">
							In no event shall SimplCommerce or its suppliers be liable for any damages arising out
							of the use or inability to use the materials on SimplCommerce, even if authorized
							representative has been notified orally or in writing of the possibility of such
							damage.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-semibold mb-4">9. Modifications</h2>
						<p className="text-muted-foreground">
							SimplCommerce may revise these terms of service at any time without notice. By using
							this website you are agreeing to be bound by the then current version of these terms
							of service.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-semibold mb-4">10. Contact Information</h2>
						<p className="text-muted-foreground">
							Questions about the Terms of Service should be sent to us at{" "}
							<a href="mailto:legal@simplcommerce.com" className="text-primary hover:underline">
								legal@simplcommerce.com
							</a>
						</p>
					</section>
				</div>
			</div>
		</div>
	);
}
