'use server';

import { stripe } from '@/lib/stripe';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';

interface CheckoutItem {
  name: string;
  priceCZK: number;
  qty: number;
}

interface ShippingData {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export async function createCheckoutSession(
  items: CheckoutItem[],
  shippingData: ShippingData
) {
  try {
    const session = await auth();
    
    // Calculate total
    const totalCZK = items.reduce((sum, item) => sum + (item.priceCZK * item.qty), 0);
    
    // Create order in database
    const order = await db.order.create({
      data: {
        userId: session?.user?.id || null,
        status: 'PENDING',
        totalCZK,
        paymentProvider: 'stripe',
        shippingMethod: 'standard',
        shippingName: shippingData.name,
        shippingEmail: shippingData.email,
        shippingPhone: shippingData.phone || null,
        shippingAddress: shippingData.address,
        items: {
          create: items.map(item => ({
            productId: 'temp-id', // We'll need to match this properly
            qty: item.qty,
            unitPriceCZK: item.priceCZK,
          })),
        },
      },
    });

    // Create Stripe checkout session
    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: shippingData.email,
      line_items: items.map(item => ({
        price_data: {
          currency: 'czk',
          product_data: {
            name: item.name,
          },
          unit_amount: item.priceCZK, // Stripe expects amount in haleru (cents)
        },
        quantity: item.qty,
      })),
      success_url: `${process.env.SITE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.SITE_URL}/cart`,
      metadata: {
        orderId: order.id,
      },
    });

    // Update order with Stripe session ID
    await db.order.update({
      where: { id: order.id },
      data: { paymentId: stripeSession.id },
    });

    return stripeSession.url;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw new Error('Failed to create checkout session');
  }
}