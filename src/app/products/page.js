import SectionHeading from '@/components/SectionHeading/SectionHeading';
import CategoryCard from '@/components/CategoryCard/CategoryCard';
import ProductCard from '@/components/ProductCard/ProductCard';
import { categories } from '@/data/products';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { ArrowRight, SlidersHorizontal, Package } from 'lucide-react';

export const metadata = {
  title: 'Nuestros Productos | MuraHomes',
  description: 'Explora nuestras colecciones de muebles de lujo excepcionales.',
};

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    take: 12,
    orderBy: { createdAt: 'desc' },
  });

  return (
    <>
      {/* ── PAGE HERO ─────────────────────────────────────────── */}
      <section className="relative bg-[#f9f7f4] overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[#f0ece4]" style={{ clipPath: 'polygon(12% 0, 100% 0, 100% 100%, 0% 100%)' }} />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-10 bg-black" />
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/50">500+ Piezas Seleccionadas</span>
              </div>
              <h1 className="font-serif text-5xl md:text-6xl font-semibold leading-[1.05] tracking-tight mb-6">
                Explora Nuestras <span className="text-amber-500">Colecciones</span>
              </h1>
              <p className="text-base text-muted-foreground font-light leading-relaxed mb-8 max-w-lg">
                Ocho mundos de muebles de lujo — desde salones hasta terrazas exteriores. Cada pieza seleccionada por su artesanía, materiales y diseño atemporal.
              </p>
              <div className="flex flex-wrap gap-4">
                <a href="#products" className="inline-flex items-center gap-2 bg-black text-white px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-black/80 transition-all group">
                  Ver Todo <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </a>
                <a href="#categories" className="inline-flex items-center gap-2 border border-black/20 text-black px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] hover:border-black transition-all">
                  Por Categoría
                </a>
              </div>
            </div>
            <div className="relative h-[380px] lg:h-[480px]">
              <div className="grid grid-cols-2 gap-3 h-full">
                <div
                  className="rounded-2xl bg-cover bg-center shadow-lg"
                  style={{ backgroundImage: 'url("/images/img5.jpg")' }}
                />
                <div className="flex flex-col gap-3">
                  <div
                    className="flex-1 rounded-2xl bg-cover bg-center shadow-lg"
                    style={{ backgroundImage: 'url("/images/img4.jpg")' }}
                  />
                  <div
                    className="flex-1 rounded-2xl bg-cover bg-center shadow-lg"
                    style={{ backgroundImage: 'url("/images/img1.jpg")' }}
                  />
                </div>
              </div>
              <div className="absolute -bottom-4 left-4 bg-white rounded-2xl shadow-xl px-5 py-4">
                <p className="text-2xl font-bold font-serif">8</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Colecciones</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ──────────────────────────────────────────── */}
      <section id="categories" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground block mb-2">Explorar por</span>
              <h2 className="font-serif text-3xl font-semibold">Nuestras <span className="text-amber-500">Categorías</span></h2>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* ── ALL PRODUCTS ────────────────────────────────────────── */}
      <section id="products" className="py-20 bg-[#f9f7f4]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground block mb-2">El Catálogo Completo</span>
              <h2 className="font-serif text-3xl font-semibold">Todos los <span className="text-amber-500">Productos</span></h2>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
              <SlidersHorizontal size={14} />
              <span className="uppercase tracking-wider font-semibold">{products.length} artículos</span>
            </div>
          </div>

          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-center gap-4">
              <div className="h-16 w-16 rounded-full bg-secondary/50 flex items-center justify-center">
                <Package size={28} className="text-muted-foreground/40" />
              </div>
              <p className="text-muted-foreground italic">Los productos aparecerán aquí una vez añadidos desde el panel de administración.</p>
              <Link href="/admin/products/new" className="text-xs font-bold uppercase tracking-widest text-black border-b border-black/20 hover:border-black transition-all">
                Añadir Productos →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── CTA STRIP ───────────────────────────────────────────── */}
      <section className="py-16 bg-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-amber-400 mb-2">¿Necesitas ayuda para elegir?</p>
            <h3 className="font-serif text-2xl font-medium text-white">Reserva una consulta de diseño privada</h3>
          </div>
          <Link href="/showroom" className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-amber-400 transition-all group shrink-0">
            Reservar Ahora <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </>
  );
}
