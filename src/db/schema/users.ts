import { relations } from "drizzle-orm";
import { boolean, pgEnum, pgTable, primaryKey, text, timestamp, uuid } from "drizzle-orm/pg-core";

// Enums
export const userRoleEnum = pgEnum("user_role", ["admin", "vendor", "customer"]);

// Better Auth required tables
export const user = pgTable("user", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	email: text("email").unique().notNull(),
	emailVerified: boolean("email_verified").notNull().default(false),
	image: text("image"),
	role: userRoleEnum("role").default("customer").notNull(),
	phone: text("phone"),
	culture: text("culture").default("en-US"),
	isDeleted: boolean("is_deleted").default(false).notNull(),
	vendorId: uuid("vendor_id").references(() => vendors.id),
	defaultShippingAddressId: uuid("default_shipping_address_id"),
	defaultBillingAddressId: uuid("default_billing_address_id"),
	createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const session = pgTable("session", {
	id: text("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	token: text("token").unique().notNull(),
	expiresAt: timestamp("expires_at", { mode: "date" }).notNull(),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const account = pgTable("account", {
	id: text("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	accountId: text("account_id").notNull(),
	providerId: text("provider_id").notNull(),
	accessToken: text("access_token"),
	refreshToken: text("refresh_token"),
	accessTokenExpiresAt: timestamp("access_token_expires_at", { mode: "date" }),
	refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { mode: "date" }),
	scope: text("scope"),
	idToken: text("id_token"),
	password: text("password"),
	createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const verification = pgTable("verification", {
	id: text("id").primaryKey(),
	identifier: text("identifier").notNull(),
	value: text("value").notNull(),
	expiresAt: timestamp("expires_at", { mode: "date" }).notNull(),
	createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

// Vendors
export const vendors = pgTable("vendors", {
	id: uuid("id").defaultRandom().primaryKey(),
	name: text("name").notNull(),
	slug: text("slug").unique().notNull(),
	email: text("email"),
	phone: text("phone"),
	description: text("description"),
	isActive: boolean("is_active").default(true).notNull(),
	createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

// Customer Groups
export const customerGroups = pgTable("customer_groups", {
	id: uuid("id").defaultRandom().primaryKey(),
	name: text("name").notNull(),
	description: text("description"),
	isActive: boolean("is_active").default(true).notNull(),
	createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const customerGroupUsers = pgTable(
	"customer_group_users",
	{
		customerGroupId: uuid("customer_group_id")
			.notNull()
			.references(() => customerGroups.id, { onDelete: "cascade" }),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
	},
	(t) => [primaryKey({ columns: [t.customerGroupId, t.userId] })],
);

// Addresses
export const countries = pgTable("countries", {
	id: uuid("id").defaultRandom().primaryKey(),
	name: text("name").notNull(),
	code2: text("code2").notNull(),
	code3: text("code3"),
	isBillingEnabled: boolean("is_billing_enabled").default(true).notNull(),
	isShippingEnabled: boolean("is_shipping_enabled").default(true).notNull(),
	isCityEnabled: boolean("is_city_enabled").default(true).notNull(),
	isZipCodeEnabled: boolean("is_zip_code_enabled").default(true).notNull(),
	isDistrictEnabled: boolean("is_district_enabled").default(false).notNull(),
});

export const stateOrProvinces = pgTable("state_or_provinces", {
	id: uuid("id").defaultRandom().primaryKey(),
	countryId: uuid("country_id")
		.notNull()
		.references(() => countries.id, { onDelete: "cascade" }),
	name: text("name").notNull(),
	code: text("code"),
});

export const districts = pgTable("districts", {
	id: uuid("id").defaultRandom().primaryKey(),
	stateOrProvinceId: uuid("state_or_province_id")
		.notNull()
		.references(() => stateOrProvinces.id, { onDelete: "cascade" }),
	name: text("name").notNull(),
});

export const addresses = pgTable("addresses", {
	id: uuid("id").defaultRandom().primaryKey(),
	contactName: text("contact_name").notNull(),
	phone: text("phone"),
	addressLine1: text("address_line_1").notNull(),
	addressLine2: text("address_line_2"),
	city: text("city"),
	zipCode: text("zip_code"),
	districtId: uuid("district_id").references(() => districts.id),
	stateOrProvinceId: uuid("state_or_province_id").references(() => stateOrProvinces.id),
	countryId: uuid("country_id")
		.notNull()
		.references(() => countries.id),
	createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const userAddresses = pgTable(
	"user_addresses",
	{
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		addressId: uuid("address_id")
			.notNull()
			.references(() => addresses.id, { onDelete: "cascade" }),
		addressType: text("address_type").notNull(), // 'shipping' | 'billing'
		isDefault: boolean("is_default").default(false).notNull(),
	},
	(t) => [primaryKey({ columns: [t.userId, t.addressId, t.addressType] })],
);

// Relations
export const userRelations = relations(user, ({ one, many }) => ({
	vendor: one(vendors, {
		fields: [user.vendorId],
		references: [vendors.id],
	}),
	accounts: many(account),
	sessions: many(session),
	userAddresses: many(userAddresses),
	customerGroupUsers: many(customerGroupUsers),
}));

export const accountRelations = relations(account, ({ one }) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id],
	}),
}));

export const sessionRelations = relations(session, ({ one }) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id],
	}),
}));

export const vendorsRelations = relations(vendors, ({ many }) => ({
	users: many(user),
}));

export const customerGroupsRelations = relations(customerGroups, ({ many }) => ({
	customerGroupUsers: many(customerGroupUsers),
}));

export const customerGroupUsersRelations = relations(customerGroupUsers, ({ one }) => ({
	customerGroup: one(customerGroups, {
		fields: [customerGroupUsers.customerGroupId],
		references: [customerGroups.id],
	}),
	user: one(user, {
		fields: [customerGroupUsers.userId],
		references: [user.id],
	}),
}));

export const countriesRelations = relations(countries, ({ many }) => ({
	stateOrProvinces: many(stateOrProvinces),
	addresses: many(addresses),
}));

export const stateOrProvincesRelations = relations(stateOrProvinces, ({ one, many }) => ({
	country: one(countries, {
		fields: [stateOrProvinces.countryId],
		references: [countries.id],
	}),
	districts: many(districts),
	addresses: many(addresses),
}));

export const districtsRelations = relations(districts, ({ one, many }) => ({
	stateOrProvince: one(stateOrProvinces, {
		fields: [districts.stateOrProvinceId],
		references: [stateOrProvinces.id],
	}),
	addresses: many(addresses),
}));

export const addressesRelations = relations(addresses, ({ one, many }) => ({
	country: one(countries, {
		fields: [addresses.countryId],
		references: [countries.id],
	}),
	stateOrProvince: one(stateOrProvinces, {
		fields: [addresses.stateOrProvinceId],
		references: [stateOrProvinces.id],
	}),
	district: one(districts, {
		fields: [addresses.districtId],
		references: [districts.id],
	}),
	userAddresses: many(userAddresses),
}));

export const userAddressesRelations = relations(userAddresses, ({ one }) => ({
	user: one(user, {
		fields: [userAddresses.userId],
		references: [user.id],
	}),
	address: one(addresses, {
		fields: [userAddresses.addressId],
		references: [addresses.id],
	}),
}));
