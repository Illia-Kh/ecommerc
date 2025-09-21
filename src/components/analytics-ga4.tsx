'use client';

import Script from 'next/script';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

export function AnalyticsGA4() {
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

  if (!GA_ID) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}
      </Script>
    </>
  );
}

export function trackEvent(eventName: string, parameters?: Record<string, any>) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, {
      currency: 'CZK',
      ...parameters,
    });
  }
}

export function trackPurchase(transactionId: string, value: number, items: any[]) {
  trackEvent('purchase', {
    transaction_id: transactionId,
    value: value / 100, // Convert from haleru to CZK
    items: items,
  });
}

export function trackAddToCart(currency: string, value: number, items: any[]) {
  trackEvent('add_to_cart', {
    currency,
    value: value / 100,
    items,
  });
}

export function trackViewItem(currency: string, value: number, items: any[]) {
  trackEvent('view_item', {
    currency,
    value: value / 100,
    items,
  });
}

export function trackBeginCheckout(currency: string, value: number, items: any[]) {
  trackEvent('begin_checkout', {
    currency,
    value: value / 100,
    items,
  });
}