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
- PostgreSQL database

### Installation

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local to configure DATABASE_URL

# Push schema to database
pnpm db:push

# Start development server
pnpm dev
```

### Available Scripts

```bash
pnpm dev          # Start dev server (with Turbopack)
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run linter
pnpm lint:fix     # Auto-fix lint issues
pnpm format       # Format code
pnpm db:generate  # Generate database migrations
pnpm db:migrate   # Run database migrations
pnpm db:push      # Push schema to database
pnpm db:studio    # Open Drizzle Studio
```

## License

MIT License
