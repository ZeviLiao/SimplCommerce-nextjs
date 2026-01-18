# SimplCommerce Next.js

This project is inspired by [SimplCommerce](https://github.com/simplcommerce/SimplCommerce), reimplementing its core e-commerce features using a modern Next.js tech stack.

## Background

[SimplCommerce](https://github.com/simplcommerce/SimplCommerce) is an open-source e-commerce platform built on ASP.NET Core, featuring a modular architecture and rich e-commerce functionality. This project aims to port its concepts and features to the Next.js ecosystem, providing a more modern frontend development experience and better performance.

## Tech Stack

### Core Framework
- **Next.js 16** - Full-stack React framework with App Router and Server Components
- **React 19** - Latest React with React Compiler support
- **TypeScript** - Type-safe JavaScript

### UI Framework
- **shadcn/ui** - Beautifully designed, accessible components built with Radix UI
- **Tailwind CSS 4** - Utility-first CSS framework

### Backend & Database
- **Hono** - Lightweight, high-performance web framework for API routes
- **Drizzle ORM** - TypeScript-first ORM
- **PostgreSQL** - Relational database
- **Vercel Postgres** - Serverless PostgreSQL

### State Management
- **Zustand** - Lightweight React state management library

### Developer Tools
- **Biome** - Fast linter and formatter (replaces ESLint + Prettier)
- **Husky** - Git hooks management
- **lint-staged** - Run linters on staged files
- **Turbopack** - Fast bundler for Next.js development

## Getting Started

### Prerequisites
- **Node.js 20+** - [Download](https://nodejs.org/)
- **pnpm** - [Install](https://pnpm.io/installation): `npm install -g pnpm`
- **PostgreSQL 14+** - [Download](https://www.postgresql.org/download/) or use Docker

### Quick Start with Docker (Recommended)

If you don't have PostgreSQL installed, use Docker:

```bash
# Start PostgreSQL container
docker run --name simplcommerce-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=simplcommerce \
  -p 5432:5432 \
  -d postgres:16
```

### Installation Steps

#### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone https://github.com/ZeviLiao/SimplCommerce-nextjs.git
cd SimplCommerce-nextjs

# Install dependencies
pnpm install
```

#### 2. Set Up Environment Variables

```bash
# Copy the example environment file
cp .env.example .env.local
```

Edit `.env.local` and configure the required variables:

```env
# Database connection (required)
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/simplcommerce

# Auth secret (required) - generate with: openssl rand -base64 32
AUTH_SECRET=your-generated-secret-key-here

# Auth URL (required)
AUTH_URL=http://localhost:3000
```

To generate a secure `AUTH_SECRET`:
```bash
openssl rand -base64 32
```

#### 3. Initialize Database

```bash
# Push database schema to PostgreSQL
pnpm db:push

# Seed the database with sample data (products, categories, test users)
pnpm db:seed
```

#### 4. Start Development Server

```bash
# Start the Next.js development server with Turbopack
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Test Accounts

After running `pnpm db:seed`, the following test accounts are available:

**Admin Account:**
- Email: `admin@example.com`
- Password: `admin123`
- Access: [http://localhost:3000/admin](http://localhost:3000/admin)

**Customer Account:**
- Email: `customer@example.com`
- Password: `customer123`

See [TEST_ACCOUNTS.md](./TEST_ACCOUNTS.md) for more details.

### Verify Installation

After starting the dev server, you should be able to:
1. ✅ View the homepage at [http://localhost:3000](http://localhost:3000)
2. ✅ Browse products at [http://localhost:3000/products](http://localhost:3000/products)
3. ✅ Login at [http://localhost:3000/login](http://localhost:3000/login)
4. ✅ Access admin panel at [http://localhost:3000/admin](http://localhost:3000/admin) (using admin account)

### Available Scripts

```bash
# Development
pnpm dev          # Start dev server (with Turbopack)
pnpm build        # Build for production
pnpm start        # Start production server

# Code Quality
pnpm lint         # Run Biome linter
pnpm lint:fix     # Auto-fix lint issues
pnpm format       # Format code with Biome
pnpm check        # Run Biome check and auto-fix

# Database
pnpm db:generate  # Generate database migrations
pnpm db:migrate   # Run database migrations
pnpm db:push      # Push schema to database (for development)
pnpm db:seed      # Seed database with sample data
pnpm db:studio    # Open Drizzle Studio (database GUI)
```

### Troubleshooting

#### Database Connection Issues

If you get "connection refused" errors:

```bash
# Check if PostgreSQL is running
docker ps  # If using Docker

# Check connection manually
psql postgresql://postgres:postgres@localhost:5432/simplcommerce
```

#### Port 3000 Already in Use

```bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 pnpm dev
```

#### Module Not Found Errors

```bash
# Clear cache and reinstall
rm -rf node_modules .next
pnpm install
```

## License

MIT License
