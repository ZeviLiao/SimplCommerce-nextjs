# SimplCommerce Next.js

A modern e-commerce platform built with Next.js 16, inspired by [SimplCommerce](https://github.com/simplcommerce/SimplCommerce).

## Features

- **Admin Portal**: Product/category/brand management, order processing
- **Storefront**: Product catalog, shopping cart, checkout, wishlist
- **Authentication**: NextAuth.js with credentials provider
- **Responsive UI**: Tailwind CSS 4 with shadcn/ui components

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript, React 19 |
| Database | PostgreSQL + Drizzle ORM |
| Styling | Tailwind CSS 4, Radix UI |
| Auth | NextAuth.js v5 |
| State | Zustand (client), React Context |
| Validation | Zod |
| Dev Tools | Biome, Turbopack |

## Architecture

```
app/
├── (admin)/         # Admin dashboard routes
├── (storefront)/    # Public store routes
└── api/            # API endpoints

components/
├── admin/          # Admin-specific components
├── products/       # Product display components
├── checkout/       # Checkout flow components
└── ui/            # Shared UI components (shadcn/ui)

actions/            # Server Actions (mutations)
db/schema/         # Drizzle schema definitions
lib/               # Utilities, validators, auth config
stores/            # Zustand stores
```

**Design Patterns:**
- Server Components for data fetching (default)
- Server Actions for mutations (forms, data updates)
- Client Components only when needed (interactivity, hooks)
- Route Groups for layout isolation

## Getting Started

**Prerequisites:** Node.js 20+, pnpm, Docker

### 1. Clone & Install

```bash
git clone https://github.com/ZeviLiao/SimplCommerce-nextjs.git
cd SimplCommerce-nextjs
pnpm install
```

### 2. Database Setup

```bash
# Start PostgreSQL container
docker run -d --name simplcommerce-db \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=simplcommerce \
  -p 5432:5432 \
  postgres:16

# Verify database is running
docker ps | grep simplcommerce-db
```

### 3. Environment Configuration

```bash
cp .env.example .env.local
```

Edit `.env.local` and set required variables:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/simplcommerce
AUTH_SECRET=your-secret-here    # Generate: openssl rand -base64 32
```

### 4. Initialize Database

```bash
pnpm db:push    # Apply schema
pnpm db:seed    # Load sample data
```

### 5. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

**Login:**
- Admin: `admin@example.com` / `admin123`
- Customer: `customer@example.com` / `customer123`

## Development

### Database

```bash
pnpm db:studio       # Open Drizzle Studio
pnpm db:push         # Push schema changes
pnpm db:generate     # Generate migrations
```

**Docker Commands:**

```bash
docker start simplcommerce-db
docker stop simplcommerce-db
docker logs simplcommerce-db
docker exec -it simplcommerce-db psql -U postgres -d simplcommerce
```

### Code Quality

```bash
pnpm lint            # Check code issues
pnpm lint:fix        # Auto-fix issues
pnpm format          # Format code
pnpm build           # Production build
```

## Troubleshooting

**Port 5432 already in use:**
```bash
# Use a different port
docker run -d --name simplcommerce-db \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=simplcommerce \
  -p 5433:5432 \
  postgres:16

# Update DATABASE_URL to use port 5433
```

**Database connection failed:**
```bash
# Check if container is running
docker ps

# Check logs
docker logs simplcommerce-db

# Restart container
docker restart simplcommerce-db
```

## License

MIT License
