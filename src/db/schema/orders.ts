import { relations } from "drizzle-orm";
import {
	boolean,
	decimal,
	integer,
	jsonb,
	pgEnum,
	pgTable,
	primaryKey,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";
import { products } from "./catalog";
import { users, vendors } from "./users";

// Enums
export const orderStatusEnum = pgEnum("order_status", [
	"new",
	"pending_payment",
	"processing",
	"shipped",
	"delivered",
	"completed",
	"cancelled",
	"refunded",
]);

export const paymentStatusEnum = pgEnum("payment_status", [
	"pending",
	"processing",
	"completed",
	"failed",
	"refunded",
]);

export const shipmentStatusEnum = pgEnum("shipment_status", [
	"pending",
	"shipped",
	"in_transit",
	"delivered",
	"returned",
]);

// Cart Items
export const cartItems = pgTable("cart_items", {
	id: uuid("id").defaultRandom().primaryKey(),
	userId: uuid("user_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	productId: uuid("product_id")
		.notNull()
		.references(() => products.id, { onDelete: "cascade" }),
	quantity: integer("quantity").default(1).notNull(),
	optionCombinationId: uuid("option_combination_id"),
	createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

// Wishlist
export const wishlistItems = pgTable(
	"wishlist_items",
	{
		userId: uuid("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		productId: uuid("product_id")
			.notNull()
			.references(() => products.id, { onDelete: "cascade" }),
		createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
	},
	(t) => [primaryKey({ columns: [t.userId, t.productId] })],
);

// Orders
export const orders = pgTable("orders", {
	id: uuid("id").defaultRandom().primaryKey(),
	orderNumber: text("order_number").unique().notNull(),
	customerId: uuid("customer_id")
		.notNull()
		.references(() => users.id),
	vendorId: uuid("vendor_id").references(() => vendors.id),
	status: orderStatusEnum("status").default("new").notNull(),
	couponCode: text("coupon_code"),
	couponRuleName: text("coupon_rule_name"),
	discountAmount: decimal("discount_amount", { precision: 18, scale: 2 }).default("0"),
	subtotal: decimal("subtotal", { precision: 18, scale: 2 }).notNull(),
	subtotalWithDiscount: decimal("subtotal_with_discount", { precision: 18, scale: 2 }).notNull(),
	shippingMethod: text("shipping_method"),
	shippingFeeAmount: decimal("shipping_fee_amount", { precision: 18, scale: 2 }).default("0"),
	taxAmount: decimal("tax_amount", { precision: 18, scale: 2 }).default("0"),
	orderTotal: decimal("order_total", { precision: 18, scale: 2 }).notNull(),
	paymentMethod: text("payment_method"),
	paymentFeeAmount: decimal("payment_fee_amount", { precision: 18, scale: 2 }).default("0"),
	shippingAddress: jsonb("shipping_address"),
	billingAddress: jsonb("billing_address"),
	orderNote: text("order_note"),
	parentId: uuid("parent_id"),
	isMasterOrder: boolean("is_master_order").default(false).notNull(),
	createdById: uuid("created_by_id").references(() => users.id),
	updatedById: uuid("updated_by_id").references(() => users.id),
	createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

// Order Items
export const orderItems = pgTable("order_items", {
	id: uuid("id").defaultRandom().primaryKey(),
	orderId: uuid("order_id")
		.notNull()
		.references(() => orders.id, { onDelete: "cascade" }),
	productId: uuid("product_id")
		.notNull()
		.references(() => products.id),
	productName: text("product_name").notNull(),
	productSku: text("product_sku"),
	productPrice: decimal("product_price", { precision: 18, scale: 2 }).notNull(),
	quantity: integer("quantity").notNull(),
	discountAmount: decimal("discount_amount", { precision: 18, scale: 2 }).default("0"),
	taxAmount: decimal("tax_amount", { precision: 18, scale: 2 }).default("0"),
	optionCombination: jsonb("option_combination"),
});

// Order History
export const orderHistory = pgTable("order_history", {
	id: uuid("id").defaultRandom().primaryKey(),
	orderId: uuid("order_id")
		.notNull()
		.references(() => orders.id, { onDelete: "cascade" }),
	oldStatus: orderStatusEnum("old_status"),
	newStatus: orderStatusEnum("new_status").notNull(),
	note: text("note"),
	createdById: uuid("created_by_id").references(() => users.id),
	createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

// Payments
export const payments = pgTable("payments", {
	id: uuid("id").defaultRandom().primaryKey(),
	orderId: uuid("order_id")
		.notNull()
		.references(() => orders.id, { onDelete: "cascade" }),
	amount: decimal("amount", { precision: 18, scale: 2 }).notNull(),
	paymentFee: decimal("payment_fee", { precision: 18, scale: 2 }).default("0"),
	paymentMethod: text("payment_method").notNull(),
	gatewayTransactionId: text("gateway_transaction_id"),
	status: paymentStatusEnum("status").default("pending").notNull(),
	failureMessage: text("failure_message"),
	createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

// Warehouses
export const warehouses = pgTable("warehouses", {
	id: uuid("id").defaultRandom().primaryKey(),
	name: text("name").notNull(),
	address: text("address"),
	vendorId: uuid("vendor_id").references(() => vendors.id),
	isActive: boolean("is_active").default(true).notNull(),
	createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

// Stock
export const stocks = pgTable(
	"stocks",
	{
		productId: uuid("product_id")
			.notNull()
			.references(() => products.id, { onDelete: "cascade" }),
		warehouseId: uuid("warehouse_id")
			.notNull()
			.references(() => warehouses.id, { onDelete: "cascade" }),
		quantity: integer("quantity").default(0).notNull(),
		reservedQuantity: integer("reserved_quantity").default(0).notNull(),
		updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
	},
	(t) => [primaryKey({ columns: [t.productId, t.warehouseId] })],
);

// Stock History
export const stockHistory = pgTable("stock_history", {
	id: uuid("id").defaultRandom().primaryKey(),
	productId: uuid("product_id")
		.notNull()
		.references(() => products.id, { onDelete: "cascade" }),
	warehouseId: uuid("warehouse_id")
		.notNull()
		.references(() => warehouses.id, { onDelete: "cascade" }),
	adjustedQuantity: integer("adjusted_quantity").notNull(),
	note: text("note"),
	createdById: uuid("created_by_id").references(() => users.id),
	createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

// Shipments
export const shipments = pgTable("shipments", {
	id: uuid("id").defaultRandom().primaryKey(),
	orderId: uuid("order_id")
		.notNull()
		.references(() => orders.id, { onDelete: "cascade" }),
	warehouseId: uuid("warehouse_id").references(() => warehouses.id),
	vendorId: uuid("vendor_id").references(() => vendors.id),
	trackingNumber: text("tracking_number"),
	status: shipmentStatusEnum("status").default("pending").notNull(),
	createdById: uuid("created_by_id").references(() => users.id),
	createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

// Shipment Items
export const shipmentItems = pgTable("shipment_items", {
	id: uuid("id").defaultRandom().primaryKey(),
	shipmentId: uuid("shipment_id")
		.notNull()
		.references(() => shipments.id, { onDelete: "cascade" }),
	orderItemId: uuid("order_item_id")
		.notNull()
		.references(() => orderItems.id, { onDelete: "cascade" }),
	quantity: integer("quantity").notNull(),
});

// Pricing - Cart Rules (Coupons)
export const cartRules = pgTable("cart_rules", {
	id: uuid("id").defaultRandom().primaryKey(),
	name: text("name").notNull(),
	couponCode: text("coupon_code").unique(),
	description: text("description"),
	isActive: boolean("is_active").default(true).notNull(),
	startDate: timestamp("start_date", { mode: "date" }),
	endDate: timestamp("end_date", { mode: "date" }),
	isCouponCodeRequired: boolean("is_coupon_code_required").default(true).notNull(),
	discountType: text("discount_type").notNull(), // 'fixed' | 'percentage'
	discountAmount: decimal("discount_amount", { precision: 18, scale: 2 }).notNull(),
	minOrderAmount: decimal("min_order_amount", { precision: 18, scale: 2 }),
	maxOrderAmount: decimal("max_order_amount", { precision: 18, scale: 2 }),
	maxUsagePerCoupon: integer("max_usage_per_coupon"),
	maxUsagePerCustomer: integer("max_usage_per_customer"),
	usageCount: integer("usage_count").default(0).notNull(),
	createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

// Cart Rule Usage
export const cartRuleUsages = pgTable("cart_rule_usages", {
	id: uuid("id").defaultRandom().primaryKey(),
	cartRuleId: uuid("cart_rule_id")
		.notNull()
		.references(() => cartRules.id, { onDelete: "cascade" }),
	couponCode: text("coupon_code"),
	userId: uuid("user_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	orderId: uuid("order_id").references(() => orders.id),
	createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

// Shipping Providers
export const shippingProviders = pgTable("shipping_providers", {
	id: uuid("id").defaultRandom().primaryKey(),
	name: text("name").notNull(),
	code: text("code").unique().notNull(),
	description: text("description"),
	isEnabled: boolean("is_enabled").default(true).notNull(),
	configData: jsonb("config_data"),
	displayOrder: integer("display_order").default(0).notNull(),
});

// Tax Rates
export const taxRates = pgTable("tax_rates", {
	id: uuid("id").defaultRandom().primaryKey(),
	taxClassId: uuid("tax_class_id").notNull(),
	countryId: uuid("country_id").notNull(),
	stateOrProvinceId: uuid("state_or_province_id"),
	rate: decimal("rate", { precision: 8, scale: 4 }).notNull(),
	zipCode: text("zip_code"),
	createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

// Relations
export const cartItemsRelations = relations(cartItems, ({ one }) => ({
	user: one(users, {
		fields: [cartItems.userId],
		references: [users.id],
	}),
	product: one(products, {
		fields: [cartItems.productId],
		references: [products.id],
	}),
}));

export const wishlistItemsRelations = relations(wishlistItems, ({ one }) => ({
	user: one(users, {
		fields: [wishlistItems.userId],
		references: [users.id],
	}),
	product: one(products, {
		fields: [wishlistItems.productId],
		references: [products.id],
	}),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
	customer: one(users, {
		fields: [orders.customerId],
		references: [users.id],
		relationName: "orderCustomer",
	}),
	vendor: one(vendors, {
		fields: [orders.vendorId],
		references: [vendors.id],
	}),
	parent: one(orders, {
		fields: [orders.parentId],
		references: [orders.id],
		relationName: "orderParentChild",
	}),
	children: many(orders, { relationName: "orderParentChild" }),
	createdBy: one(users, {
		fields: [orders.createdById],
		references: [users.id],
		relationName: "orderCreatedBy",
	}),
	updatedBy: one(users, {
		fields: [orders.updatedById],
		references: [users.id],
		relationName: "orderUpdatedBy",
	}),
	items: many(orderItems),
	history: many(orderHistory),
	payments: many(payments),
	shipments: many(shipments),
}));

export const orderItemsRelations = relations(orderItems, ({ one, many }) => ({
	order: one(orders, {
		fields: [orderItems.orderId],
		references: [orders.id],
	}),
	product: one(products, {
		fields: [orderItems.productId],
		references: [products.id],
	}),
	shipmentItems: many(shipmentItems),
}));

export const orderHistoryRelations = relations(orderHistory, ({ one }) => ({
	order: one(orders, {
		fields: [orderHistory.orderId],
		references: [orders.id],
	}),
	createdBy: one(users, {
		fields: [orderHistory.createdById],
		references: [users.id],
	}),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
	order: one(orders, {
		fields: [payments.orderId],
		references: [orders.id],
	}),
}));

export const warehousesRelations = relations(warehouses, ({ one, many }) => ({
	vendor: one(vendors, {
		fields: [warehouses.vendorId],
		references: [vendors.id],
	}),
	stocks: many(stocks),
	stockHistory: many(stockHistory),
	shipments: many(shipments),
}));

export const stocksRelations = relations(stocks, ({ one }) => ({
	product: one(products, {
		fields: [stocks.productId],
		references: [products.id],
	}),
	warehouse: one(warehouses, {
		fields: [stocks.warehouseId],
		references: [warehouses.id],
	}),
}));

export const stockHistoryRelations = relations(stockHistory, ({ one }) => ({
	product: one(products, {
		fields: [stockHistory.productId],
		references: [products.id],
	}),
	warehouse: one(warehouses, {
		fields: [stockHistory.warehouseId],
		references: [warehouses.id],
	}),
	createdBy: one(users, {
		fields: [stockHistory.createdById],
		references: [users.id],
	}),
}));

export const shipmentsRelations = relations(shipments, ({ one, many }) => ({
	order: one(orders, {
		fields: [shipments.orderId],
		references: [orders.id],
	}),
	warehouse: one(warehouses, {
		fields: [shipments.warehouseId],
		references: [warehouses.id],
	}),
	vendor: one(vendors, {
		fields: [shipments.vendorId],
		references: [vendors.id],
	}),
	createdBy: one(users, {
		fields: [shipments.createdById],
		references: [users.id],
	}),
	items: many(shipmentItems),
}));

export const shipmentItemsRelations = relations(shipmentItems, ({ one }) => ({
	shipment: one(shipments, {
		fields: [shipmentItems.shipmentId],
		references: [shipments.id],
	}),
	orderItem: one(orderItems, {
		fields: [shipmentItems.orderItemId],
		references: [orderItems.id],
	}),
}));

export const cartRulesRelations = relations(cartRules, ({ many }) => ({
	usages: many(cartRuleUsages),
}));

export const cartRuleUsagesRelations = relations(cartRuleUsages, ({ one }) => ({
	cartRule: one(cartRules, {
		fields: [cartRuleUsages.cartRuleId],
		references: [cartRules.id],
	}),
	user: one(users, {
		fields: [cartRuleUsages.userId],
		references: [users.id],
	}),
	order: one(orders, {
		fields: [cartRuleUsages.orderId],
		references: [orders.id],
	}),
}));
