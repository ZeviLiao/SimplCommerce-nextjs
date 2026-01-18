import { integer, pgEnum, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";
import { products } from "./catalog";

export const mediaTypeEnum = pgEnum("media_type", ["image", "file"]);

export const media = pgTable("media", {
	id: varchar("id", { length: 191 })
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	caption: varchar("caption", { length: 450 }),
	fileSize: integer("file_size").notNull(),
	fileName: varchar("file_name", { length: 450 }).notNull(),
	mediaType: mediaTypeEnum("media_type").notNull().default("image"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const productMedia = pgTable("product_media", {
	id: varchar("id", { length: 191 })
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	productId: varchar("product_id", { length: 191 })
		.notNull()
		.references(() => products.id, { onDelete: "cascade" }),
	mediaId: varchar("media_id", { length: 191 })
		.notNull()
		.references(() => media.id, { onDelete: "cascade" }),
	displayOrder: integer("display_order").notNull().default(0),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});
