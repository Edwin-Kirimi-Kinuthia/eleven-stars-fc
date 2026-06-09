# Player Statistics Guide — Eleven Stars FC

## Overview

Different positions display different stats on the squad page. Admin can manage position-specific stats through the admin panel.

---

## Position-Specific Stats

### 🥅 **Goalkeeper**

**Displayed on Squad Page:**
- 🛡️ Saves
- ✨ Clean Sheets

**Admin Fields:**
- Appearances
- Saves
- Clean Sheets
- Goals Against
- FIFA Registered

**Example:**
```
Wesley Mwenda (if GK)
🛡️ 45  ✨ 8  🏃 15
```

---

### 🛡️ **Defender / Center Back**

**Displayed on Squad Page:**
- 🛡️ Tackles
- 🎯 Interceptions
- 📍 Clearances
- 🏃 Appearances

**Admin Fields:**
- Appearances
- Tackles
- Interceptions
- Clearances
- Blocks
- FIFA Registered

**Example:**
```
Wesley Mwenda (Center Back)
🛡️ 28  🎯 14  📍 35  🏃 15
```

---

### 🎯 **Midfielder**

**Displayed on Squad Page:**
- 🎯 Passes
- 📊 Pass Completion %
- 🛡️ Tackles
- 🏃 Appearances

**Admin Fields:**
- Appearances
- Passes
- Pass Completion (%)
- Tackles
- Assists
- FIFA Registered

**Example:**
```
Player Name (Midfielder)
🎯 287  📊 84%  🛡️ 12  🏃 15
```

---

### ⚽ **Forward**

**Displayed on Squad Page:**
- ⚽ Goals
- 🎯 Assists
- 🔫 Shots
- 🏃 Appearances

**Admin Fields:**
- Appearances
- Goals
- Assists
- Shots
- Shot Accuracy (%)
- Dribbles
- FIFA Registered

**Example:**
```
Player Name (Forward)
⚽ 8  🎯 3  🔫 24  🏃 15
```

---

## How to Add/Edit Player Stats

### Via Admin Panel

1. **Go to** `/admin/players`
2. **Click Edit** (pencil icon) on a player
3. **Select their position** (auto-fills relevant fields)
4. **Enter stats:**
   - Fill in all relevant numbers
   - Leave blank = 0
5. **Check FIFA Registered** if verified with FIFA Connect
6. **Save**

### Via API

```bash
PATCH /api/players/{playerId}
Content-Type: application/json

# For Center Back
{
  "position": "Center Back",
  "appearances": 15,
  "tackles": 28,
  "interceptions": 14,
  "clearances": 35,
  "blocks": 8,
  "fifaRegistered": true
}

# For Forward
{
  "position": "Forward",
  "appearances": 15,
  "goals": 8,
  "assists": 3,
  "shots": 24,
  "shotAccuracy": 33,
  "dribbles": 12,
  "fifaRegistered": true
}
```

---

## Database Fields

```prisma
model Player {
  // Common
  appearances      Int @default(0)
  fifaRegistered   Boolean @default(false)

  // Goalkeeper
  saves            Int?
  cleanSheets      Int?
  goalsAgainst     Int?

  // Defender/Center Back
  tackles          Int?
  interceptions    Int?
  clearances       Int?
  blocks           Int?

  // Midfielder
  passes           Int?
  passCompletion   Int? // 0-100

  // Forward
  goals            Int?
  assists          Int?
  shots            Int?
  shotAccuracy     Int? // 0-100
  dribbles         Int?
}
```

---

## Squad Page Display Logic

The `/squad` page automatically shows stats based on position:

```javascript
// Goalkeeper
if (position === 'Goalkeeper') {
  show: [saves, cleanSheets]
}

// Defender/Center Back
if (position === 'Defender' || position === 'Center Back') {
  show: [tackles, interceptions, clearances]
}

// Midfielder
if (position === 'Midfielder') {
  show: [passes, passCompletion, tackles]
}

// Forward
if (position === 'Forward') {
  show: [goals, assists, shots]
}

// All positions
show: [appearances]
```

---

## Example: Wesley Mwenda Stats

**Wesley Mwenda — #9 Captain, Center Back**

Admin Form:
```
Position: Center Back
Appearances: 15
Tackles: 28
Interceptions: 14
Clearances: 35
Blocks: 8
FIFA Registered: ✓
```

Squad Page Display:
```
Wesley Mwenda
CENTER BACK [Green checkmark for FIFA]
🛡️ 28  🎯 14  📍 35  🏃 15
```

---

## Tips

1. **Appearance tracking:**
   - Increase appearances each time player features
   - Used for all positions

2. **Pass completion for midfielders:**
   - Track out of 100 (e.g., 85%)
   - Shows overall accuracy

3. **Shot accuracy for forwards:**
   - Track out of 100 (e.g., 33%)
   - Shots converted / total shots attempt

4. **Clean sheets for defenders:**
   - When goalkeeper has clean sheet, award to defending team
   - Shows collective defensive performance

5. **FIFA Registration:**
   - Check when verified with FIFA Connect
   - Shows green checkmark on squad page
   - Can be auto-synced if API available

---

## Real-Time Updates

Stats update immediately:
1. Edit player in admin
2. Save changes
3. Visit `/squad` → stats updated instantly
4. No cache, always live data

---

## FAQ

**Q: Can a midfielder have goals?**
A: Yes! Midfielders can score. Admin has assists field for midfielders. Use API to add goals if needed.

**Q: Can a forward have tackles?**
A: Yes! Forwards have defensive stats. Use API to add tackles if forward contributes defensively.

**Q: Are all stats required?**
A: No. Leave blank = 0. Only fill in relevant stats.

**Q: How do I change a player's position?**
A: Edit player → change position → admin form updates to show new stats fields.

---

## Current Status

✅ Schema ready for position-specific stats
✅ Squad page displays correct stats per position
✅ Admin panel ready to input stats
⏳ Photo upload (in development)
⏳ FIFA Connect sync (when API available)

