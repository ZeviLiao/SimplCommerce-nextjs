# SimplCommerce Next.js 實作計畫

本文件為 SimplCommerce 電商系統的 Next.js 重構計畫。

## 技術棧

| 類別 | 技術 |
|------|------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| UI | MUI (Material UI) + Tailwind CSS |
| State | Zustand |
| Database | PostgreSQL + Drizzle ORM |
| API | Server Actions + Hono (API routes) |
| Linting | Biome |
| Git Hooks | Husky + lint-staged |

---

## 功能模組清單

### Phase 1: 核心基礎 (Foundation)

#### 1.1 用戶系統 (Core/Users)
- [ ] 用戶註冊/登入/登出
- [ ] JWT 認證 + Refresh Token
- [ ] 角色管理 (Admin, Vendor, Customer)
- [ ] 權限控制
- [ ] 用戶個人資料
- [ ] 地址簿管理 (預設帳單/配送地址)
- [ ] 客戶群組 (CustomerGroup)

#### 1.2 地理資訊
- [ ] 國家管理
- [ ] 省份/州管理
- [ ] 區域管理

#### 1.3 媒體管理
- [ ] 圖片上傳
- [ ] 媒體庫
- [ ] Storage Provider (Local / S3 / Azure)

#### 1.4 系統設定
- [ ] AppSetting 設定管理
- [ ] Widget 系統
- [ ] Widget Zone

---

### Phase 2: 商品目錄 (Catalog)

#### 2.1 商品管理
- [ ] 商品 CRUD
- [ ] 商品圖片/媒體
- [ ] 商品規格 (Specification)
- [ ] 商品價格 (Price, OldPrice, SpecialPrice)
- [ ] 價格歷史記錄
- [ ] 商品選項 (Option) - 顏色、尺寸等
- [ ] 商品屬性 (Attribute)
- [ ] 商品選項組合 (OptionCombination)
- [ ] SKU/GTIN 管理
- [ ] 庫存追蹤
- [ ] 精選商品 (Featured)
- [ ] 電詢價格 (Call for Pricing)

#### 2.2 分類管理
- [ ] 分類 CRUD
- [ ] 分類階層 (Parent/Child)
- [ ] 分類圖片
- [ ] 分類 SEO (Meta Title/Keywords/Description)

#### 2.3 品牌管理
- [ ] 品牌 CRUD

#### 2.4 商品模板
- [ ] 商品模板管理
- [ ] 屬性群組

#### 2.5 商品關聯
- [ ] 相關商品
- [ ] 交叉銷售 (Cross-sell)
- [ ] 向上銷售 (Up-sell)

---

### Phase 3: 購物車與結帳 (Shopping)

#### 3.1 購物車
- [ ] 加入購物車
- [ ] 更新數量
- [ ] 移除商品
- [ ] 購物車摘要
- [ ] 折價券套用

#### 3.2 願望清單
- [ ] 加入願望清單
- [ ] 移除願望清單
- [ ] 願望清單列表

#### 3.3 結帳流程
- [ ] 配送地址
- [ ] 帳單地址
- [ ] 配送方式選擇
- [ ] 稅金計算
- [ ] 付款方式選擇
- [ ] 訂單確認

---

### Phase 4: 訂單管理 (Orders)

#### 4.1 訂單
- [ ] 訂單建立
- [ ] 訂單狀態 (New, Processing, Shipped, Completed, Cancelled)
- [ ] 訂單歷史記錄
- [ ] 訂單備註
- [ ] 訂單取消
- [ ] 多供應商訂單 (Master Order + Child Orders)

#### 4.2 發貨管理
- [ ] 建立發貨單
- [ ] 追蹤號碼
- [ ] 發貨狀態
- [ ] 倉庫選擇

#### 4.3 付款管理
- [ ] 付款記錄
- [ ] 付款狀態
- [ ] 付款手續費

---

### Phase 5: 定價與促銷 (Pricing)

#### 5.1 購物車規則 (Cart Rules)
- [ ] 折價券管理
- [ ] 固定/百分比折扣
- [ ] 最低/最高金額限制
- [ ] 適用商品/分類/客戶群組
- [ ] 有效期間
- [ ] 使用次數追蹤

#### 5.2 目錄規則 (Catalog Rules)
- [ ] 自動折扣規則
- [ ] 客戶群組折扣

---

### Phase 6: 配送與稅金 (Shipping & Tax)

#### 6.1 配送
- [ ] 配送供應商管理
- [ ] 免運費規則
- [ ] 表格運費 (Table Rate)
- [ ] 價格區間運費

#### 6.2 稅金
- [ ] 稅務類別
- [ ] 稅率 (依國家/地區)

---

### Phase 7: 庫存管理 (Inventory)

- [ ] 倉庫管理
- [ ] 庫存數量
- [ ] 庫存歷史
- [ ] 補貨通知訂閱

---

### Phase 8: 付款整合 (Payments)

- [ ] Stripe
- [ ] PayPal Express
- [ ] Cash on Delivery (CoD)
- [ ] 其他 (Braintree, 綠界等)

---

### Phase 9: 內容管理 (CMS)

#### 9.1 頁面
- [ ] 頁面 CRUD
- [ ] SEO 設定
- [ ] 發布控制

#### 9.2 選單
- [ ] 選單管理
- [ ] 選單項目階層

#### 9.3 新聞/部落格
- [ ] 新聞項目
- [ ] 新聞分類

---

### Phase 10: 互動功能

#### 10.1 評論系統
- [ ] 商品評論
- [ ] 評分 (1-5 星)
- [ ] 評論回覆
- [ ] 評論審核

#### 10.2 留言系統
- [ ] 實體留言
- [ ] 留言審核

#### 10.3 聯絡表單
- [ ] 聯絡表單
- [ ] 聯絡區域分類

---

### Phase 11: 供應商系統 (Multi-Vendor)

- [ ] 供應商管理
- [ ] 供應商商品
- [ ] 供應商訂單
- [ ] 供應商發貨
- [ ] 供應商儀表板

---

### Phase 12: 進階功能

#### 12.1 搜尋
- [ ] 商品搜尋
- [ ] 全文搜尋

#### 12.2 商品比較
- [ ] 加入比較
- [ ] 屬性比較表

#### 12.3 最近瀏覽
- [ ] 瀏覽記錄
- [ ] 最近瀏覽 Widget

#### 12.4 通知系統
- [ ] 通知設定
- [ ] 即時通知 (WebSocket)

#### 12.5 活動紀錄
- [ ] 實體瀏覽統計
- [ ] 熱門商品

---

### Phase 13: 多語系

- [ ] 商品翻譯
- [ ] 分類翻譯
- [ ] 語言切換

---

## 資料庫 Schema 設計

### 核心表格

```
users
├── id (uuid)
├── email
├── full_name
├── phone
├── password_hash
├── refresh_token_hash
├── vendor_id (fk)
├── culture
├── is_deleted
├── created_at
└── updated_at

user_addresses
├── id
├── user_id (fk)
├── address_id (fk)
├── address_type (shipping/billing)
└── is_default

addresses
├── id
├── contact_name
├── phone
├── address_line_1
├── address_line_2
├── city
├── zip_code
├── district_id (fk)
├── state_or_province_id (fk)
└── country_id (fk)

roles
├── id
├── name
└── permissions (jsonb)

user_roles
├── user_id (fk)
└── role_id (fk)

customer_groups
├── id
├── name
└── is_active

customer_group_users
├── customer_group_id (fk)
└── user_id (fk)
```

### 商品目錄表格

```
products
├── id
├── name
├── slug
├── short_description
├── description
├── specification (jsonb)
├── price
├── old_price
├── special_price
├── special_price_start
├── special_price_end
├── is_published
├── is_featured
├── is_call_for_pricing
├── is_allow_to_order
├── stock_tracking_enabled
├── stock_quantity
├── sku
├── gtin
├── display_order
├── brand_id (fk)
├── tax_class_id (fk)
├── vendor_id (fk)
├── thumbnail_image_url
├── reviews_count
├── rating_average
├── created_at
└── updated_at

categories
├── id
├── name
├── slug
├── description
├── parent_id (fk, self)
├── display_order
├── is_published
├── include_in_menu
├── thumbnail_image_url
├── meta_title
├── meta_keywords
└── meta_description

product_categories
├── product_id (fk)
├── category_id (fk)
└── is_featured

brands
├── id
├── name
├── slug
├── description
└── is_published

product_media
├── id
├── product_id (fk)
├── media_url
├── media_type
└── display_order

product_options
├── id
├── product_id (fk)
├── option_id (fk)
└── values (jsonb)

product_attributes
├── id
├── product_id (fk)
├── attribute_id (fk)
└── value

product_links
├── id
├── product_id (fk)
├── linked_product_id (fk)
└── link_type (related/cross_sell/up_sell)
```

### 訂單表格

```
orders
├── id
├── customer_id (fk)
├── vendor_id (fk)
├── status (new/processing/shipped/completed/cancelled)
├── coupon_code
├── coupon_rule_name
├── discount_amount
├── subtotal
├── subtotal_with_discount
├── shipping_fee_amount
├── shipping_method
├── tax_amount
├── order_total
├── payment_method
├── payment_fee_amount
├── shipping_address (jsonb)
├── billing_address (jsonb)
├── order_note
├── parent_id (fk, self)
├── is_master_order
├── created_at
└── updated_at

order_items
├── id
├── order_id (fk)
├── product_id (fk)
├── product_name
├── product_sku
├── product_price
├── quantity
├── discount_amount
└── tax_amount

order_history
├── id
├── order_id (fk)
├── old_status
├── new_status
├── note
├── created_by_id (fk)
└── created_at

shipments
├── id
├── order_id (fk)
├── warehouse_id (fk)
├── vendor_id (fk)
├── tracking_number
├── status
├── created_by_id (fk)
├── created_at
└── updated_at

shipment_items
├── id
├── shipment_id (fk)
├── order_item_id (fk)
└── quantity

payments
├── id
├── order_id (fk)
├── amount
├── payment_fee
├── payment_method
├── gateway_transaction_id
├── status
├── failure_message
├── created_at
└── updated_at
```

### 購物車表格

```
cart_items
├── id
├── user_id (fk)
├── product_id (fk)
├── quantity
├── created_at
└── updated_at
```

### 定價表格

```
cart_rules
├── id
├── name
├── coupon_code
├── description
├── is_active
├── start_date
├── end_date
├── is_coupon_code_required
├── discount_type (fixed/percentage)
├── discount_amount
├── min_order_amount
├── max_order_amount
├── max_usage_per_coupon
├── max_usage_per_customer
├── created_at
└── updated_at

cart_rule_usages
├── id
├── cart_rule_id (fk)
├── coupon_code
├── user_id (fk)
├── order_id (fk)
└── created_at

catalog_rules
├── id
├── name
├── description
├── is_active
├── start_date
├── end_date
├── discount_type
├── discount_amount
└── created_at
```

---

## 專案結構

```
src/
├── app/
│   ├── (storefront)/           # 前台路由群組
│   │   ├── page.tsx            # 首頁
│   │   ├── products/
│   │   ├── categories/
│   │   ├── cart/
│   │   ├── checkout/
│   │   ├── account/
│   │   └── ...
│   ├── (admin)/admin/          # 後台路由群組
│   │   ├── page.tsx            # 後台儀表板
│   │   ├── products/
│   │   ├── orders/
│   │   ├── users/
│   │   └── ...
│   ├── api/                    # Hono API routes
│   │   └── [[...route]]/
│   └── layout.tsx
├── components/
│   ├── ui/                     # 通用 UI 元件
│   ├── storefront/             # 前台元件
│   └── admin/                  # 後台元件
├── lib/
│   ├── auth/                   # 認證相關
│   ├── utils/                  # 工具函數
│   └── constants/              # 常數
├── stores/                     # Zustand stores
│   ├── cart.ts
│   ├── auth.ts
│   └── ...
├── actions/                    # Server Actions
│   ├── products.ts
│   ├── orders.ts
│   └── ...
├── db/
│   ├── schema/                 # Drizzle schema
│   ├── migrations/             # 資料庫遷移
│   └── index.ts                # 資料庫連線
└── types/                      # TypeScript 型別
```

---

## 開發指令

```bash
# 開發
pnpm dev

# 建置
pnpm build

# Lint & Format
pnpm lint
pnpm format

# 資料庫
pnpm db:generate   # 產生 migration
pnpm db:migrate    # 執行 migration
pnpm db:push       # 推送 schema
pnpm db:studio     # 開啟 Drizzle Studio
```

---

## 實作優先順序建議

1. **Week 1-2**: Phase 1 核心基礎 (用戶系統、認證)
2. **Week 3-4**: Phase 2 商品目錄 (商品、分類、品牌)
3. **Week 5-6**: Phase 3-4 購物車與訂單
4. **Week 7**: Phase 5-6 定價與配送
5. **Week 8**: Phase 8 付款整合
6. **Week 9**: Phase 9-10 CMS 與互動
7. **Week 10+**: Phase 11-13 進階功能

---

## 原始 SimplCommerce 模組對照

| 原始模組 | 對應 Phase |
|---------|-----------|
| Core | Phase 1 |
| Catalog | Phase 2 |
| ShoppingCart, Checkouts | Phase 3 |
| Orders, Shipments | Phase 4 |
| Pricing | Phase 5 |
| Shipping, Tax | Phase 6 |
| Inventory | Phase 7 |
| Payments, PaymentStripe, etc. | Phase 8 |
| CMS, News | Phase 9 |
| Reviews, Comments, Contacts | Phase 10 |
| Vendors | Phase 11 |
| Search, ProductComparison, etc. | Phase 12 |
| Localization | Phase 13 |
