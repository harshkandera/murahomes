'use client';

import { use, useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import { categories } from '@/data/products';
import ProductGallery from '@/components/ProductGallery/ProductGallery';
import ProductCard from '@/components/ProductCard/ProductCard';
import SectionHeading from '@/components/SectionHeading/SectionHeading';
import { Button } from '@/components/ui/button';
import { toast } from "sonner";
import { RefreshCw, Shield, Truck, Wrench } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { event } from '@/lib/pixel';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export default function ProductPageClient({ params }) {
  const resolvedParams = use(params);
  const { category, slug } = resolvedParams;

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const { addToCart } = useCart();

  const categoryName = categories.find(c => c.id === category)?.name || 'Categoría';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/products?limit=1000');
        if (!res.ok) throw new Error('Failed to fetch');
        const { products: allProducts } = await res.json();

        const found = allProducts.find(p => p.slug === slug);
        if (!found) return;

        setProduct(found);
        setRelatedProducts(
          allProducts.filter(p => p.category === category && p.id !== found.id).slice(0, 3)
        );
        event('ViewContent', {
          content_ids: [found.id],
          content_name: found.name,
          content_category: found.category,
          value: found.price,
          currency: 'EUR',
        });
      } catch (error) {
        console.error('Failed to load product:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [category, slug]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(price);
  };

  const handleAddToCart = () => {
    addToCart(product);
    event('AddToCart', {
      content_ids: [product.id],
      content_name: product.name,
      content_category: product.category,
      value: product.price,
      currency: 'EUR',
    });
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4 text-muted-foreground animate-pulse font-serif">
        <RefreshCw size={40} className="animate-spin" />
        <p className="tracking-widest uppercase text-xs">Cargando detalles de la pieza...</p>
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 lg:px-8 py-24">
        {/* Breadcrumb Navigation */}
        <Breadcrumb className="mb-12">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Inicio</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/products">Productos</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/products/${category}`}>{categoryName}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{product.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="grid lg:grid-cols-2 gap-16 xl:gap-24">
          {/* Gallery */}
          <div className="lg:sticky lg:top-32 h-fit">
            <ProductGallery images={product.images} title={product.name} />
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-widest text-primary uppercase mb-4">
              {product.brand}
            </span>
            <h1 className="font-serif text-4xl lg:text-5xl font-medium tracking-tight mb-6">
              {product.name}
            </h1>
            <p className="text-2xl font-medium text-foreground mb-8">
              {formatPrice(product.price)}
            </p>

            <div
              className="prose prose-lg prose-zinc font-light leading-relaxed mb-10 text-muted-foreground border-b border-border pb-10"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />

            {/* Trust badges */}
            <div className="flex flex-wrap gap-3 mb-6">
              <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1">
                <Shield size={12} className="text-emerald-600" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Garantía 2 años</span>
              </div>
              <div className="flex items-center gap-1.5 bg-blue-50 border border-blue-200 rounded-full px-3 py-1">
                <Truck size={12} className="text-blue-600" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700">Entrega 5–15 días</span>
              </div>
              <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-full px-3 py-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">↩ 30 días devolución</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button size="lg" className="flex-1 py-6 text-sm uppercase tracking-widest" onClick={handleAddToCart}>
                Añadir a mi cesta
              </Button>
            </div>

            {/* Specifications Accordion */}
            <Accordion type="single" collapsible="true" className="w-full">
              <AccordionItem value="dimensions">
                <AccordionTrigger className="font-serif text-lg py-5 hover:text-primary">
                  Dimensiones
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                  {product.dimensions || "Las dimensiones varían según la configuración modular. Por favor, contáctenos para medidas específicas."}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="materials">
                <AccordionTrigger className="font-serif text-lg py-5 hover:text-primary">
                  Materiales y Acabados
                </AccordionTrigger>
                <AccordionContent className="pb-5">
                  <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                    {product.materials?.map((mat, idx) => (
                      <li key={idx}>{mat}</li>
                    )) || <li>Materiales premium seleccionados por artesanos.</li>}
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="shipping">
                <AccordionTrigger className="font-serif text-lg py-5 hover:text-primary">
                  <span className="flex items-center gap-2"><Truck size={16} /> Envío y Entrega</span>
                </AccordionTrigger>
                <AccordionContent className="pb-5 space-y-2 text-muted-foreground text-sm leading-relaxed">
                  <p><strong className="text-foreground">Plazo estándar:</strong> 5–15 días laborables a toda España peninsular.</p>
                  <p><strong className="text-foreground">Servicio premium:</strong> Entrega en habitación + retirada de embalaje disponible bajo petición.</p>
                  <p><strong className="text-foreground">Seguimiento:</strong> Recibirás un email con número de seguimiento en cuanto tu pedido sea enviado.</p>
                  <p><strong className="text-foreground">Coste:</strong> Envío gratuito en pedidos superiores a €500.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="assembly">
                <AccordionTrigger className="font-serif text-lg py-5 hover:text-primary">
                  <span className="flex items-center gap-2"><Wrench size={16} /> Montaje e Instalación</span>
                </AccordionTrigger>
                <AccordionContent className="pb-5 space-y-2 text-muted-foreground text-sm leading-relaxed">
                  <p><strong className="text-foreground">Estado de entrega:</strong> La mayoría de piezas llegan premontadas o requieren montaje mínimo (unión de patas, colocación de cojines).</p>
                  <p><strong className="text-foreground">Instrucciones:</strong> Todas las piezas incluyen instrucciones ilustradas paso a paso.</p>
                  <p><strong className="text-foreground">Servicio de montaje:</strong> Disponible en Gipuzkoa y alrededores. Consúltanos por WhatsApp.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="warranty">
                <AccordionTrigger className="font-serif text-lg py-5 hover:text-primary">
                  <span className="flex items-center gap-2"><Shield size={16} /> Garantía y Devoluciones</span>
                </AccordionTrigger>
                <AccordionContent className="pb-5 space-y-2 text-muted-foreground text-sm leading-relaxed">
                  <p><strong className="text-foreground">Garantía estructural:</strong> 2 años sobre marcos, soldaduras y estructura principal de todos nuestros productos.</p>
                  <p><strong className="text-foreground">Tapicería y acabados:</strong> 1 año de garantía contra defectos de fabricación.</p>
                  <p><strong className="text-foreground">Devoluciones:</strong> 30 días desde la recepción. El producto debe estar en su estado original. Gestionamos la recogida sin coste adicional.</p>
                  <p><strong className="text-foreground">Contacto:</strong> info@mura-homes.com · +34 627 080 811</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="bg-secondary/30 py-24 border-t border-border">
          <div className="container mx-auto px-4 lg:px-8">
            <SectionHeading title="Completa el Look" align="center" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {relatedProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
