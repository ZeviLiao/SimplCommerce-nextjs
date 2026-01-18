import { eq } from "drizzle-orm";
import { ProfileForm } from "@/components/account/profile-form";
import { db } from "@/db";
import { users } from "@/db/schema";
import { auth } from "@/lib/auth";

export default async function ProfilePage() {
	const session = await auth();

	if (!session?.user?.id) {
		return null;
	}

	const user = await db.query.users.findFirst({
		where: eq(users.id, session.user.id),
		columns: {
			name: true,
			email: true,
			phone: true,
		},
	});

	if (!user) {
		return null;
	}

	return <ProfileForm user={user} />;
}
