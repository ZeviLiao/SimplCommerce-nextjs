"use client";

import { ArrowLeft, Image as ImageIcon, Loader2, Save, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { createProduct, type ProductState, updateProduct } from "@/actions/admin/products";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { brands, categories, products, taxClasses } from "@/db/schema";

interface ProductFormProps {
	// 使用 Drizzle 的型別推斷，確保與資料庫結構一致
	initialData?: typeof products.$inferSelect & {
		productCategories?: Array<{ categoryId: string }>;
	};
	categories?: (typeof categories.$inferSelect)[];
	brands?: (typeof brands.$inferSelect)[];
	taxClasses?: (typeof taxClasses.$inferSelect)[];
}

export function ProductForm({
	initialData,
	categories: availableCategories = [],
	brands: availableBrands = [],
	taxClasses: availableTaxClasses = [],
}: ProductFormProps) {
	const initialState: ProductState = { message: null, errors: {} };

	// 根據是否有 initialData 決定使用 create 還是 update action
	const action = initialData ? updateProduct.bind(null, initialData.id) : createProduct;

	const [state, formAction, isPending] = useActionState(action, initialState);

	// 用於 Slug 自動生成的簡單狀態
	const [name, setName] = useState(initialData?.name || "");
	const [slug, setSlug] = useState(initialData?.slug || "");
	const [isSlugEdited, setIsSlugEdited] = useState(!!initialData?.slug);
	const [previewImage, setPreviewImage] = useState<string | null>(
		initialData?.thumbnailImageUrl || null,
	);

	// 當名稱改變且 Slug 未被手動編輯過時，自動生成 Slug
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

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const url = URL.createObjectURL(file);
			setPreviewImage(url);
		}
	};

	return (
		<form action={formAction} className="space-y-8 max-w-5xl mx-auto">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-4">
					<Button variant="outline" size="icon" asChild>
						<Link href="/admin/products">
							<ArrowLeft className="h-4 w-4" />
						</Link>
					</Button>
					<div>
						<h1 className="text-2xl font-bold tracking-tight">
							{initialData ? "編輯商品" : "新增商品"}
						</h1>
						<p className="text-sm text-muted-foreground">填寫以下資訊以建立新商品。</p>
					</div>
				</div>
				<div className="flex items-center gap-2">
					<Button type="button" variant="outline" asChild>
						<Link href="/admin/products">取消</Link>
					</Button>
					<Button type="submit" disabled={isPending}>
						{isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
						<Save className="mr-2 h-4 w-4" />
						儲存商品
					</Button>
				</div>
			</div>

			{state.message && (
				<div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
					{state.message}
				</div>
			)}

			<div className="grid gap-6 md:grid-cols-3">
				{/* 左側主要資訊 */}
				<div className="md:col-span-2 space-y-6">
					<Card>
						<CardHeader>
							<CardTitle>基本資訊</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="name">
									商品名稱 <span className="text-destructive">*</span>
								</Label>
								<Input
									id="name"
									name="name"
									placeholder="例如：純棉 T-Shirt"
									value={name}
									onChange={(e) => setName(e.target.value)}
									required
								/>
								{state.errors?.name && (
									<p className="text-sm text-destructive">{state.errors.name}</p>
								)}
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
									placeholder="product-name-slug"
									required
								/>
								{state.errors?.slug && (
									<p className="text-sm text-destructive">{state.errors.slug}</p>
								)}
							</div>

							<div className="space-y-2">
								<Label htmlFor="shortDescription">簡短描述</Label>
								<Textarea
									id="shortDescription"
									name="shortDescription"
									defaultValue={initialData?.shortDescription ?? ""}
									placeholder="用於列表頁顯示的簡短介紹"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="description">完整描述</Label>
								<Textarea
									id="description"
									name="description"
									defaultValue={initialData?.description ?? ""}
									className="min-h-[150px]"
									placeholder="商品的詳細介紹..."
								/>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* 右側設定與價格 */}
				<div className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle>商品圖片</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="space-y-4">
								<div className="flex items-center justify-center w-full">
									{previewImage ? (
										<div className="relative w-full aspect-square rounded-md overflow-hidden border">
											<Image src={previewImage} alt="Preview" fill className="object-cover" />
											<Button
												type="button"
												variant="destructive"
												size="icon"
												className="absolute top-2 right-2 h-6 w-6"
												onClick={() => {
													setPreviewImage(null);
													// 注意：這裡僅清除預覽，實際清除後端欄位需要更複雜的邏輯，
													// 這裡假設使用者會上傳新圖或保持原樣
												}}
											>
												<X className="h-3 w-3" />
											</Button>
										</div>
									) : (
										<Label
											htmlFor="thumbnailImage"
											className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50"
										>
											<div className="flex flex-col items-center justify-center pt-5 pb-6">
												<ImageIcon className="w-8 h-8 mb-2 text-muted-foreground" />
												<p className="text-sm text-muted-foreground">點擊上傳圖片</p>
											</div>
											<Input
												id="thumbnailImage"
												name="thumbnailImage"
												type="file"
												accept="image/*"
												className="hidden"
												onChange={handleImageChange}
											/>
										</Label>
									)}
								</div>
								{/* 隱藏欄位用於傳遞舊圖片 URL，以便在未上傳新圖時保留 */}
								<input
									type="hidden"
									name="existingThumbnailImageUrl"
									value={initialData?.thumbnailImageUrl || ""}
								/>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>價格與庫存</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="price">
									價格 <span className="text-destructive">*</span>
								</Label>
								<div className="relative">
									<span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
									<Input
										id="price"
										name="price"
										type="number"
										step="0.01"
										min="0"
										className="pl-7"
										placeholder="0.00"
										defaultValue={initialData?.price ?? ""}
										required
									/>
								</div>
								{state.errors?.price && (
									<p className="text-sm text-destructive">{state.errors.price}</p>
								)}
							</div>

							<div className="space-y-2">
								<Label htmlFor="oldPrice">原價 (選填)</Label>
								<div className="relative">
									<span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
									<Input
										id="oldPrice"
										name="oldPrice"
										type="number"
										step="0.01"
										min="0"
										className="pl-7"
										placeholder="0.00"
										defaultValue={initialData?.oldPrice ?? ""}
									/>
								</div>
								<p className="text-xs text-muted-foreground">用於顯示劃線價格</p>
							</div>

							<div className="space-y-2">
								<Label htmlFor="specialPrice">特價 (選填)</Label>
								<div className="relative">
									<span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
									<Input
										id="specialPrice"
										name="specialPrice"
										type="number"
										step="0.01"
										min="0"
										className="pl-7"
										placeholder="0.00"
										defaultValue={initialData?.specialPrice ?? ""}
									/>
								</div>
								<p className="text-xs text-muted-foreground">若設定，將優先顯示特價</p>
							</div>

							<div className="space-y-2">
								<Label htmlFor="sku">SKU (貨號)</Label>
								<Input
									id="sku"
									name="sku"
									placeholder="PROD-001"
									defaultValue={initialData?.sku ?? ""}
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="stockQuantity">
									庫存數量 <span className="text-destructive">*</span>
								</Label>
								<Input
									id="stockQuantity"
									name="stockQuantity"
									type="number"
									min="0"
									defaultValue={initialData?.stockQuantity ?? 0}
									required
								/>
								{state.errors?.stockQuantity && (
									<p className="text-sm text-destructive">{state.errors.stockQuantity}</p>
								)}
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>品牌與稅務</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="brandId">品牌</Label>
								<select
									id="brandId"
									name="brandId"
									className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
									defaultValue={initialData?.brandId || ""}
								>
									<option value="">無品牌</option>
									{availableBrands.map((brand) => (
										<option key={brand.id} value={brand.id}>
											{brand.name}
										</option>
									))}
								</select>
							</div>

							<div className="space-y-2">
								<Label htmlFor="taxClassId">稅務分類</Label>
								<select
									id="taxClassId"
									name="taxClassId"
									className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
									defaultValue={initialData?.taxClassId || ""}
								>
									<option value="">無稅務分類</option>
									{availableTaxClasses.map((taxClass) => (
										<option key={taxClass.id} value={taxClass.id}>
											{taxClass.name}
										</option>
									))}
								</select>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>狀態設定</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="flex items-center space-x-2">
								<Checkbox
									id="isPublished"
									name="isPublished"
									defaultChecked={initialData?.isPublished}
								/>
								<Label htmlFor="isPublished" className="cursor-pointer">
									已發布 (前台可見)
								</Label>
							</div>

							<div className="flex items-center space-x-2">
								<Checkbox
									id="isAllowToOrder"
									name="isAllowToOrder"
									defaultChecked={initialData?.isAllowToOrder ?? true}
								/>
								<Label htmlFor="isAllowToOrder" className="cursor-pointer">
									開放訂購
								</Label>
							</div>

							<div className="flex items-center space-x-2">
								<Checkbox
									id="isVisibleIndividually"
									name="isVisibleIndividually"
									defaultChecked={initialData?.isVisibleIndividually ?? true}
								/>
								<Label htmlFor="isVisibleIndividually" className="cursor-pointer">
									單獨顯示 (非組合商品)
								</Label>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>商品分類</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid gap-2 max-h-60 overflow-y-auto border rounded-md p-2">
								{availableCategories.map((category) => (
									<div key={category.id} className="flex items-center space-x-2">
										<Checkbox
											id={`category-${category.id}`}
											name="categoryIds"
											value={category.id}
											defaultChecked={initialData?.productCategories?.some(
												(c) => c.categoryId === category.id,
											)}
										/>
										<Label
											htmlFor={`category-${category.id}`}
											className="cursor-pointer font-normal"
										>
											{category.name}
										</Label>
									</div>
								))}
								{availableCategories.length === 0 && (
									<p className="text-sm text-muted-foreground text-center py-4">
										尚無分類，請先建立分類。
									</p>
								)}
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</form>
	);
}
