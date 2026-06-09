# Database Setup Guide — Eleven Stars FC

## Prerequisites

- Supabase account (free tier available at supabase.com)
- Node.js 18+ installed
- Prisma CLI (installed via npm)

## Step 1: Create Supabase Project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Create a new project
3. Copy your **Project ID** and **Database Password**
4. Wait for database to be initialized (~2-3 minutes)

## Step 2: Configure Database Connection

1. Go to **Settings** → **Database** in Supabase dashboard
2. Copy the connection string under "Connection pooling" (PostgreSQL)
3. Update `.env.local`:
   ```
   DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-ID].supabase.co:5432/postgres?schema=public"
   ```
   Replace:
   - `[PASSWORD]` with your database password
   - `[PROJECT-ID]` with your Supabase project ID

## Step 3: Generate Prisma Client

```bash
npm install
npx prisma generate
```

## Step 4: Create Database Schema

Run migrations to create all tables:

```bash
npx prisma migrate dev --name init
```

This will:
- Create all tables (players, fixtures, blog_posts, products, donations, etc.)
- Generate Prisma Client

## Step 5: Seed Database (Optional)

Create initial data by running:

```bash
npx prisma db seed
```

(Create a `prisma/seed.ts` file first with your seed data)

## Step 6: Configure M-Pesa Payment Gateway

To enable M-Pesa STK Push for ticket/donation payments:

1. Go to [https://developer.safaricom.co.ke](https://developer.safaricom.co.ke)
2. Create an app and get:
   - Consumer Key
   - Consumer Secret
   - Shortcode (provided)
   - Passkey

3. Update `.env.local`:
   ```
   NEXT_PUBLIC_SAFARICOM_CONSUMER_KEY="your-key"
   SAFARICOM_CONSUMER_SECRET="your-secret"
   SAFARICOM_SHORTCODE="174379"
   SAFARICOM_PASSKEY="your-passkey"
   SAFARICOM_CALLBACK_URL="https://yourdomain.com/api/payment/callback"
   ```

## Step 7: Verify Setup

Start the development server:

```bash
npm run dev
```

Test database connection by visiting:
- http://localhost:3000/api/players
- http://localhost:3000/api/fixtures
- http://localhost:3000/api/products

You should see empty arrays `[]` if tables are created correctly.

## Database Schema

### Players
- `id` (CUID)
- `number` (Int, unique)
- `name`, `position`, `nationality`
- `isCaptain` (Boolean)
- `photo`, `stats` (Optional)

### Fixtures
- `id` (CUID)
- `homeTeam` (default: "Eleven Stars FC")
- `awayTeam`, `date`, `venue`
- `homeScore`, `awayScore` (Optional)
- `status` (upcoming/completed)
- `leagueName`

### BlogPost
- `id` (CUID)
- `slug` (unique)
- `title`, `excerpt`, `content`
- `category`, `author`
- `published` (Boolean)

### Product
- `id` (CUID)
- `name`, `price`, `category`
- `description`, `emoji`, `badge`
- `stock` (Int)

### Donation
- `id` (CUID)
- `amount`, `phone`
- `donorName`, `email`, `tier`
- `message`, `status`
- `mpesaRef` (Optional)

### Sponsor
- `id` (CUID)
- `name` (unique)
- `tier`, `logo`, `website`, `contact`

### TeamMember
- `id` (CUID)
- `name`, `role`, `bio`
- `avatar` (Optional)

### AdminUser
- `id` (CUID)
- `email` (unique)
- `password`, `name`, `role`
- `active` (Boolean)

## API Endpoints

All endpoints return JSON:

### Players
- `GET /api/players` — List all players
- `POST /api/players` — Create player (admin only)

### Fixtures
- `GET /api/fixtures` — List all fixtures
- `POST /api/fixtures` — Create fixture (admin only)

### Blog Posts
- `GET /api/blog?category=news` — List posts
- `POST /api/blog` — Create post (admin only)

### Products
- `GET /api/products?category=jerseys` — List products
- `POST /api/products` — Create product (admin only)

### Donations
- `GET /api/donations` — List donations
- `POST /api/donations` — Create donation

### Payments
- `POST /api/payment/stk-push` — Initiate M-Pesa payment
- `POST /api/payment/callback` — Handle M-Pesa callback

## Troubleshooting

**Connection refused?**
- Verify DATABASE_URL is correct
- Check Supabase project is active
- Ensure IP whitelist includes your machine (Supabase settings)

**Prisma generate fails?**
- Delete `node_modules/.prisma`
- Run `npm install` again
- Then `npx prisma generate`

**Tables not created?**
- Run `npx prisma migrate dev` again
- Check for SQL errors in output

## Next Steps

1. Create admin panel pages to manage data
2. Connect NextAuth for admin authentication
3. Implement Cloudinary for image uploads
4. Build admin dashboard for analytics
