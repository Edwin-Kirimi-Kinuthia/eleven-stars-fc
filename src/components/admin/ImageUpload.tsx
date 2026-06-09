'use client'

import { useState } from 'react'
import { Upload, X, Loader2 } from 'lucide-react'

interface ImageUploadProps {
  value: string | null
  onChange: (url: string) => void
  label: string
}

export default function ImageUpload({ value, onChange, label }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(value)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (res.ok) {
        const data = await res.json()
        onChange(data.url)
        setPreview(data.url)
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <label className="text-gray-400 text-xs font-bold block mb-2">{label}</label>

      <div className="space-y-3">
        {preview && (
          <div className="relative w-full h-40 rounded-lg overflow-hidden bg-black/40 border border-white/10">
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            <button
              onClick={() => {
                setPreview(null)
                onChange('')
              }}
              className="absolute top-2 right-2 p-1 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400"
            >
              <X size={16} />
            </button>
          </div>
        )}

        <label className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg border-2 border-dashed border-white/20 hover:border-white/40 cursor-pointer transition-colors">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />
          {uploading ? (
            <Loader2 size={20} className="text-pink animate-spin" />
          ) : (
            <>
              <Upload size={20} className="text-gray-400" />
              <span className="text-gray-400 text-xs">Click to upload image</span>
            </>
          )}
        </label>
      </div>
    </div>
  )
}
