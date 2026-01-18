import { type NextRequest, NextResponse } from "next/server";
import { getCartItems } from "@/actions/cart";

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { productIds } = body;

		if (!Array.isArray(productIds)) {
			return NextResponse.json({ error: "Invalid productIds" }, { status: 400 });
		}

		const products = await getCartItems(productIds);

		return NextResponse.json(products);
	} catch (error) {
		console.error("Cart items API error:", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
