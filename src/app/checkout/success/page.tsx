'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { trackPurchase } from '@/components/analytics-ga4';
import { trackPixelPurchase } from '@/components/analytics-pixel';

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (sessionId) {
      // Track purchase analytics
      // In a real implementation, you'd fetch the order details from your backend
      // For now, we'll track a generic purchase event
      trackPurchase(sessionId, 0, []); // You'd get actual values from order
      trackPixelPurchase(0);
    }
    setIsLoading(false);
  }, [sessionId]);

  if (isLoading) {
    return (
      <div className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="text-center">
            <p>Ověřuji objednávku...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-8">
            <CheckCircle className="mx-auto h-16 w-16 text-green-600" />
          </div>
          
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Děkujeme za objednávku!
          </h1>
          
          <p className="mt-4 text-lg text-gray-600">
            Vaše objednávka byla úspěšně zpracována. Na email vám brzy přijde potvrzení s detaily.
          </p>

          {sessionId && (
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">
                Číslo transakce: <span className="font-mono">{sessionId}</span>
              </p>
            </div>
          )}

          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-md bg-blue-600 px-6 py-3 text-base font-medium text-white hover:bg-blue-700 transition-colors"
            >
              Pokračovat v nákupu
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            
            <Link
              href="/account"
              className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Zobrazit objednávky
            </Link>
          </div>

          <div className="mt-12 border-t border-gray-200 pt-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Co dál?</h2>
            <div className="text-left max-w-md mx-auto space-y-3 text-sm text-gray-600">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                </div>
                <p className="ml-3">Potvrzení objednávky vám přijde na email do 5 minut</p>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                </div>
                <p className="ml-3">Vaše objednávka bude expedována do 24 hodin</p>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                </div>
                <p className="ml-3">Sledovací číslo zásilky vám pošleme SMS i emailem</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}