import { categories } from '@/data/products';
import ProductCard from '@/components/ProductCard/ProductCard';
import SectionHeading from '@/components/SectionHeading/SectionHeading';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import CategoryPixelTracker from '@/components/CategoryPixelTracker/CategoryPixelTracker';

export async function generateMetadata({ params }) {
  const { category } = await params;
  const categoryData = categories.find(c => c.id === category);

  if (!categoryData) return { title: 'Categoría no encontrada' };

  return {
    title: `${categoryData.name} | MuraHomes`,
    description: categoryData.description,
  };
}

export default async function CategoryPage({ params }) {
  const { category } = await params;
  const categoryData = categories.find(c => c.id === category);

  if (!categoryData) {
    notFound();
  }

  const categoryProducts = await prisma.product.findMany({
    where: { category },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <>
      <CategoryPixelTracker categoryName={categoryData.name} />
      <div className="relative pt-32 pb-24 bg-secondary/30">
        <div className="container mx-auto px-4 lg:px-8">
          <Breadcrumb className="mb-8">
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
                <BreadcrumbPage>{categoryData.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="max-w-3xl">
            <h1 className="font-serif text-5xl lg:text-6xl font-medium tracking-tight mb-6">
              {categoryData.name}
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed font-light">
              {categoryData.description}
            </p>
          </div>
        </div>
      </div>

      <section className="py-24 bg-white min-h-[50vh]">
        <div className="container mx-auto px-4 lg:px-8">
          {categoryProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {categoryProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-secondary/20 rounded-xl border border-border">
              <h2 className="font-serif text-2xl font-medium mb-4">Colección Próximamente</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Actualmente estamos seleccionando nuevas piezas para esta colección. Por favor, vuelve más tarde.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
