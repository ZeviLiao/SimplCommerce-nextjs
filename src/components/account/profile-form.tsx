"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { changePassword, updateProfile } from "@/actions/profile";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ProfileFormProps {
	user: {
		name: string | null;
		email: string | null;
		phone: string | null;
	};
}

export function ProfileForm({ user }: ProfileFormProps) {
	const router = useRouter();
	const [profileError, setProfileError] = useState("");
	const [profileSuccess, setProfileSuccess] = useState(false);
	const [passwordError, setPasswordError] = useState("");
	const [passwordSuccess, setPasswordSuccess] = useState(false);
	const [isPending, startTransition] = useTransition();

	async function handleProfileUpdate(formData: FormData) {
		setProfileError("");
		setProfileSuccess(false);

		startTransition(async () => {
			const result = await updateProfile(formData);

			if (result.error) {
				setProfileError(result.error);
			} else {
				setProfileSuccess(true);
				router.refresh();
			}
		});
	}

	async function handlePasswordChange(formData: FormData) {
		setPasswordError("");
		setPasswordSuccess(false);

		startTransition(async () => {
			const result = await changePassword(formData);

			if (result.error) {
				setPasswordError(result.error);
			} else {
				setPasswordSuccess(true);
				const form = document.getElementById("password-form") as HTMLFormElement;
				form?.reset();
			}
		});
	}

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>Profile Information</CardTitle>
					<CardDescription>Update your personal information</CardDescription>
				</CardHeader>
				<CardContent>
					<form action={handleProfileUpdate} className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="name">Name</Label>
							<Input
								id="name"
								name="name"
								type="text"
								defaultValue={user.name || ""}
								required
								disabled={isPending}
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								defaultValue={user.email || ""}
								disabled
								className="bg-gray-100 dark:bg-gray-800"
							/>
							<p className="text-xs text-gray-500">Email cannot be changed</p>
						</div>

						<div className="space-y-2">
							<Label htmlFor="phone">Phone</Label>
							<Input
								id="phone"
								name="phone"
								type="tel"
								defaultValue={user.phone || ""}
								disabled={isPending}
							/>
						</div>

						{profileError && (
							<div className="rounded-md bg-red-50 p-3 text-sm text-red-800 dark:bg-red-950 dark:text-red-200">
								{profileError}
							</div>
						)}

						{profileSuccess && (
							<div className="rounded-md bg-green-50 p-3 text-sm text-green-800 dark:bg-green-950 dark:text-green-200">
								Profile updated successfully
							</div>
						)}

						<Button type="submit" disabled={isPending}>
							{isPending ? "Saving..." : "Save Changes"}
						</Button>
					</form>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Change Password</CardTitle>
					<CardDescription>Update your password to keep your account secure</CardDescription>
				</CardHeader>
				<CardContent>
					<form id="password-form" action={handlePasswordChange} className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="currentPassword">Current Password</Label>
							<Input
								id="currentPassword"
								name="currentPassword"
								type="password"
								required
								disabled={isPending}
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="newPassword">New Password</Label>
							<Input
								id="newPassword"
								name="newPassword"
								type="password"
								minLength={8}
								required
								disabled={isPending}
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="confirmPassword">Confirm New Password</Label>
							<Input
								id="confirmPassword"
								name="confirmPassword"
								type="password"
								minLength={8}
								required
								disabled={isPending}
							/>
						</div>

						{passwordError && (
							<div className="rounded-md bg-red-50 p-3 text-sm text-red-800 dark:bg-red-950 dark:text-red-200">
								{passwordError}
							</div>
						)}

						{passwordSuccess && (
							<div className="rounded-md bg-green-50 p-3 text-sm text-green-800 dark:bg-green-950 dark:text-green-200">
								Password changed successfully
							</div>
						)}

						<Button type="submit" disabled={isPending}>
							{isPending ? "Changing..." : "Change Password"}
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
