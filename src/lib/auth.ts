import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { betterAuth } from "better-auth/minimal";
import { admin } from "better-auth/plugins/admin";
import { db } from "@/db";
import * as schema from "@/db/schema";

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg",
		schema: {
			user: schema.user,
			session: schema.session,
			account: schema.account,
			verification: schema.verification,
		},
	}),
	user: {
		additionalFields: {
			role: {
				type: "string",
				required: true,
				defaultValue: "customer",
			},
			phone: {
				type: "string",
				required: false,
			},
			culture: {
				type: "string",
				required: false,
			},
			isDeleted: {
				type: "boolean",
				required: true,
				defaultValue: false,
			},
			vendorId: {
				type: "string",
				required: false,
			},
			defaultShippingAddressId: {
				type: "string",
				required: false,
			},
			defaultBillingAddressId: {
				type: "string",
				required: false,
			},
		},
	},
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: false,
	},
	socialProviders: {
		google: {
			clientId: process.env.GOOGLE_CLIENT_ID || "",
			clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
			enabled: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
		},
		github: {
			clientId: process.env.GITHUB_CLIENT_ID || "",
			clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
			enabled: !!(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET),
		},
	},
	plugins: [
		admin({
			defaultRole: "customer",
		}),
	],
	session: {
		cookieCache: {
			enabled: true,
			maxAge: 5 * 60, // 5 minutes
		},
	},
});

export type Session = typeof auth.$Infer.Session;

export type AuthUser = {
	id: string;
	email: string;
	name: string;
	emailVerified: boolean;
	image?: string | null;
	createdAt: Date;
	updatedAt: Date;
	banned: boolean;
	banReason?: string | null;
	banExpires?: Date | null;
	role: "admin" | "vendor" | "customer";
	phone?: string | null;
	culture?: string | null;
	isDeleted: boolean;
	vendorId?: string | null;
	defaultShippingAddressId?: string | null;
	defaultBillingAddressId?: string | null;
};

export type AuthSession = {
	user: AuthUser;
	session: {
		id: string;
		userId: string;
		expiresAt: Date;
		token: string;
		ipAddress?: string;
		userAgent?: string;
		createdAt: Date;
		updatedAt: Date;
	};
};
