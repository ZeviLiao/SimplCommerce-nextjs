import type { Metadata } from "next";
import { ChangePasswordForm } from "@/components/account/change-password-form";

export const metadata: Metadata = {
	title: "Change Password",
	description: "Change your account password",
};

export default function ChangePasswordPage() {
	return (
		<div>
			<h1 className="text-2xl font-bold mb-6">Change Password</h1>
			<ChangePasswordForm />
		</div>
	);
}
