"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { loginUser } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
	const router = useRouter();
	const [error, setError] = useState<string>("");
	const [isPending, startTransition] = useTransition();

	async function handleSubmit(formData: FormData) {
		setError("");

		startTransition(async () => {
			const result = await loginUser(formData);

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
					<CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
					<CardDescription>Sign in to your account</CardDescription>
				</CardHeader>
				<CardContent>
					<form action={handleSubmit} className="space-y-4">
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
