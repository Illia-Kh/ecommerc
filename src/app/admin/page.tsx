import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Shield, Upload, Package, Users, BarChart3 } from 'lucide-react';

export default async function AdminPage() {
  const session = await auth();
  
  if (!session || session.user.role !== 'ADMIN') {
    redirect('/');
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center space-x-4">
            <Shield className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Administrace
            </h1>
          </div>
          
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              Vítejte v administraci, <span className="font-medium">{session.user.email}</span>
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Products Management */}
            <div className="group relative rounded-lg border border-gray-300 bg-white p-6 hover:border-gray-400 hover:shadow-sm transition-all">
              <div>
                <span className="rounded-lg inline-flex p-3 bg-purple-50 text-purple-700 ring-4 ring-white">
                  <Package className="h-6 w-6" />
                </span>
              </div>
              <div className="mt-8">
                <h3 className="text-lg font-medium">
                  <span className="absolute inset-0" />
                  Správa produktů
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Přidávání, editace a mazání produktů. Správa kategorií a skladových zásob.
                </p>
              </div>
              <span className="pointer-events-none absolute right-6 top-6 text-gray-300 group-hover:text-gray-400">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
                </svg>
              </span>
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-sm font-medium text-gray-900">TODO: Products CRUD + uploads</span>
              </div>
            </div>

            {/* Media Upload */}
            <div className="group relative rounded-lg border border-gray-300 bg-white p-6 hover:border-gray-400 hover:shadow-sm transition-all">
              <div>
                <span className="rounded-lg inline-flex p-3 bg-green-50 text-green-700 ring-4 ring-white">
                  <Upload className="h-6 w-6" />
                </span>
              </div>
              <div className="mt-8">
                <h3 className="text-lg font-medium">
                  <span className="absolute inset-0" />
                  Nahrávání médií
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Upload obrázků produktů do Cloudinary. Správa mediální knihovny.
                </p>
              </div>
              <span className="pointer-events-none absolute right-6 top-6 text-gray-300 group-hover:text-gray-400">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
                </svg>
              </span>
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-sm font-medium text-gray-900">TODO: Media upload interface</span>
              </div>
            </div>

            {/* Users Management */}
            <div className="group relative rounded-lg border border-gray-300 bg-white p-6 hover:border-gray-400 hover:shadow-sm transition-all">
              <div>
                <span className="rounded-lg inline-flex p-3 bg-yellow-50 text-yellow-700 ring-4 ring-white">
                  <Users className="h-6 w-6" />
                </span>
              </div>
              <div className="mt-8">
                <h3 className="text-lg font-medium">
                  <span className="absolute inset-0" />
                  Správa uživatelů
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Správa uživatelských účtů, rolí a oprávnění.
                </p>
              </div>
              <span className="pointer-events-none absolute right-6 top-6 text-gray-300 group-hover:text-gray-400">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
                </svg>
              </span>
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-sm font-medium text-gray-900">TODO: User management</span>
              </div>
            </div>

            {/* Analytics */}
            <div className="group relative rounded-lg border border-gray-300 bg-white p-6 hover:border-gray-400 hover:shadow-sm transition-all sm:col-span-2 lg:col-span-1">
              <div>
                <span className="rounded-lg inline-flex p-3 bg-blue-50 text-blue-700 ring-4 ring-white">
                  <BarChart3 className="h-6 w-6" />
                </span>
              </div>
              <div className="mt-8">
                <h3 className="text-lg font-medium">
                  <span className="absolute inset-0" />
                  Analytika
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Zobrazení statistik prodejů, návštěvnosti a dalších metrik.
                </p>
              </div>
              <span className="pointer-events-none absolute right-6 top-6 text-gray-300 group-hover:text-gray-400">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
                </svg>
              </span>
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-sm font-medium text-gray-900">TODO: Analytics dashboard</span>
              </div>
            </div>
          </div>

          <div className="mt-12 rounded-lg bg-yellow-50 p-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Vývojová verze
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    Toto je základní struktura administrace. Pro plnou funkcionalité je potřeba implementovat CRUD operace pro produkty, uživatele a další funkce.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}