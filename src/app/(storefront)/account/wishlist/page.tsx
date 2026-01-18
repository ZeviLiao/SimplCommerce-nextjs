import type { Metadata } from "next";
import { getWishlistItems } from "@/actions/wishlist";
import { WishlistContent } from "@/components/wishlist/wishlist-content";

export const metadata: Metadata = {
	title: "My Wishlist",
	description: "View and manage your wishlist items",
};

export default async function WishlistPage() {
	const items = await getWishlistItems();

	return (
		<div>
			<h1 className="text-2xl font-bold mb-6">My Wishlist</h1>
			<WishlistContent items={items} />
		</div>
	);
}
