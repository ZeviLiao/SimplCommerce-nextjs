"use client";

import { ArrowLeft, Loader2, Save } from "lucide-react";
import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { type CategoryState, createCategory, updateCategory } from "@/actions/admin/categories";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { categories } from "@/db/schema";

interface CategoryFormProps {
	initialData?: typeof categories.$inferSelect;
	availableParents?: (typeof categories.$inferSelect)[];
}

export function CategoryForm({ initialData, availableParents = [] }: CategoryFormProps) {
	const initialState: CategoryState = { message: null, errors: {} };

	const action = initialData ? updateCategory.bind(null, initialData.id) : createCategory;

	const [state, formAction, isPending] = useActionState(action, initialState);

	const [name, setName] = useState(initialData?.name || "");
	const [slug, setSlug] = useState(initialData?.slug || "");
	const [isSlugEdited, setIsSlugEdited] = useState(!!initialData?.slug);

	useEffect(() => {
		if (!isSlugEdited) {
			const generatedSlug = name
				.toLowerCase()
				.trim()
				.replace(/[^\w\s-]/g, "")
				.replace(/[\s_-]+/g, "-")
				.replace(/^-+|-+$/g, "");
			setSlug(generatedSlug);
		}
	}, [name, isSlugEdited]);

	return (
		<form action={formAction} className="space-y-8 max-w-3xl mx-auto">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-4">
					<Button variant="outline" size="icon" asChild>
						<Link href="/admin/categories">
							<ArrowLeft className="h-4 w-4" />
						</Link>
					</Button>
					<div>
						<h1 className="text-2xl font-bold tracking-tight">
							{initialData ? "編輯分類" : "新增分類"}
						</h1>
					</div>
				</div>
				<div className="flex items-center gap-2">
					<Button type="button" variant="outline" asChild>
						<Link href="/admin/categories">取消</Link>
					</Button>
					<Button type="submit" disabled={isPending}>
						{isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
						<Save className="mr-2 h-4 w-4" />
						儲存
					</Button>
				</div>
			</div>

			{state.message && (
				<div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
					{state.message}
				</div>
			)}

			<Card>
				<CardHeader>
					<CardTitle>分類資訊</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="name">
							分類名稱 <span className="text-destructive">*</span>
						</Label>
						<Input
							id="name"
							name="name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							required
						/>
						{state.errors?.name && <p className="text-sm text-destructive">{state.errors.name}</p>}
					</div>

					<div className="space-y-2">
						<Label htmlFor="slug">
							網址代稱 (Slug) <span className="text-destructive">*</span>
						</Label>
						<Input
							id="slug"
							name="slug"
							value={slug}
							onChange={(e) => {
								setSlug(e.target.value);
								setIsSlugEdited(true);
							}}
							required
						/>
						{state.errors?.slug && <p className="text-sm text-destructive">{state.errors.slug}</p>}
					</div>

					<div className="space-y-2">
						<Label htmlFor="parentId">父分類</Label>
						<select
							id="parentId"
							name="parentId"
							className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
							defaultValue={initialData?.parentId || ""}
						>
							<option value="">無 (頂層分類)</option>
							{availableParents.map((cat) => (
								<option key={cat.id} value={cat.id}>
									{cat.name}
								</option>
							))}
						</select>
					</div>

					<div className="space-y-2">
						<Label htmlFor="description">描述</Label>
						<Textarea
							id="description"
							name="description"
							defaultValue={initialData?.description || ""}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="displayOrder">顯示順序</Label>
						<Input
							id="displayOrder"
							name="displayOrder"
							type="number"
							defaultValue={initialData?.displayOrder || 0}
						/>
					</div>

					<div className="flex items-center space-x-2 pt-2">
						<Checkbox
							id="isPublished"
							name="isPublished"
							defaultChecked={initialData?.isPublished ?? true}
						/>
						<Label htmlFor="isPublished" className="cursor-pointer">
							已發布
						</Label>
					</div>
				</CardContent>
			</Card>
		</form>
	);
}
