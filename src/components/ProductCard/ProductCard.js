'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, Shield } from 'lucide-react';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  const formatPrice = (price) =>
    new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(price);

  const mainImage = product.images?.[0];

  return (
    <div className="group flex flex-col h-full overflow-hidden rounded-xl border border-border/50 hover:border-black/20 hover:shadow-lg transition-all duration-300">
      {/* Image area — bg matches page so it blends seamlessly */}
      <Link
        href={`/products/${product.category}/${product.slug}`}
        className="relative block w-full bg-[#f9f7f4] focus:outline-none"
        style={{ height: '220px' }}
      >
        {mainImage ? (
          <img
            src={mainImage.replace(/['"]/g, '')}
            alt={product.name}
            className="w-full h-full object-contain transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground/30 text-sm">
            Sin imagen
          </div>
        )}
        {product.featured && (
          <div className="absolute top-3 left-3 bg-black text-white text-[9px] uppercase font-bold px-2.5 py-1 tracking-widest rounded-full z-10 shadow-sm">
            Destacado
          </div>
        )}
      </Link>

      {/* White content section */}
      <div className="flex flex-col flex-grow bg-white p-4">
        <Link href={`/products/${product.category}/${product.slug}`} className="flex-grow flex flex-col focus:outline-none">
          <span className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-1 line-clamp-1">
            {product.brand}
          </span>
          <h3 className="font-serif text-base font-medium leading-snug text-foreground mb-2 line-clamp-2 group-hover:text-amber-600 transition-colors">
            {product.name}
          </h3>
          <p className="text-sm font-semibold tracking-wide text-foreground mt-auto">
            {formatPrice(product.price)}
          </p>
          <div className="flex items-center gap-1 mt-1.5">
            <Shield size={10} className="text-emerald-600 shrink-0" />
            <span className="text-[9px] text-emerald-600 font-semibold uppercase tracking-wider">Garantía 2 años</span>
          </div>
        </Link>

        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/50">
          <Link
            href={`/products/${product.category}/${product.slug}`}
            className="flex-1 text-center bg-secondary/50 hover:bg-secondary text-secondary-foreground text-[10px] font-bold uppercase tracking-widest h-9 rounded-lg flex items-center justify-center transition-colors"
          >
            Ver Detalles
          </Link>
          <button
            onClick={() => addToCart(product)}
            className="w-9 h-9 flex items-center justify-center bg-black text-white rounded-lg hover:bg-black/80 transition-all shadow-md active:scale-95 shrink-0"
            aria-label="Añadir al carrito"
            title="Añadir al carrito"
          >
            <ShoppingCart size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
