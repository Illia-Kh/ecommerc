import Link from 'next/link';
import { auth } from '@/lib/auth';
import { t } from '@/lib/i18n';
import { LanguageSwitcher } from './language-switcher';
import { ShoppingCart, User, Shield } from 'lucide-react';

export async function Header() {
  const session = await auth();
  const locale = 'cs'; // TODO: Get from context/cookies

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-900">
              E-Shop
            </Link>
          </div>

          <nav className="hidden md:flex space-x-8">
            <Link
              href="/products"
              className="text-gray-500 hover:text-gray-900 transition-colors"
            >
              {t('nav.products', locale)}
            </Link>
            <Link
              href="/cart"
              className="text-gray-500 hover:text-gray-900 transition-colors flex items-center"
            >
              <ShoppingCart className="w-4 h-4 mr-1" />
              {t('nav.cart', locale)}
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            
            {session ? (
              <div className="flex items-center space-x-4">
                <Link
                  href="/account"
                  className="text-gray-500 hover:text-gray-900 transition-colors flex items-center"
                >
                  <User className="w-4 h-4 mr-1" />
                  {t('nav.account', locale)}
                </Link>
                
                {session.user.role === 'ADMIN' && (
                  <Link
                    href="/admin"
                    className="text-gray-500 hover:text-gray-900 transition-colors flex items-center"
                  >
                    <Shield className="w-4 h-4 mr-1" />
                    {t('nav.admin', locale)}
                  </Link>
                )}
                
                <form action="/api/auth/signout" method="post">
                  <button
                    type="submit"
                    className="text-gray-500 hover:text-gray-900 transition-colors"
                  >
                    {t('nav.signout', locale)}
                  </button>
                </form>
              </div>
            ) : (
              <Link
                href="/auth/signin"
                className="text-gray-500 hover:text-gray-900 transition-colors"
              >
                {t('nav.signin', locale)}
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}