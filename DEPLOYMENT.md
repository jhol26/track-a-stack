# Vestro Deployment Guide

Beginner-friendly, step-by-step instructions to deploy Vestro to production.

---

## Overview

**Hosting:** Vercel (free tier)  
**Database:** Supabase (free tier)  
**Domain:** Optional (Vercel provides free `yourapp.vercel.app`)

**Total Cost:** $0/month to start

---

## Step 1: Deploy to Vercel

### A. Push to GitHub

1. **Initialize Git** (if not already done):
   ```bash
   cd vestro
   git init
   git add .
   git commit -m "Initial commit: Vestro MVP"
   ```

2. **Create GitHub Repository**:
   - Go to [github.com/new](https://github.com/new)
   - Name it `vestro` (or your preferred name)
   - Keep it **Private** (recommended)
   - Click "Create repository"

3. **Push Code**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/vestro.git
   git branch -M main
   git push -u origin main
   ```

### B. Connect to Vercel

1. **Go to Vercel**: [vercel.com](https://vercel.com)
2. **Sign up/Login** (use GitHub for easiest setup)
3. **Click "Add New" → "Project"**
4. **Import your GitHub repo**:
   - Search for "vestro"
   - Click "Import"
5. **Configure Project**:
   - Framework Preset: **Next.js** (auto-detected)
   - Root Directory: `./` (leave as default)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)
6. **Click "Deploy"**

Vercel will build and deploy your app. You'll get a live URL like:
`https://vestro-xyz.vercel.app`

**Don't close this yet!** We need to add environment variables.

---

## Step 2: Set Up Supabase

### A. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. **Sign up/Login**
3. Click **"New Project"**
4. Fill in:
   - **Name:** vestro-production
   - **Database Password:** Create a strong password (save it!)
   - **Region:** Choose closest to your users
5. Click **"Create new project"**

Wait 2-3 minutes for setup to complete.

### B. Run Database Schema

1. In your Supabase dashboard, click **"SQL Editor"** (left sidebar)
2. Click **"New Query"**
3. Open the file `supabase-schema.sql` from your project
4. **Copy all contents** and paste into the SQL Editor
5. Click **"Run"** (or press Ctrl+Enter)

You should see "Success. No rows returned" for each statement.

### C. Get API Keys

1. Go to **Settings** → **API** (left sidebar)
2. Copy these two values:
   - **Project URL** (ends in `.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)

---

## Step 3: Add Environment Variables to Vercel

1. Go back to your Vercel project dashboard
2. Click **"Settings"** (top tabs)
3. Click **"Environment Variables"** (left sidebar)
4. **Add the following**:

| Name | Value | Environment |
|------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase Project URL | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key | Production, Preview, Development |

5. Click **"Save"** for each variable

### Redeploy

After saving variables, you need to redeploy:

1. Go to **"Deployments"** tab
2. Click the **"..."** menu on the latest deployment
3. Click **"Redeploy"**

Wait 1-2 minutes for redeployment to complete.

---

## Step 4: Test Your Live App

1. Click your Vercel URL (e.g., `https://vestro-xyz.vercel.app`)
2. **Sign up** with a test email
3. Check your email for the confirmation link
4. **Log in** and test the dashboard

**Try these:**
- Create a hustle
- Add an income transaction
- Log some time
- Create a goal

---

## Step 5: Set Up Custom Domain (Optional)

### A. Buy a Domain

- **Namecheap:** [namecheap.com](https://namecheap.com)
- **Google Domains:** [domains.google](https://domains.google)
- **Vercel Market:** [vercel.com/market](https://vercel.com/market)

Recommended: `vestro.com` or similar (if available)

### B. Add Domain to Vercel

1. In Vercel dashboard, go to your project
2. Click **"Settings"** → **"Domains"**
3. Enter your domain (e.g., `vestro.com`)
4. Click **"Add"**

### C. Configure DNS

Vercel will show you DNS records to add. Typically:

**For root domain (`vestro.com`):**
```
Type: A
Name: @
Value: 76.76.21.21
```

**For www subdomain (`www.vestro.com`):**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

Add these in your domain registrar's DNS settings.

**Wait 10-60 minutes** for DNS propagation.

---

## Step 6: Set Up Stripe (For Payments)

### A. Create Stripe Account

1. Go to [stripe.com](https://stripe.com)
2. **Sign up** (free, no monthly fees)
3. Complete business profile (use personal info for solo hustlers)

### B. Create Products

1. Go to **Products** → **"Add Product"**
2. Create **Pro Plan**:
   - Name: Vestro Pro
   - Price: $9/month
   - Billing: Recurring
3. Create **Business Plan**:
   - Name: Vestro Business
   - Price: $19/month
   - Billing: Recurring

### C. Get API Keys

1. Go to **Developers** → **API keys**
2. Copy:
   - **Publishable key** (starts with `pk_test_`)
   - **Secret key** (starts with `sk_test_`)

### D. Create Payment Links

1. Go to **Products** → Click your product
2. Click **"Create payment link"**
3. Configure checkout settings
4. Copy the payment link URL

### E. Add Stripe Variables to Vercel

In Vercel **Settings** → **Environment Variables**:

| Name | Value |
|------|-------|
| `STRIPE_SECRET_KEY` | `sk_test_...` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_test_...` |
| `NEXT_PUBLIC_STRIPE_PRICE_ID_PROD` | Price ID from Pro plan |
| `NEXT_PUBLIC_STRIPE_PRICE_ID_BUSINESS` | Price ID from Business plan |

**Redeploy** after adding variables.

---

## Step 7: Enable Google OAuth (Optional but Recommended)

### A. Create Google Cloud Project

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. **Create new project** (name: "Vestro")
3. Go to **APIs & Services** → **Credentials**
4. Click **"Create Credentials"** → **"OAuth client ID"**

### B. Configure OAuth

1. **Application type:** Web application
2. **Authorized redirect URIs:**
   ```
   https://your-domain.com/auth/callback
   https://vestro-xyz.vercel.app/auth/callback
   ```
3. Click **"Create"**
4. Copy:
   - **Client ID**
   - **Client Secret**

### C. Add to Supabase

1. Go to Supabase dashboard
2. **Authentication** → **Providers**
3. Enable **Google**
4. Paste Client ID and Secret
5. Click **"Save"**

### D. Add to Vercel (if needed)

If your app uses these directly, add as environment variables:

| Name | Value |
|------|-------|
| `GOOGLE_CLIENT_ID` | Your Google Client ID |
| `GOOGLE_CLIENT_SECRET` | Your Google Client Secret |

**Redeploy** after changes.

---

## Step 8: Post-Deployment Checklist

- [ ] App loads without errors
- [ ] Sign up works (email confirmation)
- [ ] Login works (email + Google)
- [ ] Can create hustles
- [ ] Can add transactions
- [ ] Dashboard shows correct data
- [ ] Time tracking works
- [ ] Goals display correctly
- [ ] Tax calculator shows estimates
- [ ] Dark/light mode toggle works
- [ ] Mobile responsive (test on phone)

---

## Troubleshooting

### "Missing Supabase environment variables"

**Fix:** Add environment variables to Vercel and redeploy (Step 3).

### Email confirmation not working

**Fix:** In Supabase, go to **Authentication** → **Email Templates** and customize. Make sure "Enable email confirmations" is on.

### Google OAuth not working

**Fix:** Verify redirect URIs match exactly (including `https://`).

### Build fails on Vercel

**Fix:** Check build logs. Common issues:
- TypeScript errors: Run `npm run build` locally first
- Missing dependencies: Add to `package.json`

### Database errors (RLS policies)

**Fix:** Re-run `supabase-schema.sql` in Supabase SQL Editor.

---

## Maintenance

### Updating Your App

1. Make changes locally
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Description of changes"
   git push
   ```
3. Vercel **auto-deploys** on every push to `main`

### Checking Logs

- **Vercel:** Deployments tab → Click deployment → "Function Logs"
- **Supabase:** Database → "Query Performance"

### Backing Up Data

**Supabase:**
- Go to **Database** → **Backups**
- Enable daily backups (free on Pro plan)
- Or manually export: **Database** → **Tables** → Click table → **"Export"**

---

## Support

- **Vercel Docs:** [vercel.com/docs](https://vercel.com/docs)
- **Supabase Docs:** [supabase.com/docs](https://supabase.com/docs)
- **Next.js Docs:** [nextjs.org/docs](https://nextjs.org/docs)

---

**You're live! 🚀**

Now focus on getting users and iterating based on feedback.
