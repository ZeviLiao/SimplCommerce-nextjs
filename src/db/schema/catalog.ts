import { relations } from "drizzle-orm";
import {
	boolean,
	decimal,
	integer,
	jsonb,
	pgTable,
	primaryKey,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";
import { users, vendors } from "./users";

// Tax Classes
export const taxClasses = pgTable("tax_classes", {
	id: uuid("id").defaultRandom().primaryKey(),
	name: text("name").notNull(),
	isDefault: boolean("is_default").default(false).notNull(),
});

// Brands
export const brands = pgTable("brands", {
	id: uuid("id").defaultRandom().primaryKey(),
	name: text("name").notNull(),
	slug: text("slug").unique().notNull(),
	description: text("description"),
	isPublished: boolean("is_published").default(true).notNull(),
	createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

// Categories
export const categories = pgTable("categories", {
	id: uuid("id").defaultRandom().primaryKey(),
	name: text("name").notNull(),
	slug: text("slug").unique().notNull(),
	description: text("description"),
	parentId: uuid("parent_id"),
	displayOrder: integer("display_order").default(0).notNull(),
	isPublished: boolean("is_published").default(true).notNull(),
	isDeleted: boolean("is_deleted").default(false).notNull(),
	includeInMenu: boolean("include_in_menu").default(true).notNull(),
	thumbnailImageUrl: text("thumbnail_image_url"),
	metaTitle: text("meta_title"),
	metaKeywords: text("meta_keywords"),
	metaDescription: text("meta_description"),
	createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

// Product Templates
export const productTemplates = pgTable("product_templates", {
	id: uuid("id").defaultRandom().primaryKey(),
	name: text("name").notNull(),
	createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

// Product Attributes
export const productAttributeGroups = pgTable("product_attribute_groups", {
	id: uuid("id").defaultRandom().primaryKey(),
	name: text("name").notNull(),
	displayOrder: integer("display_order").default(0).notNull(),
});

export const productAttributes = pgTable("product_attributes", {
	id: uuid("id").defaultRandom().primaryKey(),
	name: text("name").notNull(),
	groupId: uuid("group_id").references(() => productAttributeGroups.id),
	displayOrder: integer("display_order").default(0).notNull(),
});

// Product Options (e.g., Size, Color)
export const productOptions = pgTable("product_options", {
	id: uuid("id").defaultRandom().primaryKey(),
	name: text("name").notNull(),
	displayOrder: integer("display_order").default(0).notNull(),
});

// Products
export const products = pgTable("products", {
	id: uuid("id").defaultRandom().primaryKey(),
	name: text("name").notNull(),
	slug: text("slug").unique().notNull(),
	shortDescription: text("short_description"),
	description: text("description"),
	specification: jsonb("specification"),
	price: decimal("price", { precision: 18, scale: 2 }).notNull(),
	oldPrice: decimal("old_price", { precision: 18, scale: 2 }),
	specialPrice: decimal("special_price", { precision: 18, scale: 2 }),
	specialPriceStart: timestamp("special_price_start", { mode: "date" }),
	specialPriceEnd: timestamp("special_price_end", { mode: "date" }),
	isPublished: boolean("is_published").default(false).notNull(),
	isFeatured: boolean("is_featured").default(false).notNull(),
	isDeleted: boolean("is_deleted").default(false).notNull(),
	isCallForPricing: boolean("is_call_for_pricing").default(false).notNull(),
	isAllowToOrder: boolean("is_allow_to_order").default(true).notNull(),
	hasOptions: boolean("has_options").default(false).notNull(),
	isVisibleIndividually: boolean("is_visible_individually").default(true).notNull(),
	stockTrackingEnabled: boolean("stock_tracking_enabled").default(true).notNull(),
	stockQuantity: integer("stock_quantity").default(0).notNull(),
	sku: text("sku"),
	gtin: text("gtin"),
	displayOrder: integer("display_order").default(0).notNull(),
	brandId: uuid("brand_id").references(() => brands.id),
	taxClassId: uuid("tax_class_id").references(() => taxClasses.id),
	vendorId: uuid("vendor_id").references(() => vendors.id),
	thumbnailImageUrl: text("thumbnail_image_url"),
	reviewsCount: integer("reviews_count").default(0).notNull(),
	ratingAverage: decimal("rating_average", { precision: 3, scale: 2 }).default("0"),
	metaTitle: text("meta_title"),
	metaKeywords: text("meta_keywords"),
	metaDescription: text("meta_description"),
	createdById: uuid("created_by_id").references(() => users.id),
	updatedById: uuid("updated_by_id").references(() => users.id),
	createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

// Product Categories (many-to-many)
export const productCategories = pgTable(
	"product_categories",
	{
		productId: uuid("product_id")
			.notNull()
			.references(() => products.id, { onDelete: "cascade" }),
		categoryId: uuid("category_id")
			.notNull()
			.references(() => categories.id, { onDelete: "cascade" }),
		isFeatured: boolean("is_featured").default(false).notNull(),
		displayOrder: integer("display_order").default(0).notNull(),
	},
	(t) => [primaryKey({ columns: [t.productId, t.categoryId] })],
);

// Product Media
export const productMedia = pgTable("product_media", {
	id: uuid("id").defaultRandom().primaryKey(),
	productId: uuid("product_id")
		.notNull()
		.references(() => products.id, { onDelete: "cascade" }),
	mediaUrl: text("media_url").notNull(),
	mediaType: text("media_type").default("image").notNull(), // 'image' | 'video'
	displayOrder: integer("display_order").default(0).notNull(),
	createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

// Product Attribute Values
export const productAttributeValues = pgTable(
	"product_attribute_values",
	{
		productId: uuid("product_id")
			.notNull()
			.references(() => products.id, { onDelete: "cascade" }),
		attributeId: uuid("attribute_id")
			.notNull()
			.references(() => productAttributes.id, { onDelete: "cascade" }),
		value: text("value").notNull(),
	},
	(t) => [primaryKey({ columns: [t.productId, t.attributeId] })],
);

// Product Option Values
export const productOptionValues = pgTable("product_option_values", {
	id: uuid("id").defaultRandom().primaryKey(),
	productId: uuid("product_id")
		.notNull()
		.references(() => products.id, { onDelete: "cascade" }),
	optionId: uuid("option_id")
		.notNull()
		.references(() => productOptions.id, { onDelete: "cascade" }),
	value: text("value").notNull(),
	displayOrder: integer("display_order").default(0).notNull(),
});

// Product Option Combinations (for variants with specific SKU/price)
export const productOptionCombinations = pgTable("product_option_combinations", {
	id: uuid("id").defaultRandom().primaryKey(),
	productId: uuid("product_id")
		.notNull()
		.references(() => products.id, { onDelete: "cascade" }),
	optionCombination: jsonb("option_combination").notNull(), // [{ optionId, value }]
	sku: text("sku"),
	gtin: text("gtin"),
	price: decimal("price", { precision: 18, scale: 2 }),
	stockQuantity: integer("stock_quantity").default(0),
	thumbnailImageUrl: text("thumbnail_image_url"),
});

// Product Links (related, cross-sell, up-sell)
export const productLinks = pgTable(
	"product_links",
	{
		productId: uuid("product_id")
			.notNull()
			.references(() => products.id, { onDelete: "cascade" }),
		linkedProductId: uuid("linked_product_id")
			.notNull()
			.references(() => products.id, { onDelete: "cascade" }),
		linkType: text("link_type").notNull(), // 'related' | 'cross_sell' | 'up_sell'
	},
	(t) => [primaryKey({ columns: [t.productId, t.linkedProductId, t.linkType] })],
);

// Product Price History
export const productPriceHistory = pgTable("product_price_history", {
	id: uuid("id").defaultRandom().primaryKey(),
	productId: uuid("product_id")
		.notNull()
		.references(() => products.id, { onDelete: "cascade" }),
	price: decimal("price", { precision: 18, scale: 2 }).notNull(),
	oldPrice: decimal("old_price", { precision: 18, scale: 2 }),
	specialPrice: decimal("special_price", { precision: 18, scale: 2 }),
	createdById: uuid("created_by_id").references(() => users.id),
	createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

// Reviews
export const reviews = pgTable("reviews", {
	id: uuid("id").defaultRandom().primaryKey(),
	productId: uuid("product_id")
		.notNull()
		.references(() => products.id, { onDelete: "cascade" }),
	userId: uuid("user_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	rating: integer("rating").notNull(),
	title: text("title"),
	comment: text("comment"),
	status: text("status").default("pending").notNull(), // 'pending' | 'approved' | 'rejected'
	createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

// Review Replies
export const reviewReplies = pgTable("review_replies", {
	id: uuid("id").defaultRandom().primaryKey(),
	reviewId: uuid("review_id")
		.notNull()
		.references(() => reviews.id, { onDelete: "cascade" }),
	userId: uuid("user_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	comment: text("comment").notNull(),
	status: text("status").default("approved").notNull(),
	createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

// Relations
export const taxClassesRelations = relations(taxClasses, ({ many }) => ({
	products: many(products),
}));

export const brandsRelations = relations(brands, ({ many }) => ({
	products: many(products),
}));

export const categoriesRelations = relations(categories, ({ one, many }) => ({
	parent: one(categories, {
		fields: [categories.parentId],
		references: [categories.id],
		relationName: "parentChild",
	}),
	children: many(categories, { relationName: "parentChild" }),
	productCategories: many(productCategories),
}));

export const productTemplatesRelations = relations(productTemplates, ({ many }) => ({
	productAttributes: many(productAttributes),
}));

export const productAttributeGroupsRelations = relations(productAttributeGroups, ({ many }) => ({
	attributes: many(productAttributes),
}));

export const productAttributesRelations = relations(productAttributes, ({ one, many }) => ({
	group: one(productAttributeGroups, {
		fields: [productAttributes.groupId],
		references: [productAttributeGroups.id],
	}),
	productAttributeValues: many(productAttributeValues),
}));

export const productOptionsRelations = relations(productOptions, ({ many }) => ({
	productOptionValues: many(productOptionValues),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
	brand: one(brands, {
		fields: [products.brandId],
		references: [brands.id],
	}),
	taxClass: one(taxClasses, {
		fields: [products.taxClassId],
		references: [taxClasses.id],
	}),
	vendor: one(vendors, {
		fields: [products.vendorId],
		references: [vendors.id],
	}),
	createdBy: one(users, {
		fields: [products.createdById],
		references: [users.id],
		relationName: "productCreatedBy",
	}),
	updatedBy: one(users, {
		fields: [products.updatedById],
		references: [users.id],
		relationName: "productUpdatedBy",
	}),
	productCategories: many(productCategories),
	media: many(productMedia),
	attributeValues: many(productAttributeValues),
	optionValues: many(productOptionValues),
	optionCombinations: many(productOptionCombinations),
	productLinks: many(productLinks, { relationName: "productLinks" }),
	linkedFrom: many(productLinks, { relationName: "linkedProducts" }),
	priceHistory: many(productPriceHistory),
	reviews: many(reviews),
}));

export const productCategoriesRelations = relations(productCategories, ({ one }) => ({
	product: one(products, {
		fields: [productCategories.productId],
		references: [products.id],
	}),
	category: one(categories, {
		fields: [productCategories.categoryId],
		references: [categories.id],
	}),
}));

export const productMediaRelations = relations(productMedia, ({ one }) => ({
	product: one(products, {
		fields: [productMedia.productId],
		references: [products.id],
	}),
}));

export const productAttributeValuesRelations = relations(productAttributeValues, ({ one }) => ({
	product: one(products, {
		fields: [productAttributeValues.productId],
		references: [products.id],
	}),
	attribute: one(productAttributes, {
		fields: [productAttributeValues.attributeId],
		references: [productAttributes.id],
	}),
}));

export const productOptionValuesRelations = relations(productOptionValues, ({ one }) => ({
	product: one(products, {
		fields: [productOptionValues.productId],
		references: [products.id],
	}),
	option: one(productOptions, {
		fields: [productOptionValues.optionId],
		references: [productOptions.id],
	}),
}));

export const productOptionCombinationsRelations = relations(
	productOptionCombinations,
	({ one }) => ({
		product: one(products, {
			fields: [productOptionCombinations.productId],
			references: [products.id],
		}),
	}),
);

export const productLinksRelations = relations(productLinks, ({ one }) => ({
	product: one(products, {
		fields: [productLinks.productId],
		references: [products.id],
		relationName: "productLinks",
	}),
	linkedProduct: one(products, {
		fields: [productLinks.linkedProductId],
		references: [products.id],
		relationName: "linkedProducts",
	}),
}));

export const productPriceHistoryRelations = relations(productPriceHistory, ({ one }) => ({
	product: one(products, {
		fields: [productPriceHistory.productId],
		references: [products.id],
	}),
	createdBy: one(users, {
		fields: [productPriceHistory.createdById],
		references: [users.id],
	}),
}));

export const reviewsRelations = relations(reviews, ({ one, many }) => ({
	product: one(products, {
		fields: [reviews.productId],
		references: [products.id],
	}),
	user: one(users, {
		fields: [reviews.userId],
		references: [users.id],
	}),
	replies: many(reviewReplies),
}));

export const reviewRepliesRelations = relations(reviewReplies, ({ one }) => ({
	review: one(reviews, {
		fields: [reviewReplies.reviewId],
		references: [reviews.id],
	}),
	user: one(users, {
		fields: [reviewReplies.userId],
		references: [users.id],
	}),
}));
