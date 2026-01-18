import { relations } from "drizzle-orm";
import {
	boolean,
	integer,
	pgEnum,
	pgTable,
	primaryKey,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";

// Enums
export const userRoleEnum = pgEnum("user_role", ["admin", "vendor", "customer"]);

// Auth.js required tables
export const users = pgTable("users", {
	id: uuid("id").defaultRandom().primaryKey(),
	name: text("name"),
	email: text("email").unique().notNull(),
	emailVerified: timestamp("email_verified", { mode: "date" }),
	image: text("image"),
	password: text("password"),
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

export const accounts = pgTable(
	"accounts",
	{
		userId: uuid("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		type: text("type").notNull(),
		provider: text("provider").notNull(),
		providerAccountId: text("provider_account_id").notNull(),
		refresh_token: text("refresh_token"),
		access_token: text("access_token"),
		expires_at: integer("expires_at"),
		token_type: text("token_type"),
		scope: text("scope"),
		id_token: text("id_token"),
		session_state: text("session_state"),
	},
	(account) => [primaryKey({ columns: [account.provider, account.providerAccountId] })],
);

export const sessions = pgTable("sessions", {
	sessionToken: text("session_token").primaryKey(),
	userId: uuid("user_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
	"verification_tokens",
	{
		identifier: text("identifier").notNull(),
		token: text("token").notNull(),
		expires: timestamp("expires", { mode: "date" }).notNull(),
	},
	(vt) => [primaryKey({ columns: [vt.identifier, vt.token] })],
);

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
		userId: uuid("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
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
		userId: uuid("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		addressId: uuid("address_id")
			.notNull()
			.references(() => addresses.id, { onDelete: "cascade" }),
		addressType: text("address_type").notNull(), // 'shipping' | 'billing'
		isDefault: boolean("is_default").default(false).notNull(),
	},
	(t) => [primaryKey({ columns: [t.userId, t.addressId, t.addressType] })],
);

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
	vendor: one(vendors, {
		fields: [users.vendorId],
		references: [vendors.id],
	}),
	accounts: many(accounts),
	sessions: many(sessions),
	userAddresses: many(userAddresses),
	customerGroupUsers: many(customerGroupUsers),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
	user: one(users, {
		fields: [accounts.userId],
		references: [users.id],
	}),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
	user: one(users, {
		fields: [sessions.userId],
		references: [users.id],
	}),
}));

export const vendorsRelations = relations(vendors, ({ many }) => ({
	users: many(users),
}));

export const customerGroupsRelations = relations(customerGroups, ({ many }) => ({
	customerGroupUsers: many(customerGroupUsers),
}));

export const customerGroupUsersRelations = relations(customerGroupUsers, ({ one }) => ({
	customerGroup: one(customerGroups, {
		fields: [customerGroupUsers.customerGroupId],
		references: [customerGroups.id],
	}),
	user: one(users, {
		fields: [customerGroupUsers.userId],
		references: [users.id],
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
	user: one(users, {
		fields: [userAddresses.userId],
		references: [users.id],
	}),
	address: one(addresses, {
		fields: [userAddresses.addressId],
		references: [addresses.id],
	}),
}));
