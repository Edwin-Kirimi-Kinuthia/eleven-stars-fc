'use client'

import { useEffect, useState } from 'react'
import { ShoppingCart, Plus, Minus, X, Tag, Loader2 } from 'lucide-react'
import ManualPaymentModal from '@/components/ui/ManualPaymentModal'
import PageHeader from '@/components/ui/PageHeader'

const categories = ['All', 'Jerseys', 'Accessories', 'Training Gear']

interface Product {
  id: string
  name: string
  category: string
  price: number
  description: string
  badge?: string | null
  emoji: string
  photo?: string | null
  stock: number
  sizes?: string | null
  colors?: string | null
}

interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  qty: number
  size?: string
  color?: string
}

function parseCsv(val?: string | null): string[] {
  if (!val) return []
  return val.split(',').map(s => s.trim()).filter(Boolean)
}

function cartKey(productId: string, size?: string, color?: string) {
  return `${productId}|${size || ''}|${color || ''}`
}

export default function ShopClient() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('All')
  const [cart, setCart] = useState<CartItem[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [payOpen, setPayOpen] = useState(false)

  // Per-product selection state
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({})
  const [selectedColors, setSelectedColors] = useState<Record<string, string>>({})

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => setProducts(Array.isArray(data) ? data : []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [])

  const filtered = activeCategory === 'All' ? products : products.filter(p => p.category === activeCategory)
  const totalItems = cart.reduce((s, i) => s + i.qty, 0)
  const totalAmount = cart.reduce((s, i) => s + i.price * i.qty, 0)

  const addToCart = (p: Product) => {
    const sizeList = parseCsv(p.sizes)
    const colorList = parseCsv(p.colors)
    const size = selectedSizes[p.id]
    const color = selectedColors[p.id]
    if (sizeList.length > 0 && !size) return
    if (colorList.length > 0 && !color) return

    const key = cartKey(p.id, size, color)
    const label = [p.name, size, color].filter(Boolean).join(' · ')
    setCart(prev => {
      const existing = prev.find(i => i.id === key)
      if (existing) return prev.map(i => i.id === key ? { ...i, qty: i.qty + 1 } : i)
      return [...prev, { id: key, productId: p.id, name: label, price: p.price, qty: 1, size, color }]
    })
  }

  const updateQty = (id: string, delta: number) => {
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty: i.qty + delta } : i).filter(i => i.qty > 0))
  }

  const isInCart = (p: Product) => {
    const size = selectedSizes[p.id]
    const color = selectedColors[p.id]
    return cart.find(i => i.id === cartKey(p.id, size, color))
  }

  const canAddToCart = (p: Product) => {
    const sizeList = parseCsv(p.sizes)
    const colorList = parseCsv(p.colors)
    if (sizeList.length > 0 && !selectedSizes[p.id]) return false
    if (colorList.length > 0 && !selectedColors[p.id]) return false
    return true
  }

  return (
    <div className="bg-base text-white">
      <PageHeader eyebrow="Official Store" title="Club" highlight="Shop" description="Rep the pink and black. Wear your pride." />

      {/* Category filters */}
      <section className="py-6 border-b border-white/8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                  activeCategory === cat
                    ? 'bg-pink text-white'
                    : 'bg-white/8 hover:bg-white/12 text-gray-300'
                }`}>
                {cat}
              </button>
            ))}
          </div>
          <button onClick={() => setCartOpen(true)}
            className="relative inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/8 hover:bg-white/12 text-gray-300 font-semibold text-sm transition-colors">
            <ShoppingCart size={16} /> Cart
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 size-5 rounded-full bg-pink text-white text-xs font-black flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </section>

      {/* Products grid */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 size={32} className="text-pink animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-10 rounded-2xl bg-surface border border-white/8 text-center">
              <p className="text-gray-400 text-sm">
                {products.length === 0
                  ? 'Merchandise will be available here soon. Check back shortly!'
                  : 'No products in this category yet.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(product => {
                const sizeList = parseCsv(product.sizes)
                const colorList = parseCsv(product.colors)
                const inCart = isInCart(product)
                const soldOut = product.stock <= 0
                const canAdd = canAddToCart(product)

                return (
                  <div key={product.id}
                    className="group rounded-2xl bg-surface border border-white/8 hover:border-white/15 transition-all overflow-hidden hover:-translate-y-1">
                    <div className="h-1 w-full bg-gradient-to-r from-gold via-pink to-gold opacity-0 group-hover:opacity-100 transition-opacity" />

                    {/* Image area with zoom */}
                    <div className="aspect-square flex items-center justify-center text-7xl bg-white/3 relative overflow-hidden">
                      {product.photo ? (
                        <img
                          src={product.photo}
                          alt={product.name}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <span className="transition-transform duration-500 group-hover:scale-110 inline-block">
                          {product.emoji}
                        </span>
                      )}
                      {product.badge && (
                        <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-pink text-white text-xs font-bold flex items-center gap-1 z-10">
                          <Tag size={11} /> {product.badge}
                        </div>
                      )}
                    </div>

                    {/* Product info */}
                    <div className="p-6">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="text-white font-black text-base">{product.name}</h3>
                        <span className="gradient-text-pink font-black whitespace-nowrap">KES {product.price.toLocaleString()}</span>
                      </div>
                      <p className="text-gray-500 text-sm mb-4 leading-relaxed">{product.description}</p>

                      {/* Size selector */}
                      {sizeList.length > 0 && (
                        <div className="mb-4">
                          <p className="text-gray-400 text-xs font-semibold mb-2">Select Size</p>
                          <div className="flex flex-wrap gap-2">
                            {sizeList.map(size => (
                              <button
                                key={size}
                                onClick={() => setSelectedSizes(prev => ({ ...prev, [product.id]: prev[product.id] === size ? '' : size }))}
                                className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                                style={{
                                  background: selectedSizes[product.id] === size ? '#E91E8C' : 'rgba(255,255,255,0.06)',
                                  color: selectedSizes[product.id] === size ? '#fff' : '#9CA3AF',
                                  border: `1px solid ${selectedSizes[product.id] === size ? '#E91E8C' : 'rgba(255,255,255,0.1)'}`,
                                }}
                              >
                                {size}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Color selector */}
                      {colorList.length > 0 && (
                        <div className="mb-4">
                          <p className="text-gray-400 text-xs font-semibold mb-2">Select Color</p>
                          <div className="flex flex-wrap gap-2">
                            {colorList.map(color => (
                              <button
                                key={color}
                                onClick={() => setSelectedColors(prev => ({ ...prev, [product.id]: prev[product.id] === color ? '' : color }))}
                                className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                                style={{
                                  background: selectedColors[product.id] === color ? '#C9A84C' : 'rgba(255,255,255,0.06)',
                                  color: selectedColors[product.id] === color ? '#0A0A0A' : '#9CA3AF',
                                  border: `1px solid ${selectedColors[product.id] === color ? '#C9A84C' : 'rgba(255,255,255,0.1)'}`,
                                }}
                              >
                                {color}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {soldOut ? (
                        <p className="w-full py-3 rounded-full bg-white/5 text-gray-500 font-bold text-center text-sm">Sold Out</p>
                      ) : inCart ? (
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/8">
                            <button onClick={() => updateQty(inCart.id, -1)} className="text-gray-400 hover:text-pink transition-colors"><Minus size={14} /></button>
                            <span className="text-white font-bold flex-1 text-center">{inCart.qty}</span>
                            <button onClick={() => updateQty(inCart.id, 1)} className="text-gray-400 hover:text-pink transition-colors"><Plus size={14} /></button>
                          </div>
                          <p className="text-pink text-xs font-bold text-center">In Cart</p>
                        </div>
                      ) : (
                        <button
                          onClick={() => addToCart(product)}
                          disabled={!canAdd}
                          className="btn-shimmer w-full py-3 rounded-full bg-pink hover:bg-pink-dark text-white font-bold transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                          {!canAdd ? (
                            <span className="text-sm">
                              {sizeList.length > 0 && !selectedSizes[product.id]
                                ? 'Select a size'
                                : 'Select a color'}
                            </span>
                          ) : 'Add to Cart'}
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* Cart drawer */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 lg:flex justify-end" onClick={() => setCartOpen(false)}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm lg:hidden" />
          <div className="absolute inset-y-0 right-0 w-full max-w-sm bg-surface border-l border-white/8 flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/8">
              <div className="flex items-center gap-2">
                <ShoppingCart size={18} className="text-pink" />
                <span className="text-white font-bold">Your Cart</span>
              </div>
              <button onClick={() => setCartOpen(false)} className="text-gray-400 hover:text-white transition-colors"><X size={18} /></button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingCart size={40} className="text-gray-700 mb-3" />
                  <p className="text-gray-500 text-sm">Your cart is empty</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="flex items-center gap-4 p-4 rounded-xl bg-white/5">
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-semibold truncate">{item.name}</p>
                      <p className="text-pink text-sm font-bold">KES {item.price.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-2 bg-white/8 rounded-lg p-1">
                      <button onClick={() => updateQty(item.id, -1)} className="p-1 text-gray-400 hover:text-white"><Minus size={12} /></button>
                      <span className="text-white font-bold text-sm w-5 text-center">{item.qty}</span>
                      <button onClick={() => updateQty(item.id, 1)} className="p-1 text-gray-400 hover:text-white"><Plus size={12} /></button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="px-6 py-5 space-y-4 border-t border-white/8">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Total</span>
                  <span className="text-white font-black text-lg">KES {totalAmount.toLocaleString()}</span>
                </div>
                <button
                  onClick={() => { setCartOpen(false); setPayOpen(true) }}
                  className="btn-shimmer w-full py-4 rounded-full bg-pink hover:bg-pink-dark text-white font-bold transition-colors">
                  Pay via M-Pesa
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <ManualPaymentModal
        isOpen={payOpen}
        onClose={() => setPayOpen(false)}
        amount={totalAmount}
        description={`Eleven Stars FC Shop · ${totalItems} item(s)`}
        cartItems={cart}
        onSuccess={() => { setCart([]); setSelectedSizes({}); setSelectedColors({}) }}
      />
    </div>
  )
}
