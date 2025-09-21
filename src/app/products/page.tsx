import { db } from '@/lib/db';
import { ProductCard } from '@/components/product-card';

export default async function ProductsPage() {
  const products = await db.product.findMany({
    where: { isActive: true },
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Všechny produkty
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Objevte naši nabídku kvalitních produktů
          </p>
        </div>

        <div className="mt-16">
          {products.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={{
                    slug: product.slug,
                    titleCs: product.titleCs,
                    titleUk: product.titleUk,
                    priceCZK: product.priceCZK,
                    stock: product.stock,
                    images: product.images as string[],
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">Zatím nejsou k dispozici žádné produkty.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}