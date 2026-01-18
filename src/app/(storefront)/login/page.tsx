"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
	const router = useRouter();
	const [error, setError] = useState<string>("");
	const [isPending, setIsPending] = useState(false);

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setError("");
		setIsPending(true);

		const formData = new FormData(e.currentTarget);
		const email = formData.get("email") as string;
		const password = formData.get("password") as string;

		if (!email || !password) {
			setError("Email and password are required");
			setIsPending(false);
			return;
		}

		try {
			const result = await authClient.signIn.email({
				email: email.toLowerCase(),
				password,
			});

			if (result.error) {
				setError(result.error.message || "Invalid email or password");
				setIsPending(false);
			} else {
				// Successfully logged in, redirect
				router.push("/");
				router.refresh();
			}
		} catch (err) {
			console.error("Login error:", err);
			setError("An error occurred during login");
			setIsPending(false);
		}
	}

	return (
		<div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-950">
			<Card className="w-full max-w-md">
				<CardHeader className="space-y-1">
					<CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
					<CardDescription>Sign in to your account</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="space-y-4">
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
							<div className="flex items-center justify-between">
								<Label htmlFor="password">Password</Label>
								<Link
									href="/forgot-password"
									className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
								>
									Forgot password?
								</Link>
							</div>
							<Input
								id="password"
								name="password"
								type="password"
								placeholder="••••••••"
								required
								disabled={isPending}
							/>
						</div>

						{error && (
							<div className="rounded-md bg-red-50 p-3 text-sm text-red-800 dark:bg-red-950 dark:text-red-200">
								{error}
							</div>
						)}

						<Button type="submit" className="w-full" disabled={isPending}>
							{isPending ? "Signing in..." : "Sign in"}
						</Button>
					</form>

					<div className="mt-4 text-center text-sm">
						Don't have an account?{" "}
						<Link
							href="/register"
							className="font-medium text-blue-600 hover:underline dark:text-blue-400"
						>
							Sign up
						</Link>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
