import type { Metadata } from "next";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
	title: "FAQ - SimplCommerce",
	description: "Frequently asked questions about SimplCommerce",
};

export default function FAQPage() {
	const faqs = [
		{
			question: "How do I create an account?",
			answer:
				"Click on the 'Register' link in the header and fill out the registration form. You can also sign up using your Google or GitHub account for faster registration.",
		},
		{
			question: "How do I place an order?",
			answer:
				"Browse our products, add items to your cart, and proceed to checkout. You'll need to provide shipping information and select a payment method to complete your order.",
		},
		{
			question: "What payment methods do you accept?",
			answer:
				"We accept major credit cards, PayPal, and bank transfers. All payments are processed securely through our payment partners.",
		},
		{
			question: "How long does shipping take?",
			answer:
				"Shipping times vary depending on your location and the shipping method selected. Standard shipping typically takes 5-7 business days, while express shipping takes 2-3 business days.",
		},
		{
			question: "Can I track my order?",
			answer:
				"Yes! Once your order ships, you'll receive a tracking number via email. You can also view your order status in your account under 'Order History'.",
		},
		{
			question: "What is your return policy?",
			answer:
				"We accept returns within 30 days of delivery for most items. Products must be in original condition with tags attached. Contact our customer service team to initiate a return.",
		},
		{
			question: "How do I reset my password?",
			answer:
				"Click on 'Forgot Password' on the login page. Enter your email address and we'll send you a password reset link.",
		},
		{
			question: "Can I modify or cancel my order?",
			answer:
				"Orders can be modified or cancelled within 1 hour of placement. After that, please contact customer service for assistance.",
		},
		{
			question: "Do you ship internationally?",
			answer:
				"Yes, we ship to most countries worldwide. International shipping rates and delivery times vary by destination.",
		},
		{
			question: "How do I contact customer support?",
			answer:
				"You can reach our customer support team via email at support@simplcommerce.com or by phone at +1 (555) 123-4567. We're available Monday through Friday, 9 AM to 6 PM PST.",
		},
	];

	return (
		<div className="container py-12">
			<div className="max-w-3xl mx-auto">
				<h1 className="text-4xl font-bold mb-6">Frequently Asked Questions</h1>
				<p className="text-lg text-muted-foreground mb-12">
					Find answers to common questions about shopping with SimplCommerce.
				</p>

				<Accordion type="single" collapsible className="w-full">
					{faqs.map((faq, index) => (
						<AccordionItem key={index} value={`item-${index}`}>
							<AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
							<AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
						</AccordionItem>
					))}
				</Accordion>

				<div className="mt-12 p-6 border rounded-lg bg-muted/50">
					<h2 className="font-semibold mb-2">Still have questions?</h2>
					<p className="text-sm text-muted-foreground mb-4">
						Can&apos;t find the answer you&apos;re looking for? Please contact our customer support
						team.
					</p>
					<a href="/contact" className="text-sm font-medium text-primary hover:underline">
						Contact Support →
					</a>
				</div>
			</div>
		</div>
	);
}
