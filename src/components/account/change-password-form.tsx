"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { changePassword } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ChangePasswordForm() {
	const router = useRouter();
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);
	const [loading, setLoading] = useState(false);

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setError(null);
		setSuccess(false);
		setLoading(true);

		const formData = new FormData(e.currentTarget);
		const oldPassword = formData.get("oldPassword") as string;
		const newPassword = formData.get("newPassword") as string;
		const confirmPassword = formData.get("confirmPassword") as string;

		// Validate passwords match
		if (newPassword !== confirmPassword) {
			setError("The new password and confirmation password do not match.");
			setLoading(false);
			return;
		}

		// Validate password length
		if (newPassword.length < 6) {
			setError("The password must be at least 6 characters long.");
			setLoading(false);
			return;
		}

		try {
			const result = await changePassword(oldPassword, newPassword);

			if (result.success) {
				setSuccess(true);
				// Reset form
				(e.target as HTMLFormElement).reset();
				// Redirect to account page after 2 seconds
				setTimeout(() => {
					router.push("/account");
				}, 2000);
			} else {
				setError(result.error || "Failed to change password");
			}
		} catch (_err) {
			setError("An error occurred. Please try again.");
		} finally {
			setLoading(false);
		}
	}

	return (
		<Card className="max-w-md">
			<CardHeader>
				<CardTitle>Change Password</CardTitle>
				<CardDescription>Enter your current password and choose a new one</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="oldPassword">Current Password</Label>
						<Input
							id="oldPassword"
							name="oldPassword"
							type="password"
							required
							disabled={loading}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="newPassword">New Password</Label>
						<Input
							id="newPassword"
							name="newPassword"
							type="password"
							required
							minLength={6}
							disabled={loading}
						/>
						<p className="text-sm text-muted-foreground">
							Password must be at least 6 characters long
						</p>
					</div>

					<div className="space-y-2">
						<Label htmlFor="confirmPassword">Confirm New Password</Label>
						<Input
							id="confirmPassword"
							name="confirmPassword"
							type="password"
							required
							minLength={6}
							disabled={loading}
						/>
					</div>

					{error && (
						<div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">{error}</div>
					)}

					{success && (
						<div className="bg-green-50 text-green-700 text-sm p-3 rounded-md">
							Your password has been changed successfully. Redirecting...
						</div>
					)}

					<div className="flex gap-4">
						<Button type="submit" disabled={loading}>
							{loading ? "Changing..." : "Change Password"}
						</Button>
						<Button
							type="button"
							variant="outline"
							onClick={() => router.push("/account")}
							disabled={loading}
						>
							Cancel
						</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	);
}
