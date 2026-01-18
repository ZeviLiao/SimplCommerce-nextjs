# SimplCommerce Next.js 實作計畫

本文件為 SimplCommerce 電商系統的 Next.js 重構計畫。

---

## 目前進度

### ✅ 已完成

- [x] 專案初始化 (Next.js 16, TypeScript, Tailwind)
- [x] 工具鏈設定 (Biome, Husky, lint-staged)
- [x] 資料庫 Schema 定義 (Drizzle ORM)
- [x] Auth.js (NextAuth v5) 設定
- [x] 專案結構建立
- [x] shadcn/ui 整合 (取代 MUI)
- [x] 註冊頁面 `/register`
- [x] 登入頁面 `/login`
- [x] 登出功能 (Header with UserMenu)
- [x] 測試帳號建立 (admin + customer)

### 🔲 待實作

- [ ] Phase 1.1-1.3 (會員中心、地址管理、後台用戶管理)
- [ ] Phase 2-13 功能模組 (見下方清單)

---

## 技術棧

| 類別 | 技術 | 備註 |
|------|------|------|
| Framework | Next.js 16 | App Router, Turbopack |
| Language | TypeScript | |
| UI | shadcn/ui + Tailwind CSS 4 | Radix UI + clsx, tailwind-merge, lucide-react |
| State | Zustand 5 | |
| Database | PostgreSQL + Drizzle ORM | |
| Auth | Auth.js (NextAuth v5) | Credentials + Google + GitHub |
| API | Server Actions + Hono | |
| Linting | Biome | 只檢查 src/ |
| Git Hooks | Husky + lint-staged | |

---

## 已建立的檔案

### 資料庫 Schema

```
src/db/
├── index.ts                    # DB 連線
└── schema/
    ├── index.ts                # 匯出所有 schema
    ├── users.ts                # 用戶、Auth tables、供應商、客戶群組、地址
    ├── catalog.ts              # 商品、分類、品牌、屬性、選項、評論
    └── orders.ts               # 購物車、訂單、付款、庫存、發貨、折價券
```

### Auth.js

```
src/
├── lib/auth/index.ts           # NextAuth 設定
├── middleware.ts               # 路由保護
├── types/next-auth.d.ts        # TypeScript 型別擴展
└── app/api/auth/[...nextauth]/route.ts  # Auth API
```

### 設定檔

```
/
├── biome.json                  # Biome 設定 (只檢查 src/)
├── drizzle.config.ts           # Drizzle 設定
├── .lintstagedrc.json          # lint-staged 設定
├── .env.example                # 環境變數範本
└── .husky/pre-commit           # Git hook
```

---

## 環境設定步驟

```bash
# 1. 複製環境變數
cp .env.example .env

# 2. 編輯 .env，設定：
#    - DATABASE_URL (PostgreSQL 連線字串)
#    - AUTH_SECRET (執行 openssl rand -base64 32 產生)
#    - AUTH_URL=http://localhost:3000

# 3. 建立資料庫 (PostgreSQL)
createdb simplcommerce

# 4. 推送 schema 到資料庫
pnpm db:push

# 5. 啟動開發伺服器
pnpm dev
```

---

## 專案結構

```
src/
├── app/
│   ├── (storefront)/           # 前台路由群組
│   │   ├── page.tsx            # 首頁
│   │   ├── products/           # 商品列表、詳情
│   │   ├── categories/         # 分類頁
│   │   ├── cart/               # 購物車
│   │   ├── checkout/           # 結帳
│   │   ├── account/            # 會員中心
│   │   ├── login/              # 登入
│   │   └── register/           # 註冊
│   ├── (admin)/admin/          # 後台路由群組 (需 admin/vendor 角色)
│   │   ├── page.tsx            # 儀表板
│   │   ├── products/           # 商品管理
│   │   ├── categories/         # 分類管理
│   │   ├── orders/             # 訂單管理
│   │   ├── users/              # 用戶管理
│   │   └── settings/           # 系統設定
│   ├── api/
│   │   ├── auth/[...nextauth]/ # Auth.js API
│   │   └── [[...route]]/       # Hono API (如需要)
│   └── layout.tsx
├── components/
│   ├── ui/                     # 通用 UI 元件 (Button, Input, Card...)
│   ├── storefront/             # 前台元件
│   └── admin/                  # 後台元件
├── lib/
│   ├── auth/index.ts           # Auth.js 設定
│   └── utils.ts                # cn() 等工具函數
├── stores/                     # Zustand stores
│   ├── cart.ts                 # 購物車狀態
│   └── ...
├── actions/                    # Server Actions
│   ├── auth.ts                 # 註冊、登入
│   ├── products.ts             # 商品 CRUD
│   ├── cart.ts                 # 購物車操作
│   ├── orders.ts               # 訂單操作
│   └── ...
├── db/
│   ├── index.ts                # DB 連線
│   ├── schema/                 # Drizzle schema
│   └── migrations/             # 資料庫遷移
└── types/                      # TypeScript 型別
    └── next-auth.d.ts          # Auth.js 型別擴展
```

---

## 開發指令

```bash
# 開發
pnpm dev              # 啟動開發伺服器 (Turbopack)

# 建置
pnpm build            # 建置生產版本
pnpm start            # 啟動生產伺服器

# 程式碼品質
pnpm lint             # 檢查程式碼
pnpm lint:fix         # 自動修復
pnpm format           # 格式化程式碼
pnpm check            # lint + format

# 資料庫
pnpm db:generate      # 產生 migration
pnpm db:migrate       # 執行 migration
pnpm db:push          # 推送 schema (開發用)
pnpm db:studio        # 開啟 Drizzle Studio
```

---

## 功能模組清單

### Phase 1: 核心基礎 (Foundation)

> **前置條件**: Auth.js 已設定，schema 已建立

#### 1.1 用戶系統
- [x] 註冊頁面 `/register`
- [x] 登入頁面 `/login`
- [x] 登出功能
- [ ] 會員中心 `/account`
- [ ] 個人資料編輯
- [ ] 地址簿管理 (CRUD)
- [ ] 預設帳單/配送地址設定

#### 1.2 後台用戶管理
- [ ] 用戶列表 `/admin/users`
- [ ] 用戶編輯 (角色指派)
- [ ] 客戶群組管理

#### 1.3 地理資訊 (Seed Data)
- [ ] 國家資料
- [ ] 省份/州資料
- [ ] 區域資料

---

### Phase 2: 商品目錄 (Catalog)

#### 2.1 後台商品管理
- [ ] 商品列表 `/admin/products`
- [ ] 商品新增/編輯
- [ ] 商品圖片上傳
- [ ] 商品規格 (Specification)
- [ ] 價格設定 (Price, OldPrice, SpecialPrice)
- [ ] 商品選項 (Option) - 顏色、尺寸等
- [ ] 商品屬性 (Attribute)
- [ ] SKU/GTIN 管理
- [ ] 庫存設定

#### 2.2 後台分類管理
- [ ] 分類列表 `/admin/categories`
- [ ] 分類新增/編輯 (含階層)
- [ ] 分類圖片上傳
- [ ] SEO 設定

#### 2.3 後台品牌管理
- [ ] 品牌列表 `/admin/brands`
- [ ] 品牌新增/編輯

#### 2.4 前台商品展示
- [ ] 商品列表頁 `/products`
- [ ] 分類篩選
- [ ] 品牌篩選
- [ ] 價格排序
- [ ] 商品詳情頁 `/products/[slug]`
- [ ] 分類頁 `/categories/[slug]`

---

### Phase 3: 購物車與結帳

#### 3.1 購物車
- [ ] 購物車頁面 `/cart`
- [ ] 加入購物車 (Server Action)
- [ ] 更新數量
- [ ] 移除商品
- [ ] 購物車摘要元件
- [ ] Zustand 購物車狀態

#### 3.2 願望清單
- [ ] 願望清單頁面 `/account/wishlist`
- [ ] 加入/移除願望清單

#### 3.3 結帳流程
- [ ] 結帳頁面 `/checkout`
- [ ] 配送地址選擇/新增
- [ ] 帳單地址選擇/新增
- [ ] 配送方式選擇
- [ ] 付款方式選擇
- [ ] 訂單確認

---

### Phase 4: 訂單管理

#### 4.1 前台訂單
- [ ] 訂單列表 `/account/orders`
- [ ] 訂單詳情 `/account/orders/[id]`
- [ ] 訂單追蹤

#### 4.2 後台訂單管理
- [ ] 訂單列表 `/admin/orders`
- [ ] 訂單詳情/編輯
- [ ] 訂單狀態更新
- [ ] 訂單歷史記錄

#### 4.3 發貨管理
- [ ] 發貨單建立
- [ ] 追蹤號碼輸入
- [ ] 發貨狀態更新

---

### Phase 5: 定價與促銷

#### 5.1 折價券管理
- [ ] 折價券列表 `/admin/coupons`
- [ ] 折價券新增/編輯
- [ ] 固定/百分比折扣
- [ ] 使用條件設定
- [ ] 有效期間

#### 5.2 前台折價券
- [ ] 購物車套用折價券
- [ ] 折價券驗證

---

### Phase 6: 配送與稅金

#### 6.1 配送設定
- [ ] 配送供應商管理
- [ ] 運費規則設定

#### 6.2 稅金設定
- [ ] 稅務類別管理
- [ ] 稅率設定

---

### Phase 7: 庫存管理

- [ ] 倉庫管理
- [ ] 庫存調整
- [ ] 庫存歷史

---

### Phase 8: 付款整合

- [ ] Stripe 整合
- [ ] 付款回調處理
- [ ] 付款狀態更新

---

### Phase 9: 內容管理 (CMS)

#### 9.1 頁面管理
- [ ] 頁面列表 `/admin/pages`
- [ ] 頁面編輯器
- [ ] 前台頁面顯示

#### 9.2 選單管理
- [ ] 選單設定

---

### Phase 10: 互動功能

#### 10.1 評論系統
- [ ] 商品評論提交
- [ ] 評論列表顯示
- [ ] 後台評論審核

---

### Phase 11: 供應商系統

- [ ] 供應商儀表板
- [ ] 供應商商品管理
- [ ] 供應商訂單管理

---

### Phase 12: 進階功能

- [ ] 商品搜尋
- [ ] 商品比較
- [ ] 最近瀏覽

---

### Phase 13: 多語系

- [ ] i18n 設定
- [ ] 語言切換

---

## 資料庫 Schema 概覽

### users.ts
| Table | 用途 |
|-------|------|
| users | 用戶 (擴展 Auth.js) |
| accounts | OAuth 帳號 (Auth.js) |
| sessions | Session (Auth.js) |
| verificationTokens | 驗證 Token (Auth.js) |
| vendors | 供應商 |
| customerGroups | 客戶群組 |
| customerGroupUsers | 客戶群組關聯 |
| countries | 國家 |
| stateOrProvinces | 省份/州 |
| districts | 區域 |
| addresses | 地址 |
| userAddresses | 用戶地址關聯 |

### catalog.ts
| Table | 用途 |
|-------|------|
| taxClasses | 稅務類別 |
| brands | 品牌 |
| categories | 分類 (支援階層) |
| productTemplates | 商品模板 |
| productAttributeGroups | 屬性群組 |
| productAttributes | 商品屬性 |
| productOptions | 商品選項 (如顏色、尺寸) |
| products | 商品 |
| productCategories | 商品分類關聯 |
| productMedia | 商品媒體 |
| productAttributeValues | 商品屬性值 |
| productOptionValues | 商品選項值 |
| productOptionCombinations | 選項組合 (變體) |
| productLinks | 商品關聯 |
| productPriceHistory | 價格歷史 |
| reviews | 評論 |
| reviewReplies | 評論回覆 |

### orders.ts
| Table | 用途 |
|-------|------|
| cartItems | 購物車項目 |
| wishlistItems | 願望清單 |
| orders | 訂單 |
| orderItems | 訂單項目 |
| orderHistory | 訂單歷史 |
| payments | 付款記錄 |
| warehouses | 倉庫 |
| stocks | 庫存 |
| stockHistory | 庫存歷史 |
| shipments | 發貨單 |
| shipmentItems | 發貨項目 |
| cartRules | 購物車規則 (折價券) |
| cartRuleUsages | 折價券使用記錄 |
| shippingProviders | 配送供應商 |
| taxRates | 稅率 |

---

## 原始 SimplCommerce 模組對照

| 原始模組 | 對應 Phase | 狀態 |
|---------|-----------|------|
| Core | Phase 1 | Schema ✅ |
| Catalog | Phase 2 | Schema ✅ |
| ShoppingCart, Checkouts | Phase 3 | Schema ✅ |
| Orders, Shipments | Phase 4 | Schema ✅ |
| Pricing | Phase 5 | Schema ✅ |
| Shipping, Tax | Phase 6 | Schema ✅ |
| Inventory | Phase 7 | Schema ✅ |
| Payments | Phase 8 | Schema ✅ |
| CMS, News | Phase 9 | 待建 |
| Reviews, Comments | Phase 10 | Schema ✅ |
| Vendors | Phase 11 | Schema ✅ |
| Search, ProductComparison | Phase 12 | 待建 |
| Localization | Phase 13 | 待建 |

---

## 實作建議

1. **從 Phase 1 開始** - 先完成註冊/登入 UI
2. **建立 Seed Script** - 用於初始化測試資料
3. **UI 元件** - 可考慮使用 shadcn/ui 或自建
4. **Server Actions** - 優先使用，API routes 作為備用
5. **測試** - 建議加入 Vitest 進行單元測試
