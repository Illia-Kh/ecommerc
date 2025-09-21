import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { formatPrice } from '@/lib/utils';
import { redirect } from 'next/navigation';

export default async function AccountPage() {
  const session = await auth();
  
  if (!session) {
    redirect('/auth/signin');
  }

  const orders = await db.order.findMany({
    where: { userId: session.user.id },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Můj účet
          </h1>
          
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              Přihlášen jako: <span className="font-medium">{session.user.email}</span>
            </p>
            <p className="text-sm text-gray-600">
              Role: <span className="font-medium">{session.user.role}</span>
            </p>
          </div>

          <div className="mt-12">
            <h2 className="text-xl font-semibold text-gray-900">Moje objednávky</h2>
            
            {orders.length > 0 ? (
              <div className="mt-6 space-y-6">
                {orders.map((order) => (
                  <div key={order.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Objednávka #{order.id.slice(-8)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString('cs-CZ')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {formatPrice(order.totalCZK)}
                        </p>
                        <p className={`text-sm ${
                          order.status === 'PAID' ? 'text-green-600' :
                          order.status === 'PENDING' ? 'text-yellow-600' :
                          order.status === 'SHIPPED' ? 'text-blue-600' :
                          'text-red-600'
                        }`}>
                          {order.status === 'PAID' && 'Zaplaceno'}
                          {order.status === 'PENDING' && 'Čeká na platbu'}
                          {order.status === 'SHIPPED' && 'Odesláno'}
                          {order.status === 'CANCELLED' && 'Zrušeno'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Dodací adresa:</span> {order.shippingAddress}
                      </p>
                    </div>

                    {order.items.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-900">Položky:</h4>
                        <ul className="mt-2 space-y-1">
                          {order.items.map((item) => (
                            <li key={item.id} className="text-sm text-gray-600">
                              {item.product?.titleCs || 'Produkt'} × {item.qty} - {formatPrice(item.unitPriceCZK)}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-6 text-center py-12">
                <p className="text-gray-500">Zatím nemáte žádné objednávky.</p>
                <div className="mt-4">
                  <a
                    href="/products"
                    className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                  >
                    Začít nakupovat
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}