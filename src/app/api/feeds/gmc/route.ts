import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const products = await db.product.findMany({
      where: { isActive: true },
      include: { category: true },
    });

    const baseUrl = process.env.SITE_URL || 'http://localhost:3000';

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>E-Shop Products</title>
    <description>Product feed for Google Merchant Center</description>
    <link>${baseUrl}</link>
    ${products.map((product) => {
      const images = product.images as string[];
      const imageUrl = images[0] || '';
      
      return `
    <item>
      <g:id>${product.id}</g:id>
      <g:title><![CDATA[${product.titleCs}]]></g:title>
      <g:description><![CDATA[${product.descriptionCs || product.titleCs}]]></g:description>
      <g:link>${baseUrl}/product/${product.slug}</g:link>
      <g:image_link>${imageUrl}</g:image_link>
      <g:condition>new</g:condition>
      <g:availability>${product.stock > 0 ? 'in_stock' : 'out_of_stock'}</g:availability>
      <g:price>${product.priceCZK / 100} CZK</g:price>
      <g:brand>E-Shop</g:brand>
      <g:gtin></g:gtin>
      <g:mpn>${product.slug}</g:mpn>
      <g:product_type>${product.category?.titleCs || 'General'}</g:product_type>
      <g:google_product_category>Electronics</g:google_product_category>
    </item>`;
    }).join('')}
  </channel>
</rss>`;

    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 's-maxage=3600, stale-while-revalidate',
      },
    });
  } catch (error) {
    console.error('GMC feed error:', error);
    return NextResponse.json({ error: 'Failed to generate feed' }, { status: 500 });
  }
}