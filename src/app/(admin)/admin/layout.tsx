import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminNav } from "@/components/admin/admin-nav";
import { auth } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
	const session = await auth();

	if (!session?.user) {
		redirect("/login");
	}

	if (session.user.role !== "admin" && session.user.role !== "vendor") {
		redirect("/");
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<header className="sticky top-0 z-50 w-full border-b bg-white">
				<div className="container flex h-16 items-center justify-between">
					<div className="flex items-center gap-6">
						<Link href="/admin" className="text-xl font-bold">
							Admin Panel
						</Link>
						<AdminNav />
					</div>
					<Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
						Back to Store
					</Link>
				</div>
			</header>
			<main className="container py-8">{children}</main>
		</div>
	);
}
