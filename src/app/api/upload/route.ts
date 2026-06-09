import { NextResponse } from 'next/server'
import { getStorageClient, STORAGE_BUCKET } from '@/lib/storage'

const MAX_SIZE = 5 * 1024 * 1024

const ALLOWED_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
]

// Wrap the Supabase upload in a race against a timeout so a missing bucket
// or unreachable project never hangs the request for minutes.
async function uploadToStorage(
  buffer: Buffer,
  path: string,
  contentType: string,
): Promise<{ url: string } | null> {
  const supabase = getStorageClient()
  if (!supabase) return null

  try {
    const uploadPromise = supabase.storage
      .from(STORAGE_BUCKET)
      .upload(path, buffer, { contentType, upsert: false })

    const timeoutPromise = new Promise<{ data: null; error: Error }>(resolve =>
      setTimeout(() => resolve({ data: null, error: new Error('Storage timeout after 8 s') }), 8000)
    )

    const { error } = await Promise.race([uploadPromise, timeoutPromise])

    if (error) {
      console.warn('Supabase storage upload failed, falling back to data URL:', error.message)
      return null
    }

    const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path)
    return { url: data.publicUrl }
  } catch (err) {
    console.warn('Supabase storage error, falling back to data URL:', err)
    return null
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (file.type && !ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Unsupported file type. Use JPG, PNG, WebP, GIF or SVG.' },
        { status: 400 }
      )
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5 MB.' },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const ext = (file.name.split('.').pop() || 'png').toLowerCase()
    const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

    const stored = await uploadToStorage(buffer, path, file.type || 'application/octet-stream')
    if (stored) {
      return NextResponse.json({ url: stored.url, name: file.name, size: file.size })
    }

    // Fallback: inline data URL — always works, no external dependency needed.
    const base64 = buffer.toString('base64')
    const dataUrl = `data:${file.type || 'image/png'};base64,${base64}`
    return NextResponse.json({ url: dataUrl, name: file.name, size: file.size })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
