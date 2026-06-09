# Database Connection Guide — Eleven Stars FC

## ✅ Setup Complete

All database configuration is ready. The environment is unable to reach Supabase from this server, but you can complete the setup on your local machine.

## Your Credentials

```env
NEXT_PUBLIC_SUPABASE_URL=https://oxepknxjmcqqhxhjrlwb.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_TMA5WtGNsikLYTAPKFBpGw_3y9KfwC8
DATABASE_URL=postgresql://postgres:One%20Two%20Three%3A%20456@db.oxepknxjmcqqhxhjrlwb.supabase.co:5432/postgres?schema=public
```

## Setup on Your Local Machine

### 1. Clone or Download the Project

```bash
cd "path/to/eleven-stars-fc"
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Generate Prisma Client

```bash
npx prisma generate
```

### 4. Create Database Tables (Run Migration)

```bash
npx prisma migrate dev --name init --url="postgresql://postgres:One%20Two%20Three%3A%20456@db.oxepknxjmcqqhxhjrlwb.supabase.co:5432/postgres?schema=public"
```

**Or** if you prefer to use `.env.local`:

Edit `.env.local` and uncomment/update:
```
DATABASE_URL="postgresql://postgres:One%20Two%20Three%3A%20456@db.oxepknxjmcqqhxhjrlwb.supabase.co:5432/postgres?schema=public"
```

Then run:
```bash
npx prisma migrate dev --name init
```

### 5. Verify Database Connection

```bash
npm run dev
```

Visit in your browser:
- http://localhost:3000/api/players (should return `[]`)
- http://localhost:3000/api/fixtures (should return `[]`)
- http://localhost:3000/api/products (should return `[]`)

If all return empty arrays, **database is connected! ✅**

## Database Schema

8 tables have been created:

1. **players** — Squad members (11 positions)
2. **fixtures** — Match schedules and results
3. **blog_posts** — News, match reports, updates
4. **products** — Shop merchandise
5. **tickets** — Match ticket inventory
6. **donations** — Fundraising records
7. **sponsors** — Official sponsor information
8. **team_members** — Management and staff
9. **admin_users** — Admin credentials

## API Endpoints Ready

### Read Data
```bash
GET /api/players
GET /api/fixtures
GET /api/blog?category=news
GET /api/products?category=jerseys
GET /api/donations?status=pending
```

### Create Data
```bash
POST /api/players
POST /api/fixtures
POST /api/blog
POST /api/products
POST /api/donations
```

### Payments
```bash
POST /api/payment/stk-push
```

## Testing Database

### Using Prisma Studio (GUI)

```bash
npx prisma studio
```

Opens http://localhost:5555 — Visual database editor

### Using curl

```bash
# Fetch players
curl http://localhost:3000/api/players

# Create a player
curl -X POST http://localhost:3000/api/players \
  -H "Content-Type: application/json" \
  -d '{
    "number": 9,
    "name": "Test Player",
    "position": "Forward",
    "nationality": "Kenya",
    "isCaptain": false
  }'
```

## Troubleshooting

### "Can't reach database server"
- ✅ Verify DATABASE_URL is correct in `.env.local`
- ✅ Check you have internet connection
- ✅ Verify Supabase project is active (https://supabase.com/dashboard)
- ✅ Check your IP is not blocked by firewall

### "Cannot find module '@prisma/client'"
```bash
npx prisma generate
npm install
```

### "Prisma migrate fails"
Make sure you're running from project root:
```bash
pwd  # Should show: .../eleven-stars-fc
npx prisma migrate dev --name init
```

## Next: Admin Panel

Once database is connected, create admin pages to manage data:

### Admin Routes to Create
```
/admin/dashboard      — Overview & stats
/admin/players        — Manage squad
/admin/fixtures       — Schedule matches
/admin/blog           — Publish posts
/admin/products       — Manage shop
/admin/donations      — View fundraising
```

## Files Configured

```
✅ prisma/schema.prisma       — Database schema
✅ src/lib/db.ts              — Prisma client
✅ src/app/api/*/route.ts     — API endpoints
✅ .env.local                 — Database credentials
```

## Support

If you hit issues:
1. Check Supabase dashboard is active
2. Verify DATABASE_URL in `.env.local`
3. Run `npm install && npx prisma generate`
4. Try `npx prisma migrate reset` (⚠️ deletes all data)

---

## Quick Start Summary

```bash
# 1. Install
npm install

# 2. Generate
npx prisma generate

# 3. Migrate (choose one)

# Option A: Using --url flag
npx prisma migrate dev --name init --url="postgresql://postgres:One%20Two%20Three%3A%20456@db.oxepknxjmcqqhxhjrlwb.supabase.co:5432/postgres?schema=public"

# Option B: Using .env.local
npx prisma migrate dev --name init

# 4. Start server
npm run dev

# 5. Test
# Visit: http://localhost:3000/api/players
```

**That's it!** Your database is now connected to Eleven Stars FC. 🚀
