# Database Integration — Eleven Stars FC

## Overview

The application now has a complete database integration using:
- **Supabase** (PostgreSQL) for data storage
- **Prisma ORM** for type-safe database operations
- **Next.js API Routes** for REST endpoints
- **Safaricom Daraja API** for M-Pesa payments

## What's Been Set Up

### 1. Prisma Schema (`prisma/schema.prisma`)
Complete data models for:
- **Players** — Squad management with numbers, positions, captain status
- **Fixtures** — Match schedules, results, league information
- **BlogPosts** — News, updates, match reports with rich content
- **Products** — Merchandise for the online shop
- **Tickets** — Match ticket inventory and pricing
- **Donations** — Donation tracking and tier management
- **Sponsors** — Official sponsor information
- **TeamMembers** — Management and staff
- **AdminUsers** — Admin credentials for dashboard access

### 2. Database Utilities (`src/lib/db.ts`)
- Singleton Prisma client
- Connection pooling
- Development logging

### 3. API Routes

#### Data Fetching
- `GET /api/players` — Get all squad members
- `GET /api/fixtures` — Get match schedule
- `GET /api/blog?category=news` — Get blog posts
- `GET /api/products?category=jerseys` — Get shop items
- `GET /api/donations?status=pending` — Get donations

#### Data Creation
- `POST /api/players` — Add player
- `POST /api/fixtures` — Create fixture
- `POST /api/blog` — Publish blog post
- `POST /api/products` — Add product
- `POST /api/donations` — Record donation

#### Payments
- `POST /api/payment/stk-push` — Initiate M-Pesa STK Push

### 4. Environment Configuration
- `.env.local` — Database connection and API keys
- Supabase PostgreSQL connection string
- Safaricom Daraja API credentials
- NextAuth secrets

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Create Supabase Project
1. Sign up at [supabase.com](https://supabase.com)
2. Create a new project
3. Copy your connection string

### 3. Configure Database
Update `.env.local`:
```
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-ID].supabase.co:5432/postgres?schema=public"
```

### 4. Initialize Database
```bash
npx prisma migrate dev --name init
```

This creates all tables and generates Prisma client.

### 5. Verify Setup
```bash
npm run dev
```

Test endpoints:
- http://localhost:3000/api/players
- http://localhost:3000/api/fixtures
- http://localhost:3000/api/products

You should see empty arrays `[]`.

## Frontend Integration

### Fetching Data

**Example: Get all players**
```typescript
const response = await fetch('/api/players')
const players = await response.json()
```

**Example: Get products by category**
```typescript
const response = await fetch('/api/products?category=jerseys')
const products = await response.json()
```

### Creating Data

**Example: Record a donation**
```typescript
const response = await fetch('/api/donations', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    amount: 5000,
    phone: '254712345678',
    tier: 'Bronze Star',
  }),
})
const donation = await response.json()
```

### Payment Integration

**Example: Initiate M-Pesa payment**
```typescript
const response = await fetch('/api/payment/stk-push', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    phoneNumber: '254712345678',
    amount: 2000,
    description: 'Eleven Stars FC Ticket',
  }),
})
const result = await response.json()
// User receives M-Pesa prompt on their phone
```

## Next Steps

### 1. Admin Dashboard
Create admin pages to manage:
- Players (add, edit, delete)
- Fixtures (schedule matches, record results)
- Blog (publish posts, manage categories)
- Products (add merchandise, manage stock)
- Donations (view transactions)

### 2. NextAuth Integration
```bash
npm install next-auth
```
Set up authentication for:
- Admin login
- Protected routes
- Session management

### 3. Image Uploads
Configure Cloudinary for:
- Player photos
- Blog post images
- Product images
- Sponsor logos

### 4. Email Notifications
Send confirmations for:
- Donations
- Ticket purchases
- Blog subscriptions

### 5. Analytics
Track:
- Website visitors
- Donation metrics
- Shop sales
- Engagement rates

## Useful Commands

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# View database in Prisma Studio
npx prisma studio

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Format schema
npx prisma format
```

## Troubleshooting

### "Cannot find module '@prisma/client'"
```bash
npx prisma generate
npm install
```

### Database connection refused
1. Check `.env.local` has correct CONNECTION string
2. Verify Supabase project is active
3. Add your IP to Supabase IP whitelist

### Migrations not applied
```bash
npx prisma migrate dev --name init
```

### TypeScript errors
```bash
npx prisma generate
# Restart VSCode
```

## File Structure

```
eleven-stars-fc/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── lib/
│   │   └── db.ts              # Prisma singleton
│   └── app/api/
│       ├── players/route.ts
│       ├── fixtures/route.ts
│       ├── blog/route.ts
│       ├── products/route.ts
│       ├── donations/route.ts
│       └── payment/
│           └── stk-push/route.ts
├── .env.local                 # Environment variables
└── DATABASE_SETUP.md          # Setup guide
```

## Security

### Environment Variables
- Never commit `.env.local`
- Use strong `NEXTAUTH_SECRET`
- Rotate M-Pesa credentials regularly
- Whitelist IP addresses in Supabase

### API Security
- Add rate limiting for payment endpoints
- Validate all inputs
- Use HTTPS in production
- Add CORS if serving from different domain

### Database Security
- Enable RLS (Row Level Security) in Supabase
- Use Postgres roles for permissions
- Regular backups (automatic with Supabase)
- Monitor query performance

## Performance Tips

1. **Use Prisma select** to fetch only needed fields:
```typescript
const players = await prisma.player.findMany({
  select: { number: true, name: true, position: true },
})
```

2. **Add indexes** for frequently queried fields:
```prisma
model BlogPost {
  id String @id @default(cuid())
  slug String @unique
  category String
  published Boolean
  
  @@index([category])
  @@index([published])
}
```

3. **Cache responses** in Next.js:
```typescript
export const revalidate = 60 // Revalidate every 60 seconds
```

4. **Use pagination** for large datasets:
```typescript
const posts = await prisma.blogPost.findMany({
  skip: (page - 1) * 10,
  take: 10,
})
```

## Support

For issues:
1. Check DATABASE_SETUP.md
2. Review Prisma documentation: https://www.prisma.io/docs
3. Check Supabase docs: https://supabase.com/docs
4. Review API route implementations

---

**Database integration complete!** 🎉

Your application now has full database capabilities for production use.
