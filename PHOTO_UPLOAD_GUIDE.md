# Photo Upload Feature Guide

## Overview

You can now upload photos for players and merchandise products directly from the admin panel.

## How to Upload Player Photos

1. **Go to** `/admin/players`
2. **Click** "Add Player" or edit an existing player
3. **Scroll to** "Player Photo" section
4. **Click** the upload area or drag & drop an image
5. **Preview** appears automatically
6. **Click** "Save Player"
7. ✅ Photo displays on `/squad` page

## How to Upload Product Photos

1. **Go to** `/admin/shop`
2. **Click** "Add Product" or edit a product
3. **Scroll to** "Product Photo" section
4. **Click** the upload area or drag & drop an image
5. **Click** "Save Product"
6. ✅ Photo displays on `/shop` page instead of emoji

## Supported Formats

- JPG / JPEG
- PNG
- WebP
- GIF
- SVG

## Best Practices

### Player Photos
- **Size:** 400×500 pixels (portrait)
- **File size:** Under 2MB
- **Format:** PNG or JPG
- **Tips:**
  - Use high-quality headshots
  - Consistent lighting
  - Solid background preferred
  - Include jersey/uniform

### Product Photos
- **Size:** 600×600 pixels (square)
- **File size:** Under 2MB
- **Format:** PNG or JPG
- **Tips:**
  - Show product clearly
  - Good lighting
  - Include any logos/designs
  - White or neutral background

## Storage

Images are currently stored as **data URLs** in your browser session. 

### For Production:
Consider upgrading to cloud storage:

#### **Option 1: Supabase Storage** (Recommended)
```bash
npm install @supabase/supabase-js
```

Then update `/api/upload` to upload to Supabase:
```typescript
const { data, error } = await supabase.storage
  .from('products')
  .upload(`${Date.now()}-${file.name}`, file)
```

#### **Option 2: Cloudinary**
```bash
npm install next-cloudinary
```

Then use Cloudinary widget in ImageUpload component.

#### **Option 3: AWS S3**
```bash
npm install aws-sdk
```

Then configure S3 bucket for uploads.

## Features

✅ **Drag & Drop** - Drag images directly onto upload area
✅ **Preview** - See image before saving
✅ **Remove** - Click X to remove uploaded image
✅ **Loading State** - Shows spinner during upload
✅ **Error Handling** - Clear error messages

## Troubleshooting

### Image not showing after upload?
- Refresh the page
- Check browser console for errors
- Verify image file is valid

### Upload takes too long?
- Check file size (keep under 2MB)
- Ensure good internet connection
- Try a different image format

### Can't remove image?
- Click the X button in the preview
- Re-save the player/product

## Future Enhancements

- [ ] Cloud storage integration
- [ ] Image optimization/compression
- [ ] Crop/resize tool
- [ ] Multiple images per product
- [ ] Image gallery for squad

## Related Files

- `src/components/admin/ImageUpload.tsx` - Upload component
- `src/app/api/upload/route.ts` - Upload API endpoint
- `src/app/admin/players/page.tsx` - Player admin with photos
- `src/app/admin/shop/page.tsx` - Product admin with photos

---

**Images enhance your team's brand!** 📸
