import { notFound } from 'next/navigation';
import Image from 'next/image';
import { db } from '@/lib/db';
import { formatPrice } from '@/lib/utils';
import { ProductSchema } from '@/components/product-schema';
import { AddToCartButton } from './add-to-cart-button';

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: ProductPageProps) {
  const product = await db.product.findUnique({
    where: { slug: params.slug },
  });

  if (!product) {
    return {
      title: 'Produkt nenalezen',
    };
  }

  return {
    title: product.titleCs,
    description: product.descriptionCs,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await db.product.findUnique({
    where: { slug: params.slug },
    include: { category: true },
  });

  if (!product || !product.isActive) {
    notFound();
  }

  const images = product.images as string[];

  return (
    <div className="bg-white">
      <ProductSchema product={product} />
      
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8">
          {/* Image gallery */}
          <div className="aspect-square w-full">
            <Image
              src={images[0] || '/placeholder.jpg'}
              alt={product.titleCs}
              width={600}
              height={600}
              className="h-full w-full object-cover object-center rounded-lg"
              priority
            />
          </div>

          {/* Product info */}
          <div className="mt-10 lg:mt-0">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              {product.titleCs}
            </h1>

            <div className="mt-6">
              <h2 className="sr-only">Informace o produktu</h2>
              <p className="text-3xl tracking-tight text-gray-900">
                {formatPrice(product.priceCZK)}
              </p>
            </div>

            {product.descriptionCs && (
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900">Popis</h3>
                <div className="mt-4 space-y-6">
                  <p className="text-base text-gray-900">
                    {product.descriptionCs}
                  </p>
                </div>
              </div>
            )}

            <div className="mt-6">
              <div className="flex items-center">
                <h3 className="text-sm font-medium text-gray-900">
                  Skladem:
                </h3>
                <p className="ml-2 text-sm text-gray-700">
                  {product.stock} ks
                </p>
              </div>
            </div>

            <div className="mt-10">
              {product.stock > 0 ? (
                <AddToCartButton product={product} />
              ) : (
                <button
                  disabled
                  className="w-full rounded-md bg-gray-300 px-8 py-3 text-base font-medium text-gray-500 cursor-not-allowed"
                >
                  Vyprodáno
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}