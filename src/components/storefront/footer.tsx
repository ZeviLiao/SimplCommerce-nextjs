import { ShoppingBag } from "lucide-react";
import Link from "next/link";

export function Footer() {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="border-t bg-muted/40">
			<div className="container py-12">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
					{/* Brand Section */}
					<div className="space-y-3">
						<Link href="/" className="flex items-center gap-2 font-bold text-xl">
							<ShoppingBag className="h-6 w-6" />
							<span>SimplCommerce</span>
						</Link>
						<p className="text-sm text-muted-foreground">
							Modern e-commerce platform built with Next.js
						</p>
					</div>

					{/* Shop Links */}
					<div className="space-y-3">
						<h3 className="font-semibold">Shop</h3>
						<ul className="space-y-2 text-sm">
							<li>
								<Link href="/products" className="text-muted-foreground hover:text-foreground">
									All Products
								</Link>
							</li>
							<li>
								<Link href="/brands" className="text-muted-foreground hover:text-foreground">
									Brands
								</Link>
							</li>
							<li>
								<Link href="/categories" className="text-muted-foreground hover:text-foreground">
									Categories
								</Link>
							</li>
							<li>
								<Link href="/search" className="text-muted-foreground hover:text-foreground">
									Search
								</Link>
							</li>
						</ul>
					</div>

					{/* Customer Service Links */}
					<div className="space-y-3">
						<h3 className="font-semibold">Customer Service</h3>
						<ul className="space-y-2 text-sm">
							<li>
								<Link href="/contact" className="text-muted-foreground hover:text-foreground">
									Contact Us
								</Link>
							</li>
							<li>
								<Link href="/faq" className="text-muted-foreground hover:text-foreground">
									FAQ
								</Link>
							</li>
							<li>
								<Link href="/account" className="text-muted-foreground hover:text-foreground">
									My Account
								</Link>
							</li>
							<li>
								<Link
									href="/account/orders"
									className="text-muted-foreground hover:text-foreground"
								>
									Order History
								</Link>
							</li>
						</ul>
					</div>

					{/* Legal Links */}
					<div className="space-y-3">
						<h3 className="font-semibold">Information</h3>
						<ul className="space-y-2 text-sm">
							<li>
								<Link href="/about" className="text-muted-foreground hover:text-foreground">
									About Us
								</Link>
							</li>
							<li>
								<Link href="/terms" className="text-muted-foreground hover:text-foreground">
									Terms of Service
								</Link>
							</li>
							<li>
								<Link href="/privacy" className="text-muted-foreground hover:text-foreground">
									Privacy Policy
								</Link>
							</li>
						</ul>
					</div>
				</div>

				<div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
					<p>&copy; {currentYear} SimplCommerce. All rights reserved.</p>
				</div>
			</div>
		</footer>
	);
}
