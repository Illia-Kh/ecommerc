'use client';

import { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { trackAddToCart, trackViewItem } from '@/components/analytics-ga4';
import { trackPixelAddToCart, trackPixelViewContent } from '@/components/analytics-pixel';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface AddToCartButtonProps {
  product: {
    id: string;
    slug: string;
    titleCs: string;
    priceCZK: number;
    stock: number;
    images: any;
  };
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const [isAdding, setIsAdding] = useState(false);
  const router = useRouter();

  // Track view item on mount
  useEffect(() => {
    const item = {
      item_id: product.id,
      item_name: product.titleCs,
      item_category: 'Product',
      price: product.priceCZK / 100,
      quantity: 1,
    };

    trackViewItem('CZK', product.priceCZK, [item]);
    trackPixelViewContent(product.priceCZK);
  }, [product]);

  const handleAddToCart = async () => {
    setIsAdding(true);

    try {
      // Get existing cart from localStorage or create new one
      const existingCart = localStorage.getItem('cart');
      const cart = existingCart ? JSON.parse(existingCart) : { items: [] };

      // Check if item already exists
      const existingItemIndex = cart.items.findIndex((item: any) => item.productId === product.id);
      
      if (existingItemIndex >= 0) {
        cart.items[existingItemIndex].quantity += 1;
      } else {
        cart.items.push({
          productId: product.id,
          slug: product.slug,
          title: product.titleCs,
          price: product.priceCZK,
          quantity: 1,
          image: Array.isArray(product.images) ? product.images[0] : product.images[0],
        });
      }

      localStorage.setItem('cart', JSON.stringify(cart));

      // Track analytics
      const item = {
        item_id: product.id,
        item_name: product.titleCs,
        item_category: 'Product',
        price: product.priceCZK / 100,
        quantity: 1,
      };

      trackAddToCart('CZK', product.priceCZK, [item]);
      trackPixelAddToCart(product.priceCZK);

      // Redirect to cart after a short delay
      setTimeout(() => {
        router.push('/cart');
      }, 500);

    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={isAdding}
      className="flex w-full items-center justify-center rounded-md bg-blue-600 px-8 py-3 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      <ShoppingCart className="mr-2 h-5 w-5" />
      {isAdding ? 'Přidávám...' : 'Přidat do košíku'}
    </button>
  );
}