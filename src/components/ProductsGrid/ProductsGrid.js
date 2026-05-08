'use client';

import { useState, useEffect, useCallback } from 'react';
import ProductCard from '@/components/ProductCard/ProductCard';
import { Search, Package, ChevronLeft, ChevronRight, X } from 'lucide-react';

const LIMIT = 12;

export default function ProductsGrid() {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async (q, p) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: LIMIT, page: p });
      if (q) params.set('search', q);
      const res = await fetch(`/api/products?${params}`);
      const data = await res.json();
      setProducts(data.products);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts(query, page);
  }, [query, page, fetchProducts]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setQuery(search);
  };

  const clearSearch = () => {
    setSearch('');
    setQuery('');
    setPage(1);
  };

  return (
    <div>
      {/* Search bar */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="relative max-w-lg">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre, marca o categoría..."
            className="w-full h-12 pl-11 pr-10 border border-border bg-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black transition-all"
          />
          {search && (
            <button type="button" onClick={clearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
              <X size={16} />
            </button>
          )}
        </div>
      </form>

      {/* Results count */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">
          {loading ? 'Cargando...' : `${total} artículo${total !== 1 ? 's' : ''}${query ? ` para "${query}"` : ''}`}
        </p>
        {query && (
          <button onClick={clearSearch} className="text-xs text-black underline underline-offset-2 hover:text-muted-foreground transition-colors">
            Limpiar búsqueda
          </button>
        )}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: LIMIT }).map((_, i) => (
            <div key={i} className="aspect-[3/4] rounded-xl bg-secondary/40 animate-pulse" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-center gap-4">
          <div className="h-16 w-16 rounded-full bg-secondary/50 flex items-center justify-center">
            <Package size={28} className="text-muted-foreground/40" />
          </div>
          <p className="text-muted-foreground italic">
            {query ? `No se encontraron productos para "${query}".` : 'No hay productos disponibles.'}
          </p>
          {query && (
            <button onClick={clearSearch} className="text-xs font-bold uppercase tracking-widest text-black border-b border-black/20 hover:border-black transition-all">
              Ver todos los productos →
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && !loading && (
        <div className="flex items-center justify-center gap-2 mt-12">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="h-10 w-10 flex items-center justify-center border border-border rounded-lg hover:bg-secondary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={16} />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
            const isEllipsis =
              totalPages > 7 &&
              p !== 1 &&
              p !== totalPages &&
              (p < page - 2 || p > page + 2);
            const isPrevEllipsis =
              totalPages > 7 && p === 2 && page > 4;
            const isNextEllipsis =
              totalPages > 7 && p === totalPages - 1 && page < totalPages - 3;

            if (isEllipsis && !isPrevEllipsis && !isNextEllipsis) return null;
            if (isEllipsis)
              return (
                <span key={p} className="h-10 w-10 flex items-center justify-center text-muted-foreground text-sm">
                  …
                </span>
              );

            return (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`h-10 w-10 flex items-center justify-center border rounded-lg text-sm font-medium transition-colors ${
                  page === p
                    ? 'bg-black text-white border-black'
                    : 'border-border hover:bg-secondary'
                }`}
              >
                {p}
              </button>
            );
          })}

          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="h-10 w-10 flex items-center justify-center border border-border rounded-lg hover:bg-secondary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
