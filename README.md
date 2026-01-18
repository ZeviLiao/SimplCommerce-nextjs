# SimplCommerce Next.js

This project is inspired by [SimplCommerce](https://github.com/simplcommerce/SimplCommerce), reimplementing its core e-commerce features using a modern Next.js tech stack.

## Tech Stack

| Category | Technologies |
|----------|-------------|
| Frontend | Next.js 16, React 19, TypeScript |
| UI | Tailwind CSS 4, shadcn/ui, Radix UI |
| Backend | Hono, Next.js API Routes |
| Database | PostgreSQL, Drizzle ORM |
| State | Zustand |
| DevTools | Biome, Turbopack, Husky |

## Architecture

**Feature-based structure** organized by domain modules:

| Module | Routes | Components | Server Actions |
|--------|--------|-----------|----------------|
| **Catalog** | `/products`, `/categories`, `/brands` | Product listing, filters, detail | Product queries |
| **Admin** | `/admin/products`, `/admin/categories` | Product/category forms, tables | CRUD operations |
| **Auth** | `/login`, `/register`, `/account` | Login/register forms, profile | Authentication, session |
| **Cart** | `/cart` | Cart items, quantity controls | Add/remove items |
| **Checkout** | `/checkout` | Address, shipping, payment, review | Order creation |
| **Wishlist** | `/account/wishlist` | Wishlist items grid | Add/remove wishlist |

**Shared infrastructure:**
- **Database**: Drizzle ORM schemas + PostgreSQL
- **UI Components**: shadcn/ui + Tailwind CSS
- **State**: Zustand for client state (cart)
- **Validation**: Zod schemas for forms

## Getting Started

### Prerequisites
- Node.js 20+
- pnpm
- PostgreSQL (or use Docker)

### Quick Setup

```bash
# 1. Clone and install
git clone https://github.com/ZeviLiao/SimplCommerce-nextjs.git
cd SimplCommerce-nextjs
pnpm install

# 2. Setup PostgreSQL with Docker
docker run -d \
  --name simplcommerce-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=simplcommerce \
  -p 5432:5432 \
  postgres:16

# 3. Configure environment
cp .env.example .env.local
# Edit .env.local and set:
#   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/simplcommerce
#   AUTH_SECRET=<run: openssl rand -base64 32>
#   AUTH_URL=http://localhost:3000

# 4. Initialize database
pnpm db:push
pnpm db:seed

# 5. Start dev server
pnpm dev
```

### Docker Database Commands

```bash
docker start simplcommerce-db   # Start database
docker stop simplcommerce-db    # Stop database
docker logs simplcommerce-db    # View logs
docker exec -it simplcommerce-db psql -U postgres -d simplcommerce  # Connect to DB
```

### Test Accounts

- Admin: `admin@example.com` / `admin123`
- Customer: `customer@example.com` / `customer123`

### Common Commands

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm db:push      # Push schema changes
pnpm db:seed      # Seed database with sample data
pnpm db:studio    # Open database GUI
```

## License

MIT License
