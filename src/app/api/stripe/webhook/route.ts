import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { db } from '@/lib/db';
import { headers } from 'next/headers';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = (await headers()).get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        
        if (session.metadata?.orderId) {
          // Update order status to PAID
          await db.order.update({
            where: { id: session.metadata.orderId },
            data: { 
              status: 'PAID',
              paymentId: session.id,
            },
          });
          
          console.log(`Order ${session.metadata.orderId} marked as PAID`);
        }
        break;
      }
      
      case 'checkout.session.expired': {
        const session = event.data.object;
        
        if (session.metadata?.orderId) {
          // You might want to handle expired sessions
          console.log(`Checkout session ${session.id} expired for order ${session.metadata.orderId}`);
        }
        break;
      }
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}