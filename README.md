# TaskZen — Premium Full-Stack Task Manager

TaskZen is a production-quality, high-performance, and responsive task management application built using **Next.js 15 (App Router)**, **Supabase (Auth & Database)**, **Tailwind CSS**, and **Zod** for server-action validation. It implements full CRUD capabilities, email authentication, interactive glassmorphic cards, metrics tracking, and dark/light modes.

## Table of Contents
1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Folder Structure](#folder-structure)
5. [Installation](#installation)
6. [Supabase Setup](#supabase-setup)
   - [SQL Schema](#sql-schema)
   - [Row-Level Security (RLS) Policies](#row-level-security-rls-policies)
7. [Environment Variables](#environment-variables)
8. [Running the Project](#running-the-project)
9. [Deployment](#deployment)
10. [Future Improvements](#future-improvements)
11. [Screenshots](#screenshots)

---

## Project Overview

TaskZen is designed to serve as a fast and secure workspace for managing task priorities. The frontend is built on Next.js 15 with server-side page fetches and Client Component state synchronization. The backend leverages Supabase for fast authentication and data persistence with Row-Level Security (RLS) policies enforcing database security boundaries.

## Features

- **Secure Email Authentication**: Register, log in, and log out using Supabase Auth. Unauthenticated users are strictly blocked and redirected from the `/dashboard` route by Next.js middleware.
- **Full CRUD Operations**: Create tasks, toggle task completion, and delete tasks with immediate updates and cache revalidation (`revalidatePath`).
- **Interactive Metrics Counters**: Instant visualization of Total, Completed, and Pending task states.
- **Client-Side Filtering & Sorting**: Filter tasks by All, Completed, or Pending states. Sort by Newest, Oldest, or Alphabetical (A-Z) instantly.
- **Real-Time Client Search**: Query tasks instantaneously through full-text searches.
- **Validation**: Strict schema verification on both client-side and server-side Server Actions using Zod.
- **Premium UX/UI**:
  - Glassmorphic backdrop blur card components.
  - Interactive micro-animations (scale-clicks, transition effects).
  - Smooth light/dark theme switching via `next-themes`.
  - Accessible styling (focus rings, ARIA labels, semantic markup).
  - Beautiful, customized SVG-based Empty State and Error Boundary cards.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS
- **Database / Auth**: Supabase PostgreSQL + Auth
- **Validation**: Zod + React Hook Form + `@hookform/resolvers`
- **Icons**: Lucide Icons
- **Theme Manager**: `next-themes`
- **Radix UI Primitives**: Dialog, Checkbox, Dropdown-Menu, Separator, Label, Slot

---

## Folder Structure

The project has been laid out using a professional, modular structure:

```text
WEEK-12/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx           # LoginPage (Server Page)
│   │   └── signup/
│   │       └── page.tsx           # SignupPage (Server Page)
│   ├── (dashboard)/
│   │   └── dashboard/
│   │       └── page.tsx           # DashboardPage (Server Side Fetches & Auth checks)
│   ├── auth/
│   │   └── callback/
│   │       └── route.ts           # Supabase auth token exchange callback
│   ├── globals.css                # Global Tailwind styles & Glassmorphic utilities
│   ├── layout.tsx                 # Root layout wrapping theme & toast providers
│   └── page.tsx                   # Index route redirecting to dashboard
├── actions/
│   ├── auth-actions.ts            # Server Actions: login, signup, logout
│   └── task-actions.ts            # Server Actions: createTask, updateTask, deleteTask
├── components/
│   ├── forms/
│   │   ├── login-form.tsx         # LoginForm Client Component (react-hook-form + zod)
│   │   └── signup-form.tsx        # SignupForm Client Component (react-hook-form + zod)
│   ├── tasks/
│   │   ├── dashboard-client.tsx   # DashboardClient Panel (Search, filter, sort, list)
│   │   ├── task-item.tsx          # Single task row with delete confirmation modal
│   │   └── create-task-form.tsx   # CreateTaskForm Client Component
│   ├── ui/
│   │   ├── badge.tsx              # shadcn-like Badge component
│   │   ├── button.tsx             # shadcn-like Button component (custom CVA variants)
│   │   ├── card.tsx               # Card component with custom glassmorphism formats
│   │   ├── checkbox.tsx           # Checkbox wrapper based on Radix Checkbox
│   │   ├── dialog.tsx             # Dialog modals based on Radix Dialog
│   │   ├── dropdown-menu.tsx      # Dropdown system based on Radix Dropdown
│   │   ├── input.tsx              # Styled text fields
│   │   ├── label.tsx              # Accessible form labels
│   │   ├── separator.tsx          # Radix Separator lines
│   │   ├── skeleton.tsx           # Loading Skeletons
│   │   └── toast.tsx              # Toast Notification Context and container
│   ├── theme-provider.tsx         # theme wrappers using next-themes
│   └── theme-toggle.tsx           # Sun/Moon mode switcher
├── lib/
│   ├── supabase/
│   │   ├── client.ts              # Supabase browser client
│   │   ├── server.ts              # Supabase server client (Next.js 15 async cookies)
│   │   └── middleware.ts          # Session refresh and routing protector
│   ├── utils.ts                   # Class merge utilities (cn)
│   └── validations.ts             # Zod input schemas (tasks, login, signup)
├── types/
│   └── index.ts                   # Core TypeScript type definitions
├── middleware.ts                  # Root routing middleware
├── supabase-schema.sql            # Local SQL instructions for Database setup
├── .env.example                   # Local environment variable example file
├── tailwind.config.ts             # Customized configuration defining theme colors
└── tsconfig.json                  # Compiler variables config
```

---

## Installation

1. **Clone the repository** (or copy folder contents):
   ```bash
   cd WEEK-12
   ```

2. **Install all dependencies**:
   ```bash
   npm install --legacy-peer-deps
   ```
   *(The `--legacy-peer-deps` flag avoids peer dependency mismatches with Next.js 15 React 19 release candidates)*

3. **Configure local environment variables**:
   Duplicate `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   Add your specific Supabase parameters:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

---

## Supabase Setup

To initialize the Supabase Database backend, follow these steps:

1. Create a new project in the [Supabase Dashboard](https://supabase.com).
2. Open the **SQL Editor** in your Supabase project dashboard.
3. Paste the following SQL script to create the `tasks` table, configure indexes, and enforce Row-Level Security (RLS).

### SQL Schema

```sql
-- Create Tasks Table
CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indices for Performance Optimization
CREATE INDEX IF NOT EXISTS tasks_user_id_idx ON public.tasks(user_id);
CREATE INDEX IF NOT EXISTS tasks_created_at_idx ON public.tasks(created_at DESC);
```

### Row-Level Security (RLS) Policies

Enable security guards so users cannot view or manipulate other users' data:

```sql
-- Enable Row Level Security (RLS)
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- SELECT Policy: Users can only read tasks belonging to themselves
CREATE POLICY "Users can select their own tasks"
ON public.tasks
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- INSERT Policy: Users can only add tasks linked to their own ID
CREATE POLICY "Users can insert their own tasks"
ON public.tasks
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- UPDATE Policy: Users can only update their own tasks
CREATE POLICY "Users can update their own tasks"
ON public.tasks
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- DELETE Policy: Users can only remove their own tasks
CREATE POLICY "Users can delete their own tasks"
ON public.tasks
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);
```

---

## Running the Project

### Development Server
Run the local next.js development process:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build and Production Run
To compile typescript, verify ESLint rules, and build optimized production chunks:
```bash
npm run build
```
Launch the compiled production bundle locally:
```bash
npm run start
```

---

## Deployment

This application is fully production-grade and ready for deployment to **Vercel** or other platforms:

1. Push your code to a repository (GitHub, GitLab, Bitbucket).
2. Connect your repository to Vercel.
3. Add the following **Environment Variables** in the Vercel project configuration:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Click **Deploy**. Vercel will build the static pages and API Server Actions automatically.

---

## Future Improvements

- **Sub-tasks / Checklists**: Add child checkbox items inside task cards for granular tracking.
- **Task Due Dates**: Integrate calendar picking dates and visual warning badges for overdue items.
- **Drag-and-Drop Prioritization**: Reorder tasks through interactive drag movements.
- **Collaboration**: Share task spaces or workspaces with other signed-in users.

---

## Screenshots

Below are mockup visual representations of the application:

### Light Mode Dashboard
```
┌────────────────────────────────────────────────────────┐
│  TaskZen                                 user@email.com │
├────────────────────────────────────────────────────────┤
│ Workspace                          Thursday, July 2026 │
│                                                        │
│ ┌───────────────┐ ┌───────────────┐ ┌────────────────┐ │
│ │ Total: 8      │ │ Completed: 5  │ │ Pending: 3     │ │
│ └───────────────┘ └───────────────┘ └────────────────┘ │
│                                                        │
│  [ Add a new task...                      ] [+ Add]    │
│                                                        │
│  [ Search...   ]  [ All ] [ Completed ] [ Pending ]    │
│                                                        │
│  [x] Complete Next.js 15 Task Manager          [Delete]│
│  [ ] Setup Supabase SQL Editor and Policies    [Delete]│
│  [ ] Deploy application to Vercel              [Delete]│
└────────────────────────────────────────────────────────┘
```

### Dark Mode (Glassmorphic Interface)
```
┌────────────────────────────────────────────────────────┐
│  TaskZen (Dark Mode)                     user@email.com │
├────────────────────────────────────────────────────────┤
│ Workspace                                   07/30/2026 │
│                                                        │
│  (★) Dynamic gradients, blurred panels, glow rings.    │
│  (★) Secure Server Actions validating Zod inputs.      │
│  (★) Accessibility compliance with full focus frames.  │
└────────────────────────────────────────────────────────┘
```
