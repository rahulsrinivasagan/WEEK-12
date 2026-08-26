# 🚀 Task Manager Monorepo (Week 14 — CI/CD & Deployment)

[![CI](https://github.com/<OWNER>/<REPOSITORY>/actions/workflows/ci.yml/badge.svg)](https://github.com/<OWNER>/<REPOSITORY>/actions/workflows/ci.yml)

> A high-performance, full-stack Task Management application built with **Next.js 15**, **Supabase**, **TypeScript**, **Zod**, **Tailwind CSS**, **pnpm Workspaces**, **TurboRepo**, **GitHub Actions CI**, and **Vercel Deployment Readiness**.

---

## 📌 Project Overview & Evolution

* **Week 12**: Built a production-ready Task Manager featuring Supabase authentication, Server Actions, Zod validation, Row-Level Security (RLS), and a sleek modern UI with dark mode.
* **Week 13**: Refactored the architecture into an enterprise-grade **Monorepo** using **pnpm Workspaces** and **TurboRepo**, extracting shared schemas and types into `@repo/common-types`.
* **Week 14**: Implemented an automated **GitHub Actions CI/CD Pipeline**, code quality gates, Pull Request validation, and pre-configured **Vercel Monorepo Deployment**.

---

## 🔄 CI/CD Pipeline (GitHub Actions)

An automated Continuous Integration (CI) pipeline runs on every **Pull Request targeting `main`** and on direct pushes to `main`.

### Pipeline Flow

```text
       Pull Request / Push to main
                   ↓
   [GitHub Actions Workflow: CI]
                   ↓
      1. Checkout Repository
                   ↓
      2. Setup pnpm (v11.9.0)
                   ↓
      3. Setup Node.js (v20 LTS) & Cache
                   ↓
      4. Install Monorepo Dependencies
         (pnpm install --frozen-lockfile)
                   ↓
      5. Run ESLint (pnpm lint)
                   ↓
      6. Run TypeScript Checks (pnpm typecheck)
                   ↓
      7. Run Production Build (pnpm build)
                   ↓
          ✅ CI Checks Pass
```

### Security & Zero-Secret CI Policy
* The CI pipeline verifies linting, type safety, and production build without requiring live Supabase credentials.
* No `.env` or `.env.local` files or production secrets are committed or exposed in CI logs.

---

## 🌐 Vercel Deployment Configuration

The monorepo is fully prepared for instant deployment on [Vercel](https://vercel.com/):

### Recommended Vercel Project Settings

| Setting | Value |
| :--- | :--- |
| **Framework Preset** | `Next.js` |
| **Root Directory** | `apps/web` |
| **Build Command** | `cd ../.. && pnpm build --filter=web...` *(or default `pnpm build`)* |
| **Install Command** | `pnpm install` |
| **Output Directory** | `.next` *(automatically detected)* |
| **Node.js Version** | `20.x` |

### Required Environment Variables in Vercel
Add the following under **Project Settings > Environment Variables**:

| Variable Name | Description | Example |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase Project URL | `https://xyzproject.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase Anonymous Public API Key | `eyJhbGciOi...` |
| `NEXT_PUBLIC_SITE_URL` | Production website URL (for auth redirects) | `https://your-domain.vercel.app` |

### Step-by-Step Vercel Deployment
1. Push your monorepo to your GitHub repository.
2. Log into [Vercel Dashboard](https://vercel.com/dashboard) and click **"Add New..." > "Project"**.
3. Import your GitHub repository.
4. Set **Root Directory** to `apps/web`.
5. Under **Environment Variables**, enter `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
6. Click **Deploy**. Vercel will install workspace dependencies, link `@repo/common-types`, and deploy the application.

---

## 🏗️ Architecture & Project Structure

```text
task-manager-monorepo/
│
├── .github/
│   └── workflows/
│       └── ci.yml                      # GitHub Actions CI pipeline configuration
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
│       │   └── index.ts                # Public barrel exports
│       ├── package.json                # Package manifest with build, lint, and typecheck scripts
│       └── tsconfig.json               # Strict TypeScript build configuration
│
├── .env.example                        # Template environment variables
├── .gitignore                          # Monorepo gitignore (.turbo, .next, node_modules, .env*)
├── package.json                        # Root package.json with TurboRepo commands
├── pnpm-workspace.yaml                 # pnpm workspace definition (apps/*, packages/*)
├── pnpm-lock.yaml                      # Pinned dependency lockfile
├── supabase-schema.sql                 # Supabase SQL schema & RLS policies
├── turbo.json                          # Turbo task orchestration pipeline
└── README.md                           # Documentation
```

---

## 🛠️ Technologies Used

* **Package Manager & Workspaces**: [pnpm](https://pnpm.io/)
* **Build System & Task Orchestrator**: [TurboRepo](https://turbo.build/)
* **CI/CD**: [GitHub Actions](https://github.com/features/actions)
* **Deployment Platform**: [Vercel](https://vercel.com/)
* **Web Framework**: [Next.js 15](https://nextjs.org/) (App Router, Server Actions)
* **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
* **Schema Validation**: [Zod](https://zod.dev/)
* **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL + Auth + RLS)
* **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [next-themes](https://github.com/pacocoursey/next-themes) (Dark/Light mode)
* **Icons**: [Lucide React](https://lucide.dev/)

---

## ⚙️ Getting Started Locally

### Prerequisites
* [Node.js](https://nodejs.org/) (v20+ LTS recommended)
* [pnpm](https://pnpm.io/installation) (`npm install -g pnpm`)

### 1. Clone & Install Dependencies

```bash
git clone <repository-url>
cd <project-folder>

# Install workspace dependencies from the root
pnpm install
```

### 2. Configure Local Environment Variables

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
-- See supabase-schema.sql for the complete script
```

---

## 🚀 Monorepo Root Commands

| Command | Action | Description |
| :--- | :--- | :--- |
| `pnpm dev` | `turbo dev` | Runs the Next.js development server with hot reloading |
| `pnpm build` | `turbo build` | Builds all workspace packages and creates optimized production web bundle |
| `pnpm lint` | `turbo lint` | Runs ESLint across all workspace apps and packages |
| `pnpm typecheck` | `turbo typecheck` | Validates TypeScript types across all workspaces (`tsc --noEmit`) |

---

## ✨ Preserved Features

* 🔐 **Secure Authentication**: User sign up, email confirmation support, sign in, and secure logout.
* 🛡️ **Session Protection**: Next.js middleware ensuring protected dashboard access and redirect handling.
* 📝 **Full Task CRUD**:
  * Create tasks with client & server-side validation.
  * Read user-specific tasks (RLS enforced).
  * Toggle completion status with instant feedback.
  * Delete tasks with confirmation dialog.
* ⚡ **Optimistic & Revalidated UI**: Automatic `revalidatePath('/dashboard')` after database mutations.
* 🌓 **Rich UI & Themes**: Seamless dark and light themes, search filter, sort controls, and responsive layout.
