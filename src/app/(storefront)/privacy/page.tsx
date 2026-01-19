import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Privacy Policy - SimplCommerce",
	description: "Privacy Policy for SimplCommerce",
};

export default function PrivacyPage() {
	return (
		<div className="container py-12">
			<div className="max-w-3xl mx-auto">
				<h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
				<p className="text-sm text-muted-foreground mb-8">Last updated: January 20, 2026</p>

				<div className="prose prose-gray dark:prose-invert max-w-none space-y-6">
					<section>
						<h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
						<p className="text-muted-foreground">
							SimplCommerce (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to
							protecting your privacy. This Privacy Policy explains how we collect, use, disclose,
							and safeguard your information when you visit our website and use our services.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
						<p className="text-muted-foreground mb-4">
							We collect information that you provide directly to us, including:
						</p>
						<ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
							<li>Name and contact information (email, phone, address)</li>
							<li>Account credentials (username, password)</li>
							<li>Payment information (credit card details)</li>
							<li>Order history and shopping preferences</li>
							<li>Customer service communications</li>
						</ul>
					</section>

					<section>
						<h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
						<p className="text-muted-foreground mb-4">We use the information we collect to:</p>
						<ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
							<li>Process and fulfill your orders</li>
							<li>Communicate with you about your orders and account</li>
							<li>Send you marketing communications (with your consent)</li>
							<li>Improve our products and services</li>
							<li>Prevent fraud and enhance security</li>
							<li>Comply with legal obligations</li>
						</ul>
					</section>

					<section>
						<h2 className="text-2xl font-semibold mb-4">4. Information Sharing</h2>
						<p className="text-muted-foreground">
							We do not sell your personal information. We may share your information with:
						</p>
						<ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
							<li>Service providers who assist in our operations</li>
							<li>Payment processors for transaction processing</li>
							<li>Shipping companies for order fulfillment</li>
							<li>Law enforcement when required by law</li>
						</ul>
					</section>

					<section>
						<h2 className="text-2xl font-semibold mb-4">5. Cookies and Tracking</h2>
						<p className="text-muted-foreground">
							We use cookies and similar tracking technologies to enhance your browsing experience,
							analyze site traffic, and understand where our visitors are coming from. You can
							control cookies through your browser settings.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-semibold mb-4">6. Data Security</h2>
						<p className="text-muted-foreground">
							We implement appropriate technical and organizational measures to protect your
							personal information against unauthorized access, alteration, disclosure, or
							destruction. However, no method of transmission over the Internet is 100% secure.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-semibold mb-4">7. Your Rights</h2>
						<p className="text-muted-foreground mb-4">You have the right to:</p>
						<ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
							<li>Access your personal information</li>
							<li>Correct inaccurate data</li>
							<li>Request deletion of your data</li>
							<li>Object to processing of your data</li>
							<li>Request data portability</li>
							<li>Withdraw consent at any time</li>
						</ul>
					</section>

					<section>
						<h2 className="text-2xl font-semibold mb-4">8. Third-Party Links</h2>
						<p className="text-muted-foreground">
							Our website may contain links to third-party websites. We are not responsible for the
							privacy practices of these external sites. We encourage you to read their privacy
							policies.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-semibold mb-4">9. Children&apos;s Privacy</h2>
						<p className="text-muted-foreground">
							Our services are not directed to children under 13. We do not knowingly collect
							personal information from children under 13. If you become aware that a child has
							provided us with personal information, please contact us.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-semibold mb-4">10. Changes to This Policy</h2>
						<p className="text-muted-foreground">
							We may update this Privacy Policy from time to time. We will notify you of any changes
							by posting the new Privacy Policy on this page and updating the &quot;Last
							updated&quot; date.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-semibold mb-4">11. Contact Us</h2>
						<p className="text-muted-foreground">
							If you have questions about this Privacy Policy, please contact us at{" "}
							<a href="mailto:privacy@simplcommerce.com" className="text-primary hover:underline">
								privacy@simplcommerce.com
							</a>
						</p>
					</section>
				</div>
			</div>
		</div>
	);
}
