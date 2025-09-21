'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { CartItem } from '@/lib/cart';

export default function CartPage() {
  const [cart, setCart] = useState<{ items: CartItem[] }>({ items: [] });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    setIsLoading(false);
  }, []);

  const updateCart = (newCart: { items: CartItem[] }) => {
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) return removeItem(productId);
    
    const updatedItems = cart.items.map(item =>
      item.productId === productId
        ? { ...item, quantity: newQuantity }
        : item
    );
    updateCart({ items: updatedItems });
  };

  const removeItem = (productId: string) => {
    const updatedItems = cart.items.filter(item => item.productId !== productId);
    updateCart({ items: updatedItems });
  };

  const total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (isLoading) {
    return (
      <div className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="text-center">
            <p>Načítám košík...</p>
          </div>
        </div>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="text-center">
            <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900">
              Váš košík je prázdný
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Začněte nákup procházením našich produktů
            </p>
            <div className="mt-8">
              <Link
                href="/products"
                className="inline-flex items-center rounded-md bg-blue-600 px-6 py-3 text-base font-medium text-white hover:bg-blue-700 transition-colors"
              >
                Prohlédnout produkty
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Nákupní košík
        </h1>

        <div className="mt-12 lg:grid lg:grid-cols-12 lg:gap-x-12">
          <div className="lg:col-span-7">
            <ul className="divide-y divide-gray-200 border-b border-t border-gray-200">
              {cart.items.map((item) => (
                <li key={item.productId} className="flex py-6 sm:py-10">
                  <div className="flex-shrink-0">
                    <Image
                      src={item.image || '/placeholder.jpg'}
                      alt={item.title}
                      width={192}
                      height={192}
                      className="h-24 w-24 rounded-md object-cover object-center sm:h-48 sm:w-48"
                    />
                  </div>

                  <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                    <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                      <div>
                        <div className="flex justify-between">
                          <h3 className="text-sm">
                            <Link
                              href={`/product/${item.slug}`}
                              className="font-medium text-gray-700 hover:text-gray-800"
                            >
                              {item.title}
                            </Link>
                          </h3>
                        </div>
                        <p className="mt-1 text-sm font-medium text-gray-900">
                          {formatPrice(item.price)}
                        </p>
                      </div>

                      <div className="mt-4 sm:mt-0 sm:pr-9">
                        <div className="flex items-center border border-gray-300 rounded-md">
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            className="p-2 text-gray-400 hover:text-gray-500"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="flex-1 text-center text-sm font-medium text-gray-900 px-2">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className="p-2 text-gray-400 hover:text-gray-500"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="absolute right-0 top-0">
                          <button
                            onClick={() => removeItem(item.productId)}
                            className="p-2 text-gray-400 hover:text-red-500"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Order summary */}
          <div className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
            <h2 className="text-lg font-medium text-gray-900">Souhrn objednávky</h2>

            <dl className="mt-6 space-y-4">
              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <dt className="text-base font-medium text-gray-900">Celkem</dt>
                <dd className="text-base font-medium text-gray-900">
                  {formatPrice(total)}
                </dd>
              </div>
            </dl>

            <div className="mt-6">
              <Link
                href="/checkout"
                className="w-full rounded-md bg-blue-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-50 block text-center transition-colors"
              >
                Pokračovat k objednávce
              </Link>
            </div>

            <div className="mt-6 text-center text-sm text-gray-500">
              <p>
                nebo{' '}
                <Link
                  href="/products"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  pokračovat v nákupu
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}