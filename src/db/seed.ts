import { hash } from "bcryptjs";
import { db } from "./index";
import { users } from "./schema";

async function seed() {
	console.log("🌱 Seeding database...");

	// Create admin user
	const adminPassword = await hash("admin123", 10);

	await db.insert(users).values({
		name: "Admin User",
		email: "admin@example.com",
		password: adminPassword,
		role: "admin",
		emailVerified: new Date(),
	});

	console.log("✅ Admin user created:");
	console.log("   Email: admin@example.com");
	console.log("   Password: admin123");
	console.log("");

	// Create test customer
	const customerPassword = await hash("customer123", 10);

	await db.insert(users).values({
		name: "Test Customer",
		email: "customer@example.com",
		password: customerPassword,
		role: "customer",
		emailVerified: new Date(),
	});

	console.log("✅ Test customer created:");
	console.log("   Email: customer@example.com");
	console.log("   Password: customer123");
	console.log("");
	console.log("🎉 Seeding complete!");
}

seed()
	.catch((error) => {
		console.error("❌ Seeding failed:", error);
		process.exit(1);
	})
	.finally(() => {
		process.exit(0);
	});
