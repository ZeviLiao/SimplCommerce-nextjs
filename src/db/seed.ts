import "dotenv/config";
import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "./index";
import * as schema from "./schema";

async function seed() {
	console.log("🌱 Seeding database...");

	// Clear existing product data
	console.log("Clearing existing product data...");
	await db.delete(schema.productCategories);
	await db.delete(schema.productMedia);
	await db.delete(schema.products);
	await db.delete(schema.categories);
	await db.delete(schema.brands);
	await db.delete(schema.taxClasses);
	await db.delete(schema.stateOrProvinces);
	await db.delete(schema.countries);

	// 1. Countries
	console.log("Creating countries...");
	const [taiwan, usa, japan] = await db
		.insert(schema.countries)
		.values([
			{
				name: "Taiwan",
				code2: "TW",
				code3: "TWN",
				isBillingEnabled: true,
				isShippingEnabled: true,
				isCityEnabled: true,
				isZipCodeEnabled: true,
				isDistrictEnabled: true,
			},
			{
				name: "United States",
				code2: "US",
				code3: "USA",
				isBillingEnabled: true,
				isShippingEnabled: true,
				isCityEnabled: true,
				isZipCodeEnabled: true,
				isDistrictEnabled: false,
			},
			{
				name: "Japan",
				code2: "JP",
				code3: "JPN",
				isBillingEnabled: true,
				isShippingEnabled: true,
				isCityEnabled: true,
				isZipCodeEnabled: true,
				isDistrictEnabled: false,
			},
		])
		.returning();

	// 2. States/Provinces
	console.log("Creating states/provinces...");
	await db.insert(schema.stateOrProvinces).values([
		{ countryId: taiwan.id, name: "Taipei City", code: "TPE" },
		{ countryId: taiwan.id, name: "New Taipei City", code: "NWT" },
		{ countryId: taiwan.id, name: "Taichung City", code: "TXG" },
		{ countryId: usa.id, name: "California", code: "CA" },
		{ countryId: usa.id, name: "New York", code: "NY" },
		{ countryId: japan.id, name: "Tokyo", code: "13" },
	]);

	// 3. Tax Classes
	console.log("Creating tax classes...");
	const [defaultTax] = await db
		.insert(schema.taxClasses)
		.values([
			{ name: "Standard Rate", isDefault: true },
			{ name: "Reduced Rate", isDefault: false },
			{ name: "Zero Rate", isDefault: false },
		])
		.returning();

	// 4. Brands
	console.log("Creating brands...");
	const [apple, samsung, sony] = await db
		.insert(schema.brands)
		.values([
			{
				name: "Apple",
				slug: "apple",
				description: "Think Different",
				isPublished: true,
			},
			{
				name: "Samsung",
				slug: "samsung",
				description: "Inspire the World",
				isPublished: true,
			},
			{
				name: "Sony",
				slug: "sony",
				description: "Be Moved",
				isPublished: true,
			},
			{
				name: "Nike",
				slug: "nike",
				description: "Just Do It",
				isPublished: true,
			},
			{
				name: "Adidas",
				slug: "adidas",
				description: "Impossible is Nothing",
				isPublished: true,
			},
		])
		.returning();

	// 5. Categories
	console.log("Creating categories...");
	const [electronics, phones, laptops, clothing, shoes] = await db
		.insert(schema.categories)
		.values([
			{
				name: "Electronics",
				slug: "electronics",
				description: "Electronic devices and accessories",
				displayOrder: 1,
				isPublished: true,
				includeInMenu: true,
			},
			{
				name: "Smartphones",
				slug: "smartphones",
				description: "Latest smartphones",
				displayOrder: 1,
				isPublished: true,
				includeInMenu: true,
			},
			{
				name: "Laptops",
				slug: "laptops",
				description: "Laptops and notebooks",
				displayOrder: 2,
				isPublished: true,
				includeInMenu: true,
			},
			{
				name: "Clothing",
				slug: "clothing",
				description: "Fashion and apparel",
				displayOrder: 2,
				isPublished: true,
				includeInMenu: true,
			},
			{
				name: "Shoes",
				slug: "shoes",
				description: "Footwear for all occasions",
				displayOrder: 1,
				isPublished: true,
				includeInMenu: true,
			},
		])
		.returning();

	// Set parent categories
	await db
		.update(schema.categories)
		.set({ parentId: electronics.id })
		.where(eq(schema.categories.id, phones.id));

	await db
		.update(schema.categories)
		.set({ parentId: electronics.id })
		.where(eq(schema.categories.id, laptops.id));

	await db
		.update(schema.categories)
		.set({ parentId: clothing.id })
		.where(eq(schema.categories.id, shoes.id));

	// 6. Products (Based on SimplCommerce sample data)
	console.log("Creating products...");
	const products = await db
		.insert(schema.products)
		.values([
			{
				name: "iPad Pro Wi-Fi 4G 128GB",
				slug: "ipad-pro-wi-fi-4g-128gb",
				shortDescription:
					'<ul><li>Retina Display</li><li>ATX chip</li><li>iOS 9</li><li>Apps for iPad</li><li>Slim and light design</li><li>12.9" with Retina Display, 2732 x 2048 Resolution</li><li>Apple iOS 9, Dual-Core A9X Chip with Quad-Core Graphics</li></ul>',
				description:
					"<p>iPad Pro is more than the next generation of iPad — it's an uncompromising vision of personal computing for the modern world. It puts incredible power that leaps past most portable PCs at your fingertips. It makes even complex work as natural as touching, swiping, or writing with a pencil. And whether you choose the 12.9-inch model or the new 9.7-inch model, iPad Pro is more capable, versatile, and portable than anything that's come before. In a word, super.</p>",
				price: "999.00",
				oldPrice: "899.00",
				isPublished: true,
				isFeatured: true,
				hasOptions: true,
				isAllowToOrder: true,
				stockTrackingEnabled: true,
				stockQuantity: 0,
				sku: "IPAD-PRO-128",
				brandId: apple.id,
				taxClassId: defaultTax.id,
				thumbnailImageUrl: "/images/products/9874f0f5-46dc-495d-8c61-2c515577aa05.jpg",
				reviewsCount: 0,
				ratingAverage: "0",
			},
			{
				name: "Samsung Galaxy A5",
				slug: "samsung-galaxy-a5",
				shortDescription:
					"<ul><li>Dust and Water Resistant (IP68 Rating)</li><li> Always on Display</li><li> 16 MP Front and Rear Camera </li><li>FHD sAMOLED<br></li></ul>",
				description:
					"<p>The new Galaxy A (2017) comes with protection that lets you enjoy life without a worry. Equipped with IP68 to withstand the elements of nature, it shields out everything from water to dust in most situations.</p><p>A memorable moment becomes more beautiful if captured perfectly. The powerful 16MP front & rear cameras with f/1.9 aperture lenses in the new Galaxy A (2017), give your pictures the added depth and detail they deserve<br></p>",
				price: "399.00",
				oldPrice: "449.00",
				isPublished: true,
				isFeatured: true,
				hasOptions: true,
				isAllowToOrder: true,
				stockTrackingEnabled: true,
				stockQuantity: 0,
				sku: "GALAXY-A5",
				brandId: samsung.id,
				taxClassId: defaultTax.id,
				thumbnailImageUrl: "/images/products/7da07700-9a17-498b-ba58-526559343878.jpg",
				reviewsCount: 0,
				ratingAverage: "0",
			},
			{
				name: "iPhone 6s 16GB",
				slug: "iphone-6s-16gb",
				shortDescription:
					"<p>A 4.7-inch Retina HD display with 3D Touch. 7000 series aluminum and stronger cover glass. An A9 chip with 64-bit desktop-class architecture. All new 12MP iSight camera with Live Photos. Touch ID. Faster LTE and Wi-Fi. Long battery life and iOS 10 and iCloud. All in a smooth, continuous unibody design.<br></p>",
				description:
					"<p>Apple iPhone 6s smartphone was launched in September 2015. The phone comes with a 4.70-inch touchscreen display with a resolution of 750 pixels by 1334 pixels at a PPI of 326 pixels per inch.</p><p>It comes with 2GB of RAM. The phone packs 16GB of internal storage that cannot be expanded. As far as the cameras are concerned, the Apple iPhone 6s packs a 12-megapixel primary camera on the rear and a 5-megapixel front shooter for selfies.</p>",
				price: "499.00",
				oldPrice: "599.00",
				isPublished: true,
				isFeatured: true,
				hasOptions: true,
				isAllowToOrder: true,
				stockTrackingEnabled: true,
				stockQuantity: 0,
				sku: "IPHONE-6S-16",
				brandId: apple.id,
				taxClassId: defaultTax.id,
				thumbnailImageUrl: "/images/products/bb1243c9-63d5-4518-bbd5-cb3e35ade294.jpg",
				reviewsCount: 0,
				ratingAverage: "0",
			},
			{
				name: "Samsung Galaxy J7",
				slug: "samsung-galaxy-j7",
				shortDescription:
					"<ul><li>5.5 inch Super AMOLED capacitive touchscreen</li><li>Android OS, v5.1 (Lollipop)</li><li>13 MP, f/1.9, 28mm, autofocus, LED flash + 5 MP, f/2.2, 25mm front camera</li><li>Internal 16 GB, 1.5 GB RAM</li><li>Li-Ion 3000 mAh battery</li></ul>",
				description:
					"<p>Samsung Galaxy J7 is the best Phone for your daily use. Samsung is the most trusted brand all over the world. People love Samsung Galaxy J7 for its features and quality.</p>",
				price: "349.00",
				isPublished: true,
				isFeatured: false,
				hasOptions: false,
				isAllowToOrder: true,
				stockTrackingEnabled: true,
				stockQuantity: 100,
				sku: "GALAXY-J7",
				brandId: samsung.id,
				taxClassId: defaultTax.id,
				thumbnailImageUrl: "/images/products/4495b930-a901-44e2-9275-935f7e8ec53c.jpg",
				reviewsCount: 0,
				ratingAverage: "0",
			},
			{
				name: "Sony Xperia Z5",
				slug: "sony-xperia-z5",
				shortDescription:
					"<ul><li>5.2-inch Full HD display</li><li>23 MP camera</li><li>Android 5.1</li><li>IP68 waterproof</li></ul>",
				description:
					"<p>Sony Xperia Z5 comes with a beautiful 5.2-inch Full HD display and powerful 23 MP camera. With IP68 rating, it's dust and water resistant.</p>",
				price: "549.00",
				isPublished: true,
				isFeatured: false,
				hasOptions: false,
				isAllowToOrder: true,
				stockTrackingEnabled: true,
				stockQuantity: 50,
				sku: "XPERIA-Z5",
				brandId: sony.id,
				taxClassId: defaultTax.id,
				thumbnailImageUrl: "/images/products/68c7ff8f-014e-46c8-8daa-f35c646cc10a.jpg",
				reviewsCount: 0,
				ratingAverage: "0",
			},
		])
		.returning();

	// 7. Product Categories
	console.log("Linking products to categories...");
	await db.insert(schema.productCategories).values([
		// iPad Pro
		{ productId: products[0].id, categoryId: laptops.id, isFeatured: true },
		{ productId: products[0].id, categoryId: electronics.id },
		// Samsung Galaxy A5
		{ productId: products[1].id, categoryId: phones.id, isFeatured: true },
		{ productId: products[1].id, categoryId: electronics.id },
		// iPhone 6s
		{ productId: products[2].id, categoryId: phones.id, isFeatured: true },
		{ productId: products[2].id, categoryId: electronics.id },
		// Samsung Galaxy J7
		{ productId: products[3].id, categoryId: phones.id },
		{ productId: products[3].id, categoryId: electronics.id },
		// Sony Xperia Z5
		{ productId: products[4].id, categoryId: phones.id },
		{ productId: products[4].id, categoryId: electronics.id },
	]);

	// 8. Create/check test users
	console.log("Checking test users...");
	const existingAdmin = await db.query.users.findFirst({
		where: eq(schema.users.email, "admin@example.com"),
	});

	if (!existingAdmin) {
		console.log("Creating admin user...");
		const adminPassword = await hash("admin123", 10);
		await db.insert(schema.users).values({
			email: "admin@example.com",
			name: "Admin User",
			password: adminPassword,
			role: "admin",
			emailVerified: new Date(),
		});
	}

	const existingCustomer = await db.query.users.findFirst({
		where: eq(schema.users.email, "customer@example.com"),
	});

	if (!existingCustomer) {
		console.log("Creating customer user...");
		const customerPassword = await hash("customer123", 10);
		await db.insert(schema.users).values({
			email: "customer@example.com",
			name: "Test Customer",
			password: customerPassword,
			role: "customer",
			emailVerified: new Date(),
		});
	}

	console.log("✅ Seeding completed!");
	console.log("\n📦 Created:");
	console.log(`   - 3 countries`);
	console.log(`   - 6 states/provinces`);
	console.log(`   - 3 tax classes`);
	console.log(`   - 5 brands`);
	console.log(`   - 5 categories`);
	console.log(`   - 6 products`);
	console.log("\n👤 Test accounts:");
	console.log("   Admin: admin@example.com / admin123");
	console.log("   Customer: customer@example.com / customer123");
}

seed()
	.catch((error) => {
		console.error("❌ Seeding failed:", error);
		process.exit(1);
	})
	.finally(() => {
		process.exit(0);
	});
