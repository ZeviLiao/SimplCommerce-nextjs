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
- Node.js 20+
- pnpm
- PostgreSQL (or use Docker)

### Quick Setup

```bash
# 1. Clone and install
git clone https://github.com/ZeviLiao/SimplCommerce-nextjs.git
cd SimplCommerce-nextjs
pnpm install

# 2. Start PostgreSQL (if using Docker)
docker run --name postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=simplcommerce -p 5432:5432 -d postgres:16

# 3. Configure environment
cp .env.example .env.local
# Edit .env.local:
#   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/simplcommerce
#   AUTH_SECRET=<generate with: openssl rand -base64 32>
#   AUTH_URL=http://localhost:3000

# 4. Initialize database
pnpm db:push
pnpm db:seed

# 5. Start dev server
pnpm dev
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
