import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { type AuthSession, auth } from "@/lib/auth";

export async function POST(request: NextRequest) {
	try {
		const session = (await auth.api.getSession({ headers: await headers() })) as AuthSession | null;

		// Check if user is admin
		if (!session?.user || session.user.role !== "admin") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const formData = await request.formData();
		const file = formData.get("file") as File;

		if (!file) {
			return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
		}

		// Validate file type (images only)
		const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
		if (!allowedTypes.includes(file.type)) {
			return NextResponse.json(
				{ error: "Invalid file type. Only images are allowed." },
				{ status: 400 },
			);
		}

		// Validate file size (max 5MB)
		const maxSize = 5 * 1024 * 1024; // 5MB
		if (file.size > maxSize) {
			return NextResponse.json({ error: "File size exceeds 5MB limit" }, { status: 400 });
		}

		const bytes = await file.arrayBuffer();
		const buffer = Buffer.from(bytes);

		// Generate unique filename
		const ext = path.extname(file.name);
		const filename = `${crypto.randomUUID()}${ext}`;

		// Create user-content directory if it doesn't exist
		const uploadDir = path.join(process.cwd(), "public", "user-content");
		if (!existsSync(uploadDir)) {
			await mkdir(uploadDir, { recursive: true });
		}

		// Save file
		const filepath = path.join(uploadDir, filename);
		await writeFile(filepath, buffer);

		// Return URL
		const url = `/user-content/${filename}`;
		return NextResponse.json({ url });
	} catch (error) {
		console.error("Upload error:", error);
		return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
	}
}
