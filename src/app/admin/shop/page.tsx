'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, Pencil, Trash2, Loader2 } from 'lucide-react'
import ImageUpload from '@/components/admin/ImageUpload'

interface Product {
  id: string
  name: string
  price: number
  category: string
  description: string
  emoji: string
  badge?: string
  stock: number
  photo?: string
  sizes?: string
  colors?: string
}

const categories = ['Jerseys', 'Accessories', 'Training Gear']

export default function AdminShopPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/products')
      const data = await res.json()
      if (Array.isArray(data)) {
        setProducts(data)
      } else {
        console.error('API returned non-array data:', data)
        setProducts([])
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const handleSaveProduct = async () => {
    if (!editingProduct) return

    try {
      const method = editingProduct.id.startsWith('new-') ? 'POST' : 'PATCH'
      const url = editingProduct.id.startsWith('new-')
        ? '/api/products'
        : `/api/products/${editingProduct.id}`

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingProduct),
      })

      if (res.ok) {
        await fetchProducts()
        setEditingProduct(null)
      }
    } catch (error) {
      console.error('Error saving product:', error)
    }
  }

  const deleteProduct = async (id: string) => {
    if (!confirm('Delete this product?')) return

    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' })
      if (res.ok) {
        await fetchProducts()
      }
    } catch (error) {
      console.error('Error deleting product:', error)
    }
  }

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return <div className="p-8 flex items-center justify-center min-h-screen"><Loader2 size={32} className="text-pink animate-spin" /></div>
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-white text-2xl font-black">Merchandise</h1>
          <p className="text-gray-400 text-sm mt-0.5">{products.length} products</p>
        </div>
        <button
          onClick={() => setEditingProduct({
            id: `new-${Date.now()}`,
            name: '',
            price: 0,
            category: 'Jerseys',
            description: '',
            emoji: '👕',
            stock: 50,
            sizes: '',
            colors: '',
          })}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:scale-105" style={{ background: 'linear-gradient(135deg, #E91E8C, #C4186F)' }}
        >
          <Plus size={16} /> Add Product
        </button>
      </div>

      <div className="relative max-w-sm">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search products…"
          className="w-full pl-10 pr-4 py-2.5 rounded-xl text-white text-sm outline-none" style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.08)' }}
        />
      </div>

      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="bg-surface rounded-2xl border border-white/10 max-w-xl w-full p-6 space-y-4">
            <h2 className="text-white font-black text-xl">Edit Product</h2>

            <div className="space-y-3">
              <div>
                <label className="text-gray-400 text-xs font-bold block mb-2">Product Name</label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-400 text-xs font-bold block mb-2">Price (KES)</label>
                  <input
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white text-sm"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-xs font-bold block mb-2">Stock</label>
                  <input
                    type="number"
                    value={editingProduct.stock}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-400 text-xs font-bold block mb-2">Category</label>
                <select
                  value={editingProduct.category}
                  onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                  className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white text-sm"
                >
                  {categories.map(cat => <option key={cat}>{cat}</option>)}
                </select>
              </div>

              <div>
                <label className="text-gray-400 text-xs font-bold block mb-2">Description</label>
                <textarea
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white text-sm min-h-20"
                />
              </div>

              <div>
                <label className="text-gray-400 text-xs font-bold block mb-2">Emoji Icon</label>
                <input
                  type="text"
                  value={editingProduct.emoji}
                  onChange={(e) => setEditingProduct({ ...editingProduct, emoji: e.target.value })}
                  className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white text-sm"
                  maxLength={2}
                />
              </div>

              <div>
                <label className="text-gray-400 text-xs font-bold block mb-2">Available Sizes <span className="font-normal text-gray-600">(comma-separated, e.g. S,M,L,XL,2XL)</span></label>
                <input
                  type="text"
                  value={editingProduct.sizes || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, sizes: e.target.value })}
                  placeholder="S,M,L,XL,2XL"
                  className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white text-sm"
                />
              </div>

              <div>
                <label className="text-gray-400 text-xs font-bold block mb-2">Available Colors <span className="font-normal text-gray-600">(comma-separated, e.g. Pink/Black,White,Red)</span></label>
                <input
                  type="text"
                  value={editingProduct.colors || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, colors: e.target.value })}
                  placeholder="Pink/Black,White,Red"
                  className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white text-sm"
                />
              </div>

              <ImageUpload
                value={editingProduct.photo || null}
                onChange={(url) => setEditingProduct({ ...editingProduct, photo: url })}
                label="Product Photo (Optional)"
              />
            </div>

            <div className="flex gap-2 pt-4">
              <button
                onClick={handleSaveProduct}
                className="flex-1 px-4 py-2.5 rounded-lg bg-pink hover:bg-pink-dark text-white font-bold"
              >
                Save Product
              </button>
              <button
                onClick={() => setEditingProduct(null)}
                className="flex-1 px-4 py-2.5 rounded-lg bg-white/10 hover:bg-white/15 text-gray-300 font-bold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(product => (
          <div key={product.id} className="rounded-xl bg-surface border border-white/8 p-4">
            {product.photo ? (
              <div className="w-full h-40 rounded-lg overflow-hidden mb-2 bg-black/40">
                <img src={product.photo} alt={product.name} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="text-4xl mb-2">{product.emoji}</div>
            )}
            <h3 className="text-white font-bold text-sm mb-1">{product.name}</h3>
            <p className="text-gray-400 text-xs mb-3 line-clamp-2">{product.description}</p>
            <div className="flex items-center justify-between mb-3">
              <span className="text-pink font-bold">KES {product.price.toLocaleString()}</span>
              <span className="text-xs text-gray-500">Stock: {product.stock}</span>
            </div>
            <span className="text-xs bg-white/10 text-gray-300 px-2 py-1 rounded-full block mb-3 text-center">{product.category}</span>
            <div className="flex gap-2">
              <button onClick={() => setEditingProduct(product)} className="flex-1 p-2 rounded-lg bg-white/10 hover:bg-white/15 text-gray-400 text-sm transition-colors"><Pencil size={14} className="mx-auto" /></button>
              <button onClick={() => deleteProduct(product.id)} className="flex-1 p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm transition-colors"><Trash2 size={14} className="mx-auto" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
