"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Search, X, Loader2, Package } from "lucide-react"

interface SearchProduct {
  id: string; name: string; price: number; image: string
  category: { name: string }
}

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
}

export function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchProduct[]>([])
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState(0)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const debouncedQuery = useDebounce(query, 250)

  useEffect(() => {
    if (open) { setQuery(""); setResults([]); setTimeout(() => inputRef.current?.focus(), 50) }
  }, [open])

  useEffect(() => {
    if (!debouncedQuery.trim()) { setResults([]); return }
    setLoading(true)
    fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`)
      .then(r => r.json())
      .then(d => { setResults(d.results ?? []); setLoading(false); setSelected(0) })
      .catch(() => setLoading(false))
  }, [debouncedQuery])

  const navigate = useCallback((id: string) => {
    onClose()
    router.push(`/shop/${id}`)
  }, [onClose, router])

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setSelected(s => Math.min(s + 1, results.length - 1)) }
    else if (e.key === "ArrowUp") { e.preventDefault(); setSelected(s => Math.max(s - 1, 0)) }
    else if (e.key === "Enter" && results[selected]) navigate(results[selected].id)
    else if (e.key === "Escape") onClose()
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative w-full max-w-xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          {loading ? (
            <Loader2 className="h-5 w-5 text-muted-foreground animate-spin shrink-0" />
          ) : (
            <Search className="h-5 w-5 text-muted-foreground shrink-0" />
          )}
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Search jewelry, categories..."
            className="flex-1 bg-transparent text-foreground placeholder-muted-foreground focus:outline-none text-sm"
          />
          <button onClick={onClose} className="p-1 rounded hover:bg-secondary transition text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[50vh] overflow-y-auto">
          {results.length > 0 ? (
            <ul>
              {results.map((p, i) => (
                <li key={p.id}>
                  <button
                    onClick={() => navigate(p.id)}
                    onMouseEnter={() => setSelected(i)}
                    className={`w-full flex items-center gap-4 px-4 py-3 transition ${
                      selected === i ? "bg-secondary/60" : "hover:bg-secondary/30"
                    }`}
                  >
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-secondary shrink-0">
                      <Image src={p.image || "/placeholder.svg"} alt={p.name} width={48} height={48} className="object-cover w-full h-full" />
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <p className="text-foreground text-sm font-medium truncate">{p.name}</p>
                      <p className="text-muted-foreground text-xs">{p.category?.name}</p>
                    </div>
                    <p className="text-primary text-sm font-semibold shrink-0">₹{p.price.toLocaleString("en-IN")}</p>
                  </button>
                </li>
              ))}
            </ul>
          ) : query && !loading ? (
            <div className="p-8 text-center">
              <Package className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground text-sm">No results for "{query}"</p>
            </div>
          ) : !query ? (
            <div className="p-6 text-center text-muted-foreground text-sm">
              Type to search products...
            </div>
          ) : null}
        </div>

        {/* Footer hint */}
        <div className="px-4 py-2 border-t border-border flex gap-4 text-xs text-muted-foreground">
          <span>↑↓ navigate</span>
          <span>↵ select</span>
          <span>esc close</span>
        </div>
      </div>

      <style>{`
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.95) translateY(-8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-scale-in { animation: scale-in 0.15s ease; }
      `}</style>
    </div>
  )
}
