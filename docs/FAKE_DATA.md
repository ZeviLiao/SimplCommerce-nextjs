# Fake Data 記錄

此文件記錄所有使用硬編碼（Fake Data）的功能，以便日後替換為真實資料。

> **原則**: 前台優先實作，遇到需要後台資料時暫時使用 Fake Data

---

## 🔴 需要替換的 Fake Data

### 1. 配送方式 (Shipping Methods)

**檔案**: `src/components/checkout/shipping-method.tsx`

**目前實作**:
```typescript
const shippingMethods = [
  { id: "standard", name: "Standard Shipping", price: 0, estimatedDays: "5-7 business days" },
  { id: "express", name: "Express Shipping", price: 15, estimatedDays: "2-3 business days" },
  { id: "overnight", name: "Overnight Shipping", price: 30, estimatedDays: "1 business day" },
];
```

**替換時機**: Phase B6 - 配送管理完成後

**真實來源**:
- 資料庫表: `shipping_providers`
- Server Action: `actions/shipping.ts::getShippingMethods()`
- 需整合: 依據地址、重量、體積計算運費

**TODO**:
```typescript
// TODO: Replace with real data from shipping_providers table
// Should fetch based on:
// - Shipping address (country, state)
// - Cart weight/volume
// - Shipping provider settings
```

---

### 2. 付款方式 (Payment Methods)

**檔案**: `src/components/checkout/payment-method.tsx`

**目前實作**:
```typescript
const paymentMethods = [
  { id: "cod", name: "Cash on Delivery", description: "Pay when you receive your order" },
  { id: "stripe", name: "Credit/Debit Card", description: "Pay securely with Stripe" },
  { id: "paypal", name: "PayPal", description: "Pay with your PayPal account" },
];
```

**替換時機**: Phase B8 - 付款管理完成後

**真實來源**:
- 資料庫表: `payment_providers` (尚未建立)
- Server Action: `actions/payment.ts::getPaymentMethods()` (尚未建立)
- 需整合: Stripe API, PayPal SDK

**TODO**:
```typescript
// TODO: Replace with real data from payment_providers table
// Should fetch only enabled payment methods
// Should include payment provider settings (API keys, etc.)
```

---

## 🟡 待使用 Fake Data（尚未實作）

### 3. 商品評論 (Product Reviews)

**預計檔案**:
- `src/components/products/product-reviews.tsx`
- `src/components/products/review-form.tsx`

**Fake Data 內容**:
- 評論列表（作者、評分、內容、日期）
- 平均評分

**替換時機**: Phase B12 - 評論管理完成後

**真實來源**:
- 資料庫表: `reviews`, `review_replies`
- Server Action: `actions/reviews.ts`

---

### 4. 最近瀏覽商品 (Recently Viewed Products)

**預計檔案**: `src/components/products/recently-viewed.tsx`

**Fake Data 內容**:
- 最近瀏覽的商品 ID 列表

**替換時機**: Phase A5

**真實來源**:
- 瀏覽器 localStorage 或
- 資料庫表: `recently_viewed_products` (需登入)
- Server Action: `actions/products.ts::trackProductView()`

---

### 5. 首頁輪播圖 (Homepage Carousel)

**預計檔案**: `src/components/storefront/home-carousel.tsx`

**Fake Data 內容**:
- 輪播圖片 URLs
- 連結 URLs
- 標題/描述

**替換時機**: Phase B13 - CMS Widget 管理完成後

**真實來源**:
- 資料庫表: `widget_instances` (CarouselWidget)
- Server Action: `actions/widgets.ts::getCarouselWidget()`

---

### 6. 首頁特色商品 (Featured Products)

**預計檔案**: `src/app/(storefront)/page.tsx`

**Fake Data 內容**:
- 特色商品列表（目前可能使用 `isFeatured=true` 查詢，但可能需要特定排序/分組）

**替換時機**: Phase B13 - Widget 管理完成後

**真實來源**:
- 資料庫表: `widget_instances` (ProductWidget)
- 或使用既有的 `products.isFeatured` 欄位

---

### 7. 稅金計算 (Tax Calculation)

**檔案**: `src/actions/checkout.ts::createOrder()`

**目前實作**:
```typescript
const taxAmount = 0; // TODO: Calculate tax
```

**替換時機**: Phase B7 - 稅務管理完成後

**真實來源**:
- 資料庫表: `tax_rates`, `tax_classes`
- Server Action: `actions/tax.ts::calculateTax()`
- 計算邏輯: 依據配送地址、商品稅務類別計算

**TODO**:
```typescript
// TODO: Calculate tax based on:
// - Shipping address (country, state)
// - Product tax class
// - Tax rates configuration
```

---

### 8. 運費計算 (Shipping Fee Calculation)

**檔案**: `src/actions/checkout.ts::createOrder()`

**目前實作**:
```typescript
const shippingFee = 0; // TODO: Calculate based on shipping method
```

**替換時機**: Phase B6 - 配送管理完成後

**真實來源**:
- 資料庫表: `shipping_providers`
- Server Action: `actions/shipping.ts::calculateShippingFee()`
- 計算邏輯: 依據配送方式、地址、重量/體積

**TODO**:
```typescript
// TODO: Calculate shipping fee based on:
// - Selected shipping method
// - Shipping address
// - Cart weight/volume
// - Shipping provider rates
```

---

## ✅ 已完成（不需 Fake Data）

- 商品資料（從資料庫查詢）
- 分類/品牌資料（從資料庫查詢）
- 用戶地址（從資料庫查詢）
- 購物車資料（Zustand + localStorage）
- 訂單基本資料（已建立 orders 表）

---

## 替換檢查清單

當實作對應的後台功能時，使用此清單確認 Fake Data 已被替換：

- [ ] 配送方式 (Phase B6)
- [ ] 付款方式 (Phase B8)
- [ ] 商品評論 (Phase B12)
- [ ] 最近瀏覽 (Phase A5)
- [ ] 首頁輪播圖 (Phase B13)
- [ ] 首頁特色商品 (Phase B13)
- [ ] 稅金計算 (Phase B7)
- [ ] 運費計算 (Phase B6)

---

## 代碼標註規範

所有 Fake Data 必須在代碼中標註：

```typescript
// TODO: Replace with real data from [table_name]
// Current: Hardcoded fake data
// Replace in: Phase [X]
const fakeData = [...];
```

**範例**:
```typescript
// TODO: Replace with real data from shipping_providers table
// Current: Hardcoded 3 shipping methods
// Replace in: Phase B6
const shippingMethods = [
  { id: "standard", name: "Standard Shipping", price: 0 },
  // ...
];
```
