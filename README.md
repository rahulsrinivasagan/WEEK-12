# 🚀 Week 13 Task Manager Monorepo

> A high-performance, full-stack Task Management application built with **Next.js**, **Supabase**, **TypeScript**, **Zod**, **Tailwind CSS**, **pnpm Workspaces**, and **TurboRepo**.

---

## 📌 Project Overview

In **Week 12**, we developed a production-ready Task Manager featuring Supabase authentication, Server Actions, Zod validation, Row-Level Security (RLS), and a sleek modern UI with dark mode support.

For **Week 13**, the project was refactored and migrated into an enterprise-grade **Monorepo Architecture**. The application is now organized into modular applications (`apps/`) and reusable shared packages (`packages/`), orchestrated via **TurboRepo** and **pnpm Workspaces**.

---

## 💡 Why Monorepo?

Migrating from a standalone application to a monorepo provides crucial benefits for scalability and team collaboration:

1. **Shared Code & Single Source of Truth**: Reusable validation schemas and TypeScript types (like `taskSchema` and `Task`) live in `@repo/common-types` and are shared seamlessly across multiple frontends, backend services, or mobile apps without code duplication.
2. **Atomic Commits & Refactoring**: Update schemas, types, and consuming applications simultaneously in a single pull request with complete confidence.
3. **Optimized Build Pipelines**: TurboRepo provides intelligent caching, parallel execution, and topological dependency resolution, drastically reducing build and test times.
4. **Centralized Dependency Management**: Manage dependencies consistently with `pnpm` workspaces, preventing version drift and reducing disk footprint via hard links.
5. **Streamlined Developer Workflow**: Run development servers, linters, and type checkers across all applications and packages with unified root commands.

---

## 🏗️ Architecture & Project Structure

The repository follows a clean, modular structure:

```text
task-manager-monorepo/
│
├── apps/
│   └── web/                            # Next.js 15 Web Application
│       ├── app/                        # App Router (layouts, auth routes, dashboard)
│       │   ├── (auth)/                 # Login & Signup pages
│       │   ├── (dashboard)/            # Authenticated Dashboard
│       │   ├── auth/callback/          # Supabase OAuth/email callback handler
│       │   ├── globals.css             # Design tokens & CSS variables
│       │   └── layout.tsx              # Root HTML & Theme Provider wrapper
│       ├── actions/                    # Next.js Server Actions (CRUD & Auth)
│       ├── components/                 # UI, forms, and task components
│       │   ├── forms/                  # Login & Signup forms
│       │   ├── tasks/                  # TaskItem, CreateTaskForm, DashboardClient
│       │   └── ui/                     # Accessible UI components (dialog, toast, etc.)
│       ├── lib/                        # Supabase client/server setup & utility helpers
│       ├── public/                     # Static media & assets
│       ├── middleware.ts               # Supabase session & route protection middleware
│       ├── next.config.ts              # Next.js config with transpilePackages
│       ├── package.json                # Web app dependencies & workspace link
│       ├── tailwind.config.ts          # Tailwind CSS theme configuration
│       └── tsconfig.json               # TypeScript configuration with path aliases
│
├── packages/
│   └── common-types/                   # Shared Internal Package (@repo/common-types)
│       ├── src/
│       │   ├── schemas/
│       │   │   └── task.ts             # Zod validation schema (taskSchema)
│       │   ├── types/
│       │   │   └── task.ts             # TypeScript interfaces (Task, CreateTaskInput, etc.)
│       │   └── index.ts                # Public exports
│       ├── package.json                # Package manifest
│       └── tsconfig.json               # Strict TypeScript build configuration
│
├── .env.example                        # Template environment variables
├── .gitignore                          # Workspace & artifact ignore rules
├── package.json                        # Root package.json with TurboRepo commands
├── pnpm-workspace.yaml                 # pnpm workspace definition (apps/*, packages/*)
├── pnpm-lock.yaml                      # Pinned dependency lockfile
├── supabase-schema.sql                 # Supabase SQL schema & RLS policies
├── turbo.json                          # Turbo task orchestration pipeline
└── README.md                           # Documentation
```

---

## 🛠️ Technologies Used

- **Package Management & Workspaces**: [pnpm](https://pnpm.io/)
- **Monorepo Build System**: [TurboRepo](https://turbo.build/)
- **Web Framework**: [Next.js 15](https://nextjs.org/) (App Router, Server Actions)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
- **Schema Validation**: [Zod](https://zod.dev/)
- **Database & Authentication**: [Supabase](https://supabase.com/) (PostgreSQL + Auth + RLS)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [next-themes](https://github.com/pacocoursey/next-themes) (Dark/Light mode)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## ⚙️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.18+ or v20+)
- [pnpm](https://pnpm.io/installation) (`npm install -g pnpm`)

### 1. Clone & Install Dependencies

```bash
git clone <repository-url>
cd <project-folder>

# Install all workspace dependencies
pnpm install
```

### 2. Configure Environment Variables

Create `.env.local` inside `apps/web/`:

```bash
cp .env.example apps/web/.env.local
```

Edit `apps/web/.env.local` and add your Supabase credentials:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Optional: Public site URL for authentication redirects (defaults to http://localhost:3000)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Database Setup

Execute the provided SQL schema in your [Supabase SQL Editor](https://supabase.com/dashboard/project/_/sql):

```sql
-- Creates tasks table with RLS and user ownership policies
-- See supabase-schema.sql for the complete script
```

---

## 🚀 Development & Build Commands

All commands can be executed from the **monorepo root**:

| Command | Action | Description |
| :--- | :--- | :--- |
| `pnpm dev` | `turbo dev` | Runs the Next.js development server with hot reloading |
| `pnpm build` | `turbo build` | Builds all packages and creates optimized production web bundle |
| `pnpm lint` | `turbo lint` | Runs ESLint across all workspace apps and packages |
| `pnpm typecheck` | `turbo typecheck` | Type-checks all packages and Next.js app via `tsc --noEmit` |

---

## 📦 Shared Package Usage (`@repo/common-types`)

The web application consumes `@repo/common-types` via pnpm workspace protocol:

**`apps/web/package.json`**:
```json
{
  "dependencies": {
    "@repo/common-types": "workspace:*"
  }
}
```

**Using in Server Actions & Client Components**:
```typescript
import { taskSchema, type TaskFormValues, type Task } from "@repo/common-types";

// Validate Server Action payload
const result = taskSchema.safeParse(formData);

// Type client component props
export function TaskItem({ task }: { task: Task }) { ... }
```

---

## 🌐 Vercel Deployment

The project is fully pre-configured for seamless deployment on [Vercel](https://vercel.com/):

1. Import the repository into Vercel.
2. In the project settings:
   - **Root Directory**: Select `apps/web` (or leave root with Vercel's automatic monorepo detection).
   - **Package Manager**: Select `pnpm`.
   - **Build Command**: `cd ../.. && pnpm build --filter=web...` (or standard `pnpm build`).
   - **Output Directory**: `.next`.
3. Add Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL` (set to your production Vercel domain)
4. Deploy!

---

## ✨ Features Preserved

- 🔐 **Secure Authentication**: User sign up, email confirmation support, sign in, and secure logout.
- 🛡️ **Session Protection**: Next.js middleware ensuring protected dashboard access and redirect handling.
- 📝 **Full Task CRUD**:
  - Create tasks with client & server-side validation.
  - Read user-specific tasks (RLS enforced).
  - Toggle completion status with instant feedback.
  - Delete tasks with confirmation dialog.
- ⚡ **Optimistic & Revalidated UI**: Automatic `revalidatePath('/dashboard')` after database mutations.
- 🌓 **Rich UI & Themes**: Seamless dark and light themes, search filter, sort controls, and responsive layout.
