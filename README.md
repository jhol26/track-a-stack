# Track A Stack - Side Hustle Income Tracker

An all-in-one platform to track income, expenses, goals, taxes, and time across multiple side hustles.

![Track A Stack](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38B2AC?logo=tailwind-css)
![Supabase](https://img.shields.io/badge/Supabase-Postgres-3ECF8E?logo=supabase)

## Features

- ✅ **Authentication** - Email/password + Google OAuth via Supabase
- ✅ **Dashboard Layout** - Responsive sidebar navigation with dark/light mode
- ✅ **Hustle Management** - CRUD for tracking multiple side hustles
- ✅ **Income/Expense Tracking** - Per-hustle transactions with categories
- ✅ **Profit Dashboard** - Visual overview with charts and filters
- ✅ **Goal System** - Milestone tracking with progress bars
- ✅ **Time Tracking** - Manual entry + real-time timer
- ✅ **Tax Estimates** - Quarterly estimated tax calculator (25%)
- ✅ **What-If Projections** - Income calculator based on hours worked
- ✅ **Resource Library** - Curated platforms for freelancing, affiliates, digital products

## Tech Stack

- **Frontend:** Next.js 14 (App Router, TypeScript, Tailwind CSS)
- **Backend:** Supabase (PostgreSQL, Auth, Realtime)
- **UI Components:** shadcn/ui (Radix UI + Tailwind)
- **Payments:** Stripe (subscriptions - ready for integration)
- **Hosting:** Vercel-ready
- **OCR:** Tesseract.js (for receipt uploads - ready for integration)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account (free tier works)
- Vercel account (for deployment)

### 1. Clone and Install

```bash
cd track-a-stack
npm install
```

### 2. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Go to SQL Editor and run the contents of `supabase-schema.sql`
3. Go to Settings → API and copy your:
   - Project URL
   - anon/public key

### 3. Configure Environment

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
track-a-stack/
├── src/
│   ├── app/
│   │   ├── dashboard/       # Protected dashboard pages
│   │   ├── login/           # Login page
│   │   ├── signup/          # Signup page
│   │   └── auth/callback/   # OAuth callback handler
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   └── dashboard/       # Dashboard-specific components
│   ├── lib/
│   │   ├── supabase.ts      # Supabase client
│   │   ├── auth.ts          # Auth helpers
│   │   └── utils.ts         # Utility functions
│   └── types/
│       └── database.ts      # TypeScript types from Supabase
├── supabase-schema.sql      # Database schema
├── .env.local.example       # Environment template
└── DEPLOYMENT.md            # Deployment guide
```

## Database Schema

The app uses 5 main tables:

- `users` - Extended Supabase auth users
- `hustles` - Side hustle definitions
- `transactions` - Income/expense entries
- `time_logs` - Time tracking entries
- `goals` - Financial milestones

All tables have Row Level Security (RLS) enabled so users can only access their own data.

## Stripe Integration (Ready)

To enable subscriptions:

1. Create products in Stripe Dashboard:
   - Pro Plan: $9/month
   - Business Plan: $19/month
2. Add Stripe keys to `.env.local`
3. Update pricing page with Stripe Checkout links

See `DEPLOYMENT.md` for detailed Stripe setup.

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for step-by-step Vercel deployment instructions.

## License

MIT - Built for hustlers everywhere 🚀
e 🚀
