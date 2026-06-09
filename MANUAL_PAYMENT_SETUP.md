# Manual Payment System — Eleven Stars FC

## Overview

Since Safaricom Daraja API registration has issues, we've implemented a **manual M-Pesa Paybill payment system** where:
- Customers pay via Paybill (303030 / 2051724456)
- Payments are recorded with `pending_confirmation` status
- Admin manually confirms payments and fulfills orders

## Current Status

✅ **Payment Modal Deployed** to:
- `/donate` (Donations)
- `/tickets` (Match Tickets)  
- `/shop` (Merchandise Checkout)

✅ **Admin Panel** at `/admin/payments` to:
- View all pending payments
- Verify M-Pesa transactions
- Confirm and process payments

## How It Works

### Customer Flow

1. **Customer initiates payment** (Shop, Donate, or Buy Tickets)
2. **ManualPaymentModal displays**:
   - Paybill Code: `303030`
   - Account Number: `2051724456`
   - Amount: KES [amount]
3. **Customer pays via M-Pesa**:
   - Menu → Lipa na M-Pesa → Paybill
   - Enter Business No: 303030
   - Enter Account: 2051724456
   - Enter Amount
   - Enter PIN
4. **Customer confirms in modal** after sending payment
5. **Payment recorded** in database with status: `pending_confirmation`

### Admin Flow

1. **Go to** `/admin/payments`
2. **View pending payments** with amounts and timestamps
3. **Verify M-Pesa payment** in your Safaricom account
4. **Click "Confirm & Process"** to mark as confirmed
5. **Fulfill order**:
   - For tickets: Send ticket details via SMS
   - For merchandise: Ship package
   - For donations: Send thank you message

## Environment Variables

In `.env.local`:

```env
# Paybill Details (Manual Payment)
NEXT_PUBLIC_PAYBILL_CODE="303030"
NEXT_PUBLIC_PAYBILL_ACCOUNT="2051724456"
NEXT_PUBLIC_PAYBILL_BANK="Absa Bank"
```

These are already configured. No additional setup needed.

## Database Schema

Payments are stored in the `donations` table:

```prisma
model Donation {
  id        String   @id @default(cuid())
  amount    Int
  phone     String   // "manual-paybill" for manual payments
  status    String   @default("pending_confirmation")
  message   String?  @db.Text
  createdAt DateTime @default(now())
}
```

Status values:
- `pending_confirmation` — Payment received, awaiting admin confirmation
- `confirmed` — Payment verified, order fulfilled
- `cancelled` — Payment rejected or cancelled

## Admin Pages

### Pending Payments Dashboard
**Route**: `/admin/payments`

Features:
- List all pending payments
- Filter by status
- Show amount, phone, timestamp
- One-click confirmation button
- Payment processing instructions

### Create Confirmed Payment (API)
```bash
PATCH /api/donations/{id}
Content-Type: application/json

{
  "status": "confirmed"
}
```

## Testing the Flow

1. **Start dev server**:
   ```bash
   npm run dev
   ```

2. **Test donation flow**:
   - Go to `/donate`
   - Select donation amount
   - Click "Donate Now"
   - Verify modal shows correct Paybill details
   - Click checkbox "I have sent the M-Pesa payment"
   - Click "Confirm Payment"

3. **Verify in admin**:
   - Go to `/admin/payments`
   - Should see pending payment with amount
   - Click "Confirm & Process"
   - Payment status updates to "confirmed"

4. **Verify in database**:
   ```sql
   SELECT * FROM donations WHERE status = 'pending_confirmation';
   ```

## Migration to Daraja API (Future)

When Safaricom registration is resolved, to switch back to STK Push:

1. Install Daraja packages
2. Update environment variables with real credentials
3. Replace `ManualPaymentModal` with `StkPushModal` in:
   - `/donate/page.tsx`
   - `/tickets/page.tsx`
   - `/shop/ShopClient.tsx`
4. Implement `/api/payment/callback` webhook for payment confirmations

## Key Files

- `src/components/ui/ManualPaymentModal.tsx` — Payment modal showing Paybill details
- `src/app/admin/payments/page.tsx` — Admin dashboard for payment confirmation
- `src/app/api/donations/[id]/route.ts` — API to update payment status
- `src/app/(public)/donate/page.tsx` — Uses ManualPaymentModal
- `src/app/(public)/tickets/page.tsx` — Uses ManualPaymentModal
- `src/app/(public)/shop/ShopClient.tsx` — Uses ManualPaymentModal

## Support

**For payment issues:**
- Check Safaricom M-Pesa account for received payments
- Verify Paybill details are correct (303030 / 2051724456)
- Check admin panel for pending payments
- Process confirmed payments promptly

**When Daraja is ready:**
- Contact Safaricom to complete registration
- Update environment variables
- Switch back to STK Push for automated payments

---

**Current Implementation**: Manual Paybill payments ✓
**Next Step**: Daraja API automation (when registration complete)
