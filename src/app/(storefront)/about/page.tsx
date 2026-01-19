import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "About Us - SimplCommerce",
	description: "Learn more about SimplCommerce and our mission",
};

export default function AboutPage() {
	return (
		<div className="container py-12">
			<div className="max-w-3xl mx-auto">
				<h1 className="text-4xl font-bold mb-6">About SimplCommerce</h1>

				<div className="prose prose-gray dark:prose-invert max-w-none">
					<p className="text-lg text-muted-foreground mb-8">
						Welcome to SimplCommerce, a modern e-commerce platform built with cutting-edge
						technology.
					</p>

					<section className="mb-8">
						<h2 className="text-2xl font-semibold mb-4">Our Story</h2>
						<p className="text-muted-foreground mb-4">
							SimplCommerce was created to provide a simple yet powerful e-commerce solution for
							businesses of all sizes. Originally built on .NET, we&apos;ve now evolved into a
							modern Next.js application that combines performance, scalability, and developer
							experience.
						</p>
						<p className="text-muted-foreground">
							Our platform is designed to be modular, extensible, and easy to customize, making it
							perfect for entrepreneurs, small businesses, and enterprise organizations alike.
						</p>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
						<p className="text-muted-foreground">
							We believe in making e-commerce accessible to everyone. Our mission is to provide a
							reliable, feature-rich platform that empowers businesses to sell online without the
							complexity and cost of traditional e-commerce solutions.
						</p>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl font-semibold mb-4">Technology Stack</h2>
						<p className="text-muted-foreground mb-4">
							SimplCommerce is built with modern web technologies:
						</p>
						<ul className="list-disc list-inside space-y-2 text-muted-foreground">
							<li>Next.js 16 with App Router</li>
							<li>React 19 with Server Components</li>
							<li>TypeScript for type safety</li>
							<li>Tailwind CSS 4 for styling</li>
							<li>shadcn/ui for UI components</li>
							<li>PostgreSQL with Drizzle ORM</li>
							<li>Better Auth for authentication</li>
						</ul>
					</section>

					<section>
						<h2 className="text-2xl font-semibold mb-4">Open Source</h2>
						<p className="text-muted-foreground">
							SimplCommerce is an open-source project. We welcome contributions from developers
							around the world. Whether you&apos;re fixing bugs, adding features, or improving
							documentation, your contributions help make SimplCommerce better for everyone.
						</p>
					</section>
				</div>
			</div>
		</div>
	);
}
