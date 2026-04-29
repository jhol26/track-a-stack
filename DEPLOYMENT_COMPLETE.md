# Track A Stack - Deployment Status

**Deployment Date:** April 29, 2026  
**Deployment Engineer:** Warren (AI Agent)  
**Status:** ⚠️ Partially Complete - Manual Steps Required

---

## ✅ What's Done

### 1. Code Preparation
- ✅ All MVP code is complete in `track-a-stack/`
- ✅ Git repository initialized and committed
- ✅ Code pushed to GitHub: https://github.com/jhol26/track-a-stack
- ✅ Vercel project linked to GitHub repo

### 2. Vercel Deployment Attempted
- ✅ Vercel CLI installed (v50.37.3)
- ✅ `vercel.json` created with environment variables
- ⚠️ **Build failed** - Environment variables need to be added via Vercel dashboard (CLI interactive prompts require browser auth)

### 3. Supabase Configuration
- ✅ Supabase project exists: `xwginwfiddtieisumqih`
- ✅ Supabase URL: `https://xwginwfiddtieisumqih.supabase.co`
- ✅ Anon key configured in `.env.local`
- ⚠️ **Verify schema is deployed** - Run `supabase-schema.sql` in Supabase SQL Editor if not already done

---

## ⏳ What John Needs to Do

### Step 1: Add Environment Variables in Vercel Dashboard

1. Go to: https://vercel.com/dashboard
2. Find project: **track-a-stack**
3. Click **Settings** → **Environment Variables**
4. Add these variables (set for **Production**, **Preview**, and **Development**):

| Variable Name | Value |
|---------------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xwginwfiddtieisumqih.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3Z2lud2ZpZGR0aWVpc3VtcWloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4ODM0MzIsImV4cCI6MjA5MDQ1OTQzMn0.SosnqaeZ6g2A3yZ9AIpkKas2qfLz8Q4LN_sgiCmxxWk` |
| `STRIPE_SECRET_KEY` | `sk_test_placeholder` (replace with real key from Stripe) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_test_placeholder` (replace with real key from Stripe) |
| `NEXT_PUBLIC_STRIPE_PRICE_ID_PROD` | (create in Stripe - see Step 3) |
| `NEXT_PUBLIC_STRIPE_PRICE_ID_BUSINESS` | (create in Stripe - see Step 3) |
| `STRIPE_WEBHOOK_SECRET` | (create after webhook setup - see Step 4) |

5. After adding variables, go to **Deployments** tab
6. Click **"..."** on latest deployment → **Redeploy**

### Step 2: Verify Supabase Schema

1. Go to: https://supabase.com/dashboard
2. Select project: **track-a-stack-production** (or `xwginwfiddtieisumqih`)
3. Click **SQL Editor** → **New Query**
4. Open `track-a-stack/supabase-schema.sql` from your workspace
5. Copy all contents and paste into SQL Editor
6. Click **Run**

You should see success messages for all table creations.

### Step 3: Set Up Stripe (For Subscription Payments)

**This enables the $9-19/mo revenue model:**

1. Go to: https://stripe.com
2. Sign up / Log in
3. Go to **Products** → **Add Product**

**Create Pro Plan:**
- Name: Track A Stack Pro
- Price: $9/month (recurring)
- Save the **Price ID** (looks like `price_1ABC123...`)

**Create Business Plan:**
- Name: Track A Stack Business
- Price: $19/month (recurring)
- Save the **Price ID**

4. Go to **Developers** → **API Keys**
5. Copy:
   - **Publishable key** → Update `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - **Secret key** → Update `STRIPE_SECRET_KEY`

6. Update these Price IDs in Vercel environment variables

### Step 4: Configure Stripe Webhook (Optional for MVP)

For production payment handling:

1. In Stripe Dashboard: **Developers** → **Webhooks** → **Add Endpoint**
2. Endpoint URL: `https://your-vercel-url.vercel.app/api/webhooks/stripe`
3. Select events: `checkout.session.completed`, `customer.subscription.updated`
4. Copy the **Signing Secret** → Update `STRIPE_WEBHOOK_SECRET` in Vercel

### Step 5: Test the Live App

After redeployment completes:

1. Visit your Vercel URL: **https://track-a-stack-gev0psb3e-jhol26s-projects.vercel.app**
2. Test signup with email
3. Verify email confirmation works
4. Login and test dashboard features
5. Create a test hustle
6. Add income/expense transactions

---

## 📈 Revenue Potential

**Pricing Model:**
- **Pro Plan:** $9/month - Individual hustlers
- **Business Plan:** $19/month - Multiple hustles, advanced features

**Break-Even Math:**
- Vercel: $0 (free tier)
- Supabase: $0 (free tier up to 500MB database, 50K MAU)
- Stripe: 2.9% + $0.30 per transaction (only when you get paid)

**To make $1,000/mo:**
- 111 Pro users @ $9/mo = $999/mo
- OR 53 Business users @ $19/mo = $1,007/mo
- OR mix: 50 Pro + 25 Business = $925/mo

**Next Steps After Launch:**
1. Get first 10 paying users
2. Collect feedback, iterate on features
3. Add marketing (SEO, content, social)
4. Consider custom domain for credibility

---

## 🔗 Quick Links

- **GitHub Repo:** https://github.com/jhol26/track-a-stack
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Supabase Dashboard:** https://supabase.com/dashboard
- **Stripe Dashboard:** https://dashboard.stripe.com
- **Live App (after env vars):** https://track-a-stack-gev0psb3e-jhol26s-projects.vercel.app

---

## 📝 Notes

- The `vercel.json` file has been added to the repo with placeholder Stripe keys
- Supabase credentials are already configured and working
- Git auto-deploy is enabled - every push to `main` triggers a new Vercel deployment
- Environment variables with `NEXT_PUBLIC_` prefix are exposed to the browser (safe for Supabase URL/keys)

---

**🚀 You're 15 minutes away from a live SaaS product!**

Add the environment variables in Vercel dashboard, redeploy, and start onboarding users.
