'use client';

import { useEffect, useState } from 'react';
import { redirect } from 'next/navigation';
import { formatPrice } from '@/lib/utils';
import { CartItem } from '@/lib/cart';
import { createCheckoutSession } from './actions';
import { trackBeginCheckout } from '@/components/analytics-ga4';
import { trackPixelInitiateCheckout } from '@/components/analytics-pixel';

export default function CheckoutPage() {
  const [cart, setCart] = useState<{ items: CartItem[] }>({ items: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const cartData = JSON.parse(savedCart);
      setCart(cartData);
      
      // Track begin checkout
      if (cartData.items.length > 0) {
        const total = cartData.items.reduce((sum: number, item: CartItem) => sum + (item.price * item.quantity), 0);
        const items = cartData.items.map((item: CartItem) => ({
          item_id: item.productId,
          item_name: item.title,
          item_category: 'Product',
          price: item.price / 100,
          quantity: item.quantity,
        }));
        
        trackBeginCheckout('CZK', total, items);
        trackPixelInitiateCheckout(total);
      }
    }
    setIsLoading(false);
  }, []);

  const total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (cart.items.length === 0) return;
    
    setIsSubmitting(true);

    try {
      const checkoutItems = cart.items.map(item => ({
        name: item.title,
        priceCZK: item.price,
        qty: item.quantity,
      }));

      const checkoutUrl = await createCheckoutSession(checkoutItems, formData);
      
      if (checkoutUrl) {
        // Clear cart before redirecting to Stripe
        localStorage.removeItem('cart');
        window.location.href = checkoutUrl;
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Chyba při vytváření objednávky. Zkuste to prosím znovu.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="text-center">
            <p>Načítám...</p>
          </div>
        </div>
      </div>
    );
  }

  if (cart.items.length === 0) {
    redirect('/cart');
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-none">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Dokončení objednávky
          </h1>

          <form onSubmit={handleSubmit} className="mt-12 lg:grid lg:grid-cols-12 lg:gap-x-12">
            <div className="lg:col-span-7">
              <div className="border-b border-gray-200 pb-10">
                <h2 className="text-lg font-medium text-gray-900">
                  Dodací údaje
                </h2>

                <div className="mt-6 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-6">
                  <div className="sm:col-span-6">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Jméno a příjmení
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border px-3 py-2"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-6">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <div className="mt-1">
                      <input
                        type="email"
                        id="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border px-3 py-2"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-6">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Telefon
                    </label>
                    <div className="mt-1">
                      <input
                        type="tel"
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border px-3 py-2"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-6">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                      Adresa
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="address"
                        rows={3}
                        required
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border px-3 py-2"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order summary */}
            <div className="mt-10 lg:col-span-5 lg:mt-0">
              <h2 className="text-lg font-medium text-gray-900">Souhrn objednávky</h2>

              <div className="mt-4 rounded-lg border border-gray-200 bg-white shadow-sm">
                <ul className="divide-y divide-gray-200">
                  {cart.items.map((item) => (
                    <li key={item.productId} className="flex px-4 py-6 sm:px-6">
                      <div className="flex-shrink-0">
                        <img
                          src={item.image || '/placeholder.jpg'}
                          alt={item.title}
                          className="w-20 rounded-md"
                        />
                      </div>
                      <div className="ml-6 flex flex-1 flex-col">
                        <div className="flex">
                          <div className="min-w-0 flex-1">
                            <h4 className="text-sm">
                              <span className="font-medium text-gray-700">
                                {item.title}
                              </span>
                            </h4>
                          </div>
                        </div>
                        <div className="flex flex-1 items-end justify-between pt-2">
                          <p className="mt-1 text-sm font-medium text-gray-900">
                            {formatPrice(item.price)}
                          </p>
                          <div className="ml-4">
                            <span className="text-sm text-gray-500">Ks: {item.quantity}</span>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                <dl className="space-y-6 border-t border-gray-200 px-4 py-6 sm:px-6">
                  <div className="flex items-center justify-between pt-4">
                    <dt className="text-base font-medium">Celkem</dt>
                    <dd className="text-base font-medium text-gray-900">
                      {formatPrice(total)}
                    </dd>
                  </div>
                </dl>
                <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-md bg-blue-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSubmitting ? 'Zpracovávám...' : 'Dokončit objednávku'}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}