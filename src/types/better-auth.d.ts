import type { Session as BetterAuthSession } from "better-auth/types";

declare module "better-auth" {
	interface Session {
		user: BetterAuthSession["user"] & {
			role: "admin" | "vendor" | "customer";
			phone?: string | null;
			culture?: string | null;
			isDeleted: boolean;
			vendorId?: string | null;
			defaultShippingAddressId?: string | null;
			defaultBillingAddressId?: string | null;
		};
	}
}

declare module "better-auth/minimal" {
	interface Session {
		user: BetterAuthSession["user"] & {
			role: "admin" | "vendor" | "customer";
			phone?: string | null;
			culture?: string | null;
			isDeleted: boolean;
			vendorId?: string | null;
			defaultShippingAddressId?: string | null;
			defaultBillingAddressId?: string | null;
		};
	}
}
