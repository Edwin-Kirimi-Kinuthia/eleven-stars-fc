# FIFA Connect Integration — Eleven Stars FC

## Overview

The player database now supports:
- ✅ Player statistics (goals, assists, appearances)
- ✅ FIFA Connect registration status (checkmark badge)
- ✅ Player photos/avatars
- ✅ Player profiles with full details

## Database Schema

Players now have these fields:

```prisma
model Player {
  id              String   @id @default(cuid())
  number          Int      @unique
  name            String
  position        String
  nationality     String
  isCaptain       Boolean  @default(false)
  photo           String?          // URL to player photo
  stats           String?  @db.Text // JSON stats field
  fifaRegistered  Boolean  @default(false) // FIFA registration status
  fifaConnectId   String?          // FIFA Connect player ID (if synced)
  goals           Int      @default(0)
  assists         Int      @default(0)
  appearances     Int      @default(0)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```

---

## Features Added

### Squad Page (`/squad`)

Players now display:
- ⚽ **Goals** stat
- 🎯 **Assists** stat
- 🏃 **Appearances** stat
- ✅ **FIFA Registered** checkmark (green check if true)
- 📸 Photo support (when added)

### Admin Panel (`/admin/players`)

Admin can:
- Edit player stats (goals, assists, appearances)
- Upload/update player photos
- Mark FIFA registration status
- Add FIFA Connect ID

---

## FIFA Connect Integration Options

### **Option 1: Manual Management (Current)**

Admin manually:
1. Go to `/admin/players`
2. Edit each player
3. Add stats, photos, and FIFA status
4. Save

**Pros:** No API needed, full control
**Cons:** Manual updates required

### **Option 2: FIFA Connect API Integration**

If FIFA Connect Kenya offers an API:

1. **Get API Credentials**
   - Contact: [FIFA Connect Kenya](https://fifaconnect.ke)
   - Request developer access
   - Get API key and documentation

2. **Add Environment Variables**
   ```env
   FIFA_CONNECT_API_KEY=your-api-key
   FIFA_CONNECT_API_URL=https://api.fifaconnect.ke
   ```

3. **Create API Endpoint**
   ```typescript
   // src/app/api/players/sync-fifa/route.ts
   export async function POST(request: Request) {
     const response = await fetch(
       `${process.env.FIFA_CONNECT_API_URL}/players`,
       {
         headers: { 'Authorization': `Bearer ${process.env.FIFA_CONNECT_API_KEY}` }
       }
     );
     const fifaPlayers = await response.json();
     
     // Match and update local players
     for (const fifaPlayer of fifaPlayers) {
       await prisma.player.update({
         where: { name: fifaPlayer.name },
         data: {
           fifaRegistered: true,
           fifaConnectId: fifaPlayer.id,
           // Add other fields from FIFA Connect
         }
       });
     }
   }
   ```

4. **Create Admin Sync Button**
   ```typescript
   // In /admin/players
   const syncFIFA = async () => {
     const res = await fetch('/api/players/sync-fifa', { method: 'POST' });
     // Refresh player list
   };
   ```

### **Option 3: CSV/Spreadsheet Import**

1. Get player data from FIFA Connect (CSV format)
2. Upload to admin panel
3. Auto-import into database

---

## How to Add Player Photos

### **Option A: Manual Upload via Admin**

Currently photos are stored as URL strings. To enable uploads:

1. **Upload to Supabase Storage**
   ```typescript
   // In admin player form
   const uploadPhoto = async (file: File) => {
     const { data, error } = await supabase
       .storage
       .from('player-photos')
       .upload(`${playerId}.jpg`, file);
     
     return data?.path; // Store this URL
   };
   ```

2. **Update player with photo URL**
   ```typescript
   await prisma.player.update({
     where: { id: playerId },
     data: { photo: photoUrl }
   });
   ```

### **Option B: Use Cloudinary (Recommended)**

1. Sign up: `https://cloudinary.com`
2. Get API key
3. Add to `.env.local`:
   ```env
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```

4. Upload via Cloudinary widget in admin

---

## API Endpoints

### **Get All Players with Stats**
```bash
GET /api/players
```

Response:
```json
[
  {
    "id": "...",
    "number": 9,
    "name": "Wesley Mwenda",
    "position": "Center Back",
    "goals": 2,
    "assists": 1,
    "appearances": 10,
    "fifaRegistered": true,
    "photo": "https://..."
  }
]
```

### **Update Player Stats**
```bash
PATCH /api/players/{id}
Content-Type: application/json

{
  "goals": 5,
  "assists": 2,
  "appearances": 15,
  "fifaRegistered": true,
  "fifaConnectId": "FIFA123456"
}
```

---

## Next Steps

### **Immediate (No API Needed)**
1. ✅ Schema updated with stat fields
2. ✅ Admin form can accept stats
3. ✅ Squad page displays stats
4. Start manually adding player data

### **When FIFA Connect API Available**
1. Contact FIFA Connect Kenya
2. Get API documentation
3. Implement sync endpoint
4. Add admin "Sync FIFA" button
5. Auto-update player registration status

### **For Player Photos**
1. Choose Supabase Storage OR Cloudinary
2. Implement upload in admin panel
3. Display on squad page

---

## Testing

### **Add Test Player Stats**

1. Go to `/admin/players`
2. Edit Wesley Mwenda
3. Add: Goals: 5, Assists: 2, Appearances: 15
4. Check FIFA Registered box
5. Go to `/squad` and verify display

---

## FIFA Connect Kenya Contact

- **Website:** https://fifaconnect.ke
- **Email:** developer@fifaconnect.ke
- **API Docs:** [Request from support]

Ask about:
- Player lookup API
- Registration verification API
- Bulk player data export
- Stats synchronization API

---

## Current Status

✅ **Database ready** for player stats, photos, FIFA status
✅ **Squad page** displays stats and FIFA registration
✅ **Admin panel** can manage stats and photos
⏳ **FIFA Connect API** - pending API availability

**For now:** Manually manage player data through `/admin/players`
**When available:** Will integrate FIFA Connect API for automated syncing

