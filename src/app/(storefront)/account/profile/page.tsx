import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { ProfileForm } from "@/components/account/profile-form";
import { db } from "@/db";
import { user as userTable } from "@/db/schema";
import { auth } from "@/lib/auth";

export default async function ProfilePage() {
	const session = await auth.api.getSession({ headers: await headers() });

	if (!session?.user?.id) {
		return null;
	}

	const userData = await db.query.user.findFirst({
		where: eq(userTable.id, session.user.id),
		columns: {
			name: true,
			email: true,
			phone: true,
		},
	});

	if (!userData) {
		return null;
	}

	return <ProfileForm user={userData} />;
}
