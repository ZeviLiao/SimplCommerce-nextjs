"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { registerUser } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
	const router = useRouter();
	const [error, setError] = useState<string>("");
	const [isPending, startTransition] = useTransition();

	async function handleSubmit(formData: FormData) {
		setError("");

		startTransition(async () => {
			const result = await registerUser(formData);

			if (result.error) {
				setError(result.error);
			} else {
				router.push("/");
				router.refresh();
			}
		});
	}

	return (
		<div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-950">
			<Card className="w-full max-w-md">
				<CardHeader className="space-y-1">
					<CardTitle className="text-2xl font-bold">Create an account</CardTitle>
					<CardDescription>Enter your information to get started</CardDescription>
				</CardHeader>
				<CardContent>
					<form action={handleSubmit} className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="name">Name</Label>
							<Input
								id="name"
								name="name"
								type="text"
								placeholder="John Doe"
								required
								disabled={isPending}
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								name="email"
								type="email"
								placeholder="john@example.com"
								required
								disabled={isPending}
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="password">Password</Label>
							<Input
								id="password"
								name="password"
								type="password"
								placeholder="••••••••"
								required
								minLength={8}
								disabled={isPending}
							/>
							<p className="text-xs text-gray-500 dark:text-gray-400">
								Must be at least 8 characters
							</p>
						</div>

						{error && (
							<div className="rounded-md bg-red-50 p-3 text-sm text-red-800 dark:bg-red-950 dark:text-red-200">
								{error}
							</div>
						)}

						<Button type="submit" className="w-full" disabled={isPending}>
							{isPending ? "Creating account..." : "Create account"}
						</Button>
					</form>

					<div className="mt-4 text-center text-sm">
						Already have an account?{" "}
						<Link
							href="/login"
							className="font-medium text-blue-600 hover:underline dark:text-blue-400"
						>
							Sign in
						</Link>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
