import Image from 'next/image';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import { t } from '@/lib/i18n';

interface ProductCardProps {
  product: {
    slug: string;
    titleCs: string;
    titleUk: string;
    priceCZK: number;
    stock: number;
    images: string[];
  };
  locale?: 'cs' | 'uk';
}

export function ProductCard({ product, locale = 'cs' }: ProductCardProps) {
  const title = locale === 'cs' ? product.titleCs : product.titleUk;
  const imageUrl = Array.isArray(product.images) ? product.images[0] : (product.images as any)[0];

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <Link href={`/product/${product.slug}`}>
        <div className="aspect-square relative">
          <Image
            src={imageUrl || '/placeholder.jpg'}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
            {title}
          </h3>
          
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(product.priceCZK)}
            </span>
            
            <span className="text-sm text-gray-500">
              {t('product.stock', locale)}: {product.stock}
            </span>
          </div>
          
          {product.stock > 0 ? (
            <button className="mt-3 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
              {t('product.addToCart', locale)}
            </button>
          ) : (
            <button disabled className="mt-3 w-full bg-gray-300 text-gray-500 py-2 px-4 rounded-md cursor-not-allowed">
              Vyprodáno
            </button>
          )}
        </div>
      </Link>
    </div>
  );
}