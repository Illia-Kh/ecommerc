interface ProductSchemaProps {
  product: {
    slug: string;
    titleCs: string;
    titleUk: string;
    descriptionCs?: string;
    descriptionUk?: string;
    priceCZK: number;
    stock: number;
    images: string[];
  };
  locale?: 'cs' | 'uk';
}

export function ProductSchema({ product, locale = 'cs' }: ProductSchemaProps) {
  const title = locale === 'cs' ? product.titleCs : product.titleUk;
  const description = locale === 'cs' ? product.descriptionCs : product.descriptionUk;
  const baseUrl = process.env.SITE_URL || 'http://localhost:3000';
  const productUrl = `${baseUrl}/product/${product.slug}`;
  const imageUrl = Array.isArray(product.images) ? product.images[0] : (product.images as any)[0];

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: title,
    description: description,
    image: imageUrl,
    url: productUrl,
    sku: product.slug,
    offers: {
      '@type': 'Offer',
      price: product.priceCZK,
      priceCurrency: 'CZK',
      availability: product.stock > 0 
        ? 'https://schema.org/InStock' 
        : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'E-Shop',
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}